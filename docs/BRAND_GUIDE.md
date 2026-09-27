# Brand Guide

> Tokens live in `src/styles/global.css` (`@theme` + `:root` / `html.dark` blocks).
> See [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) for the semantic-token table; this
> file is the higher-level brand narrative.

## Chapter identity

- **Organization:** Theta Tau — the nation's oldest and largest professional engineering fraternity.
- **Chapter:** Pi Delta Chapter, University of California, Irvine.
- **Founded at UCI:** Winter 2011 · **Installed as Pi Delta Chapter:** April 14, 2013.
- Content source of truth: `thetatau-uci-context.md` at the repo root.

## Theme direction — warm collegiate (not tech-startup)

- **Default theme is light** — a warm parchment cream (`#f0e1c2`) that reads "library
  reading room", not "SaaS landing page". Dark is opt-in via the navbar toggle.
- Dark mode is a brown-tinted near-black (`#1a0e08`) with brighter gold and a SVG paper
  grain overlay — "study lounge" rather than "tech dashboard".
- Maroon and gold are the brand anchors in both themes. Light mode uses darker gold
  (`#7a5a1f`) for small text to hit AA contrast on cream; dark mode uses brighter gold
  (`#d4b56a`) for the same reason on dark.
- Generous whitespace, soft `rounded-3xl` cards, Playfair Display for headings, hand-drawn
  gold dotted dividers (`<hr class="divider-soft">`) between major sections.

## Brand color anchors

| Token | Hex | Notes |
| --- | --- | --- |
| `--color-brand-600` | `#7b1e1e` | Primary maroon (buttons, icon chips) |
| `--color-brand-800` | `#4a0404` | Elevated dark surfaces |
| `--color-brand-900` | `#1a0505` | Hero / banner background (dark by design in both themes) |
| `--color-accent-500` | `#c9a84c` | Primary gold CTA |
| `--color-accent-400` | `#ddc074` | Light gold for text on dark surfaces |

Theme-aware semantic tokens (preferred for body/text/surface): see DESIGN_SYSTEM.md.

## Typography

- **Display/headings:** **Playfair Display** (variable serif) — high-contrast, elegant.
  Used for all H1/H2 and the brand logotype in the navbar.
- **Body:** **Inter** — clean, highly legible sans.
- Loaded via Google Fonts `<link>` in `PageLayout.astro`.
- Rule: no sans-serif for H1/H2; no fonts beyond Playfair Display + Inter.

## Logo / crest

- Inline shield-crest SVG in `Navbar.astro` (placeholder mark — replace with the official
  Theta Tau crest when licensing/files are confirmed).
- Favicon: `public/favicon.svg`.

## Tone of voice

- Professional, warm, confident. Not corporate, not jargon-heavy.
- Collegiate — written for prospective rushees and alumni, not enterprise buyers.

## Accessibility constraints

- WCAG 2.2 AA contrast for all brand color pairings — verified for the current palette.
- Do not rely on color alone to convey meaning.
- Ensure logo/text remains legible at small sizes and in both themes.

## Imagery

- Photography style and treatment: TBD (no real photography committed yet).
- **Consent:** member/event photos require permission. Do not publish identifiable
  photos without confirmation.
