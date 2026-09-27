// Roster migration helper for integrating the live Pi Delta site into this
// redesign. READ-ONLY by design: it never writes into this repo and never
// copies images. It parses the original `brother_info.js` (the live site's real
// data source) plus the brothers-images repo and either reports coverage or
// emits a draft TypeScript roster for review. See docs/INTEGRATION_PLAN.md.
//
// Usage:
//   node scripts/migrate-roster.mjs --src <pi-delta-site> --images <pi-delta-brothers-images> --report
//   node scripts/migrate-roster.mjs --src <pi-delta-site> --images <pi-delta-brothers-images> --emit > /tmp/roster.draft.ts
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

// ---- args ---------------------------------------------------------------
const args = process.argv.slice(2);
const getFlag = (name) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
};
const SRC = getFlag('--src');
const IMAGES = getFlag('--images');
const MODE = args.includes('--emit') ? 'emit' : 'report';

if (!SRC) {
  console.error('Missing --src <path to cloned pi-delta-site>. See docs/INTEGRATION_PLAN.md.');
  process.exit(1);
}

// Same key transform the redesign uses for /images/brothers/<key>.jpg
const keyOf = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
const real = (v) =>
  typeof v === 'string' && v.trim() && v.trim() !== 'NULL' ? v.trim() : undefined;

const EXEC_TITLES = new Set([
  'regent',
  'vice-regent',
  'vice regent',
  'marshal',
  'marshall',
  'treasurer',
  'scribe',
  'corresponding secretary',
]);

function tierFor(b) {
  if (real(b.active_status) !== 'Y') return 'alumni';
  const pos = real(b.cabby_exec_position);
  if (real(b.cabby_exec_status) === 'Y' && pos) {
    return EXEC_TITLES.has(pos.toLowerCase()) ? 'exec' : 'officer';
  }
  return 'active';
}

// ---- load the original roster ------------------------------------------
async function loadBrothers() {
  const file = join(SRC, 'src', 'Pages', 'Brothers', 'brother_info.js');
  // brother_info.js is `export const brotherInfo = [ ... ]` — import it as a module.
  const mod = await import(pathToFileURL(file).href);
  const list = mod.brotherInfo ?? mod.default;
  if (!Array.isArray(list)) throw new Error('Could not read brotherInfo array from ' + file);
  return list;
}

// ---- index the headshot repo by key ------------------------------------
async function indexImages() {
  const byKey = new Map();
  if (!IMAGES) return byKey;
  const folders = await readdir(IMAGES, { withFileTypes: true });
  for (const f of folders) {
    if (!f.isDirectory() || f.name.startsWith('.')) continue;
    let files = [];
    try {
      files = await readdir(join(IMAGES, f.name));
    } catch {
      continue;
    }
    for (const file of files) {
      const m = file.match(/^(.+)\.(jpe?g|png)$/i);
      if (!m) continue;
      // ignore casual "name_casual - ..." variants; keep plain headshots
      const base = m[1].toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!byKey.has(base)) byKey.set(base, join(f.name, file));
    }
  }
  return byKey;
}

// ---- main ---------------------------------------------------------------
const brothers = await loadBrothers();
const images = await indexImages();

const mapped = brothers.map((b) => {
  const key = keyOf(b.name ?? '');
  return {
    name: b.name,
    major: real(b.major),
    tier: tierFor(b),
    role: real(b.cabby_exec_position),
    memberClass: real(b.class) === 'Founding' ? 'Founding Class' : real(b.class),
    gender: real(b.gender),
    linkedinUrl: real(b.linkedin_url),
    currentlyAt: real(b.company),
    hometown: real(b.hometown),
    funFact: real(b.fun_fact),
    year: real(b.year),
    interests: Array.isArray(b.hobbies) ? b.hobbies.filter(Boolean) : undefined,
    experience: Array.isArray(b.experience) ? b.experience.filter(Boolean) : undefined,
    photoKey: key,
    photoLocal: images.has(key) ? `/images/brothers/${key}.jpg` : undefined,
    photoSource: images.get(key) ?? real(b.profile_url),
    testimonial: real(b.testimonial),
  };
});

if (MODE === 'report') {
  const n = mapped.length;
  const withPhoto = mapped.filter((m) => m.photoLocal).length;
  const withLinkedIn = mapped.filter((m) => m.linkedinUrl).length;
  const companies = [...new Set(mapped.map((m) => m.currentlyAt).filter(Boolean))].sort();
  const byTier = mapped.reduce((a, m) => ((a[m.tier] = (a[m.tier] ?? 0) + 1), a), {});
  const byClass = mapped.reduce(
    (a, m) => ((a[m.memberClass] = (a[m.memberClass] ?? 0) + 1), a),
    {},
  );
  const missingPhoto = mapped.filter((m) => !m.photoLocal).map((m) => `${m.name} (${m.photoKey})`);

  console.log('=== Roster migration report ===');
  console.log(`Total brothers:        ${n}`);
  console.log(`By tier:               ${JSON.stringify(byTier)}`);
  console.log(`Headshot match:        ${withPhoto}/${n} (${Math.round((withPhoto / n) * 100)}%)`);
  console.log(`Has LinkedIn:          ${withLinkedIn}/${n}`);
  console.log(`Distinct companies:    ${companies.length}`);
  console.log(`Classes represented:   ${Object.keys(byClass).length}`);
  console.log('');
  console.log('Companies:', companies.join(', ') || '(none in data)');
  console.log('');
  console.log(`Missing headshot (${missingPhoto.length}):`);
  console.log(missingPhoto.join('\n') || '(all matched)');
} else {
  // --emit: a draft array for review before merging into chapter.ts
  const clean = mapped.map((m) => {
    const o = { ...m };
    delete o.photoKey;
    delete o.photoSource;
    if (o.photoLocal) o.photo = o.photoLocal;
    delete o.photoLocal;
    Object.keys(o).forEach((k) => o[k] === undefined && delete o[k]);
    return o;
  });
  console.log('// DRAFT — review before merging into src/data/chapter.ts.');
  console.log('// Generated by scripts/migrate-roster.mjs from the live site brother_info.js.');
  console.log('export const importedRoster = ' + JSON.stringify(clean, null, 2) + ';');
}
