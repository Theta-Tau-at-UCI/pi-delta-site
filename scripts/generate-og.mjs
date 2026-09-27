// One-off generator for the default Open Graph / Twitter card image.
// Produces public/images/og-default.png (1200x630) — a branded fallback used by
// SEO.astro for any page that doesn't set its own `image`. Pure chapter
// identity (maroon + gold, ΠΔ monogram, name) — no member content.
//
// Run with:  node scripts/generate-og.mjs
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const W = 1200;
const H = 630;

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c0303"/>
      <stop offset="55%" stop-color="#4a0404"/>
      <stop offset="100%" stop-color="#1a0505"/>
    </linearGradient>
    <radialGradient id="glow" cx="18%" cy="12%" r="60%">
      <stop offset="0%" stop-color="#d4b56a" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#d4b56a" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- gold keyline frame -->
  <rect x="36" y="36" width="${W - 72}" height="${H - 72}" rx="18"
        fill="none" stroke="#c9a84c" stroke-opacity="0.55" stroke-width="2"/>

  <!-- oversized chapter monogram, faint, bleeding off the right -->
  <text x="${W - 70}" y="${H - 78}" text-anchor="end"
        font-family="Georgia, 'Times New Roman', serif" font-weight="700"
        font-size="430" fill="#d4b56a" fill-opacity="0.10">ΠΔ</text>

  <!-- eyebrow -->
  <text x="96" y="250" font-family="Georgia, 'Times New Roman', serif"
        font-size="34" letter-spacing="6" fill="#ddc074" fill-opacity="0.92">
    THE PROFESSIONAL ENGINEERING FRATERNITY
  </text>

  <!-- wordmark -->
  <text x="92" y="370" font-family="Georgia, 'Times New Roman', serif"
        font-weight="700" font-size="128" fill="#ffffff">Theta Tau</text>

  <!-- chapter line -->
  <text x="96" y="452" font-family="Georgia, 'Times New Roman', serif"
        font-size="46" fill="#f7ecd9" fill-opacity="0.9">
    Pi Delta Chapter &#183; UC Irvine
  </text>

  <!-- gold underline accent -->
  <rect x="98" y="486" width="220" height="5" rx="2.5" fill="#c9a84c"/>
</svg>`;

const out = fileURLToPath(new URL('../public/images/og-default.png', import.meta.url));
await sharp(Buffer.from(svg)).png().toFile(out);
console.log('Wrote', out);
