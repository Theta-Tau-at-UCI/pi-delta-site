// One-time content import: pulls real images + per-brother metadata from the
// (read-only) clones of the live site into this redesign. Produces:
//   - public/images/brothers/<key>.jpg   (optimized headshots, key = name slug)
//   - public/images/pillars/{brotherhood,professionalism,service}.jpg
//   - public/images/chapter/*.jpg        (optimized chapter photos)
//   - public/videos/{rush-teaser,rush-recruitment}.mp4
//   - public/logos/*                     (company logos)
//   - src/data/brother-photos.generated.ts  (photo keys + linkedin + company)
//
// Headshots are driven by each brother's `profile_url` in brother_info.js — the
// EXACT image the live site currently posts — not a folder scan. When two
// brothers share a name slug (e.g. multiple "Andrew Nguyen"), the ACTIVE record
// wins, so the current roster shows the current brother.
//
// Run (after cloning the two source repos somewhere read-only):
//   node scripts/import-assets.mjs --site <pi-delta-site> --images <pi-delta-brothers-images>
import { mkdir, readdir, copyFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const args = process.argv.slice(2);
const flag = (n) => {
  const i = args.indexOf(n);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
};
const SITE = flag('--site');
const IMAGES = flag('--images');
if (!SITE || !IMAGES) {
  console.error(
    'Usage: node scripts/import-assets.mjs --site <pi-delta-site> --images <pi-delta-brothers-images>',
  );
  process.exit(1);
}

const REPO = fileURLToPath(new URL('..', import.meta.url));
const pub = (...p) => join(REPO, 'public', ...p);
const ensure = (d) => mkdir(d, { recursive: true });
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const real = (v) =>
  typeof v === 'string' && v.trim() && v.trim() !== 'NULL' && v.trim() !== 'N/A'
    ? v.trim()
    : undefined;

let copied = { brothers: 0, pillars: 0, chapter: 0, videos: 0, logos: 0 };

// Resolve a brothers-images raw GitHub URL to its local path in the clone.
function localFromProfileUrl(url) {
  const marker = '/main/';
  const i = url.indexOf(marker);
  if (i === -1) return null;
  const rel = decodeURIComponent(url.slice(i + marker.length));
  return join(IMAGES, rel);
}

// ---- Load the live roster (source of truth for photos + metadata) ----------
const infoMod = await import(pathToFileURL(join(SITE, 'src/Pages/Brothers/brother_info.js')).href);
const info = infoMod.brotherInfo ?? infoMod.default ?? [];

// Choose one record per name slug, preferring the ACTIVE brother for shared
// names so the current roster never inherits an older brother's photo.
const chosen = new Map(); // key -> { rec, active }
for (const b of info) {
  const key = slug(b.name ?? '');
  if (!key) continue;
  const active = real(b.active_status) === 'Y';
  const prev = chosen.get(key);
  if (!prev || (active && !prev.active)) chosen.set(key, { rec: b, active });
}

// ---- 1. Headshots from each brother's profile_url --------------------------
await ensure(pub('images', 'brothers'));
const photoKeys = new Set();
const missing = [];
for (const [key, { rec }] of chosen) {
  const url = real(rec.profile_url);
  if (!url) continue;
  // The live site uses a "no_photo_available" placeholder for brothers without
  // a headshot — treat that as no photo so the card falls back to initials.
  if (/no_photo_available/i.test(url)) continue;
  const src = localFromProfileUrl(url);
  if (!src || !existsSync(src)) {
    missing.push(`${rec.name} -> ${url}`);
    continue;
  }
  try {
    // 3:4 to match the card portrait box (no CSS double-crop), anchored at the
    // top so we keep the head and show more of the torso/body (not a face zoom).
    await sharp(src)
      .rotate()
      .resize(660, 880, { fit: 'cover', position: 'top' })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(pub('images', 'brothers', `${key}.jpg`));
    photoKeys.add(key);
    copied.brothers++;
  } catch (e) {
    missing.push(`${rec.name} (decode error: ${e.message})`);
  }
}

// ---- 2. Pillar photos ------------------------------------------------------
await ensure(pub('images', 'pillars'));
const pillarMap = {
  brotherhood: 'src/Media/chapter-photos/brotherhood/winter_retreat_2026.jpg',
  professionalism: 'src/Media/chapter-photos/professionalism/prof.jpeg',
  service: 'src/Media/chapter-photos/service/winter_service_2026.jpg',
};
for (const [name, rel] of Object.entries(pillarMap)) {
  const src = join(SITE, rel);
  if (!existsSync(src)) continue;
  await sharp(src)
    .rotate()
    .resize(1200, 1500, { fit: 'cover' })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(pub('images', 'pillars', `${name}.jpg`));
  copied.pillars++;
}

// ---- 3. Chapter photos (optimized) ----------------------------------------
await ensure(pub('images', 'chapter'));
const chapterMap = {
  'winter-2024-photoshoot.jpg': 'src/Media/chapter-photos/winter_photoshoot_2024.jpg',
  'spring-2025-group.jpg': 'src/Media/chapter-photos/spring2025_chapter_photo.jpg',
  'spring-2025-hbs.jpg': 'src/Media/chapter-photos/spring2025_hbs.jpg',
  'winter-retreat-2024.jpg': 'src/Media/chapter-photos/landing/winter_retreat_2024.jpg',
};
for (const [out, rel] of Object.entries(chapterMap)) {
  const src = join(SITE, rel);
  if (!existsSync(src)) continue;
  await sharp(src)
    .rotate()
    .resize(2000, 1500, { fit: 'inside' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(pub('images', 'chapter', out));
  copied.chapter++;
}

// ---- 4. Videos -------------------------------------------------------------
await ensure(pub('videos'));
const videoMap = {
  'rush-teaser.mp4': 'src/Media/animations/Spring_Rush_Teaser_Compressed_.mp4',
  'rush-recruitment.mp4': 'src/Media/rush/rush_section2.mp4',
};
for (const [out, rel] of Object.entries(videoMap)) {
  const src = join(SITE, rel);
  if (!existsSync(src)) continue;
  await copyFile(src, pub('videos', out));
  copied.videos++;
}

// ---- 5. Company logos ------------------------------------------------------
await ensure(pub('logos'));
const logoDir = join(SITE, 'src/Media/companies');
for (const file of await readdir(logoDir)) {
  if (file === 'test' || file.startsWith('.')) continue;
  await copyFile(join(logoDir, file), pub('logos', file.replace(/_/g, '-').replace('&', '')));
  copied.logos++;
}

// ---- 6. Per-brother metadata (active-preferred via `chosen`) ---------------
const brotherMeta = {};
const activeCo = new Set();
for (const [key, { rec, active }] of chosen) {
  const linkedinUrl = real(rec.linkedin_url);
  const company = real(rec.company);
  if (linkedinUrl || company)
    brotherMeta[key] = { ...(linkedinUrl && { linkedinUrl }), ...(company && { company }) };
  if (company && active) activeCo.add(company);
}

const header = `// AUTO-GENERATED by scripts/import-assets.mjs — do not edit by hand.\n// Real headshot keys + per-brother metadata pulled from the live site.\n\n`;
const out =
  header +
  `export const brotherPhotoKeys: string[] = ${JSON.stringify([...photoKeys].sort(), null, 2)};\n\n` +
  `export const brotherMeta: Record<string, { linkedinUrl?: string; company?: string }> = ${JSON.stringify(brotherMeta, null, 2)};\n`;
await writeFile(join(REPO, 'src/data/brother-photos.generated.ts'), out);

console.log('Imported:', copied);
console.log('Headshot keys:', photoKeys.size, '| metadata:', Object.keys(brotherMeta).length);
console.log('Active employers:', [...activeCo].sort().join(', '));
console.log(`Headshots with no local file (${missing.length}):`);
console.log(missing.join('\n') || '(all resolved)');
