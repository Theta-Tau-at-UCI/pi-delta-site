# Editorial Archival — Design Foundations (Spec)

**Date:** 2026-06-06
**Status:** Draft for review
**Sub-project:** ① of 3 in the "Full Editorial Archival pass" (see Decomposition).

## Context

The Theta Tau · Pi Delta chapter site (Astro 6 + React islands + Tailwind v4,
7 pages, paper-white light theme + dark mode) is functional and about to launch.
A reviewer noted it "looks clauded" — i.e., competent but anonymous, lacking a
human point of view. Through brainstorming we chose a single identity:

> **"Editorial Archival"** — the *structure* of quiet-luxury editorial design
> (serif display, generous whitespace, photography-forward, restrained palette)
> carrying the *soul* of an official archive (subtle paper, stamps/seals, torn
> edges — used sparingly, never cutesy).

This spec covers **only the foundations**: the reusable token + primitive layer
that the page redesign (②) and motion system (③) will build on. It deliberately
does **not** restyle existing pages or add page transitions.

## Decomposition (for reference)

1. **① Design Foundations** ← *this spec*. Tokens + archival primitives + a
   preview page. Low risk; unblocks ② and ③.
2. **② Editorial page identity.** Apply foundations across pages (heroes,
   section rhythm, photo treatments). Depends on ①.
3. **③ Motion system + label-swipe transition.** Astro `<ClientRouter />`,
   the signature "label swipe," scroll reveals, reduced-motion. Depends on ①.

## Goals

- Establish a **generous, dramatic editorial type scale & spacing rhythm** as
  Tailwind v4 `@theme` tokens in `src/styles/global.css`.
- Add three **archival primitives** as reusable, restrained building blocks:
  **paper grain**, **stamp / wax seal**, **torn / deckle edge**.
- Keep **Fraunces** (display) + **Plus Jakarta Sans** (body); formalize their
  scale, weights, tracking, and reading measure.
- Ship a **dev-only style-guide page** to review foundations in isolation.
- Preserve everything: all 7 pages keep working, dark mode intact, AA contrast,
  fast static build, `prefers-reduced-motion` respected.

## Non-goals (explicitly out of scope)

- No redesign of existing page heroes/sections (that's ②).
- No page transitions or scroll-reveal motion (that's ③).
- No new fonts; no palette overhaul (paper-white palette stays).
- No new content, member data, or images.

## Design

### 1. Typography

Keep the two families already loaded in `PageLayout.astro`:
- **Display:** Fraunces (variable; optical sizing on). Italic + gold for accent
  words (existing `--color-gold` pattern).
- **Body:** Plus Jakarta Sans.

Add a **modular type scale** ("generous & dramatic" → larger top end, strong
contrast). Proposed tokens (rem), ratio ≈ 1.25 with an amplified display tier:

| Token | Size | Use |
|---|---|---|
| `--text-xs` | 0.78 | labels, eyebrows (uppercase, tracked) |
| `--text-sm` | 0.9 | captions, meta |
| `--text-base` | 1.0 | body |
| `--text-lg` | 1.2 | lead paragraphs |
| `--text-xl` | 1.5 | small headings |
| `--text-2xl` | 2.0 | section headings |
| `--text-3xl` | 2.75 | page sub-headlines |
| `--text-display` | clamp(3rem, 7vw, 5.5rem) | hero display |

Supporting tokens: display line-height `1.04` + tracking `-0.015em`; body
line-height `1.6`; **reading measure** `--measure: 64ch` for editorial prose
blocks. Eyebrow/label style token: uppercase, `0.2em` tracking, muted color.

These are additive — existing utility usage keeps working; pages opt in during ②.

### 2. Spacing & rhythm (generous editorial)

Add spacing-rhythm tokens (larger than current):
- `--space-section` (vertical padding per section): clamp(4.5rem, 9vw, 9rem).
- `--space-block` (between sub-blocks): clamp(2rem, 4vw, 3.5rem).
- Container widths: `--container: 72rem` (full sections), `--measure: 64ch`
  (prose), and full-bleed allowance for photography.
These are tokens only here; ② applies them to real sections.

### 3. Color (mostly existing)

Paper-white light + warm dark theme stay. Add only what the archival primitives
need, with light **and** dark values:
- `--color-stamp` (faded maroon for stamps/seals) + dark variant.
- `--grain-opacity` (light ≈ 0.06, dark ≈ 0.09).
- `--color-paper-edge` (torn-edge paper fill = current surface; dark variant).
`--color-tape` already exists and is retained for later use (not in the chosen kit).

### 4. Archival primitives

Each is a **small, isolated, reusable** unit with light/dark + reduced-motion
behavior. All static (no animation in this sub-project).

**4a. Paper grain** — a site-wide, very subtle fixed noise overlay.
- Implementation: a single inline SVG `feTurbulence` data-URI as a background on
  a `.paper-grain` overlay element mounted once in `PageLayout.astro`
  (position:fixed; inset:0; pointer-events:none; `mix-blend-mode:multiply`;
  opacity from `--grain-opacity`; `z-index` below content).
- Constraint: must not reduce text contrast below AA — verify on lightest and
  darkest surfaces. Tiny (<1KB), no network request.

**4b. Stamp / wax seal** — reusable Astro component `src/components/ui/Stamp.astro`.
- Two variants via prop: `variant="stamp"` (rubber-stamp text, e.g. "EST. 2013",
  slight rotation, `--color-stamp`, letter-spaced uppercase Fraunces) and
  `variant="seal"` (circular dashed-border ΘΤ medallion).
- Props: `text`, `variant`, `rotate?`. Decorative → `aria-hidden` unless `text`
  carries meaning (then expose accessibly).

**4c. Torn / deckle edge** — extend the existing `SectionDivider`
(`src/components/ui/`) with a `variant="torn"` (clip-path / SVG mask giving a
ripped-paper bottom on a paper-fill block). Used on 1–2 section breaks only.
- Decorative, `aria-hidden`. Degrades to a clean edge where clip-path unsupported.

### 5. Style-guide preview page

`src/pages/styleguide.astro` — an unlinked, `noindex` route (not in nav, excluded
from any sitemap) rendering: the full type scale, color swatches (light+dark),
spacing samples, and the three archival primitives in context. Purpose: review
and tune foundations before ② applies them to real pages. Can be removed or
left as an internal reference.

## Architecture / where things live

| Concern | File |
|---|---|
| Type, spacing, color, archival tokens | `src/styles/global.css` (`@theme`) |
| Paper-grain overlay mount | `src/layouts/PageLayout.astro` |
| Stamp/seal component | `src/components/ui/Stamp.astro` (new) |
| Torn edge | `src/components/ui/SectionDivider.*` (extend) |
| Preview | `src/pages/styleguide.astro` (new, noindex) |

## Accessibility, performance, constraints

- **Contrast:** re-verify AA on light + dark after grain overlay.
- **Reduced motion:** no motion added here; primitives are static.
- **Performance:** grain = inline SVG; no images/fonts added. Static build stays.
- **Dark mode:** every archival token has a dark value.
- **Repo rules (CLAUDE.md):** TypeScript strict; small reusable accessible
  components; comments explain *why*; run `npm run check` + `npm run build`;
  no invented content; one concern per commit.

## Success criteria

1. `npm run check` and `npm run build` pass.
2. `/styleguide` renders the full scale + 3 primitives in light and dark.
3. All 7 existing pages render unchanged (foundations are additive/opt-in).
4. AA contrast holds with grain on.
5. Tokens + primitives are documented enough that ② can consume them without
   re-deriving values.

## Open questions

- Style-guide route: keep `/styleguide` permanently as internal reference, or
  delete after ②? (Default: keep, `noindex`.)
- Torn-edge: clip-path (lighter) vs inline SVG mask (more control)? Decide at
  build; default clip-path with graceful fallback.
