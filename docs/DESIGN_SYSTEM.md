# Design System

> Source of truth: `src/styles/global.css` (`@theme` + token blocks). This file is a
> narrative companion — keep it in sync after meaningful token changes.

## Themes

Light is the default. Dark is opt-in via a `.dark` class on `<html>`, applied by the
inline FOUC-prevention script in `PageLayout.astro` and toggled by the navbar
sun/moon button (`src/scripts/theme.ts`). The Tailwind `dark:` variant is wired
via `@custom-variant dark (&:where(.dark, .dark *));` in `global.css`.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--color-bg` | `#f0e1c2` | `#1a0e08` | Page background (warm parchment / brown-tinted near-black) |
| `--color-surface` | `#faf3e2` | `#261410` | Card / panel surface (lifts above bg) |
| `--color-surface-2` | `#e7d4ad` | `#321b15` | Nested / pressed-in regions |
| `--color-maroon` | `#7c0303` | `#8a1a1a` | Primary maroon |
| `--color-gold` | `#7a5a1f` | `#d4b56a` | Gold for small text (AA on bg) |
| `--color-gold-muted` | `#6a4d18` | `#b8902f` | Muted gold (rules, dots) |
| `--color-text` | `#2a0808` | `#f7ecd9` | Body text (AAA on bg) |
| `--color-text-muted` | `#5a3a26` | `#bfa890` | Muted body text (AA on bg) |
| `--color-border` | `#d9c39a` | `#4a2a1e` | Dividers, card borders |
| `--color-nav-glass` | `rgba(240,225,194,0.85)` | `rgba(26,14,8,0.85)` | Scrolled navbar backdrop |
| `--shadow-card` | maroon-tinted | near-black | Card hover shadow |
| `--color-shimmer` | maroon @ 22% | parchment @ 22% | Button shimmer accent |

Body also paints two radial "warmth" pools (top-left + bottom-right). In dark mode a SVG
fractal-noise paper grain is layered on top so dark surfaces never look flat black.

## Tailwind brand scale (`@theme`)

Defined unconditionally — these are absolute brand colors used by Tailwind utilities
(`bg-brand-700`, `text-brand-100`, etc.). The semantic tokens above are the preferred
way to address theme-aware values; reach for the brand scale when you need a specific
maroon/gold step regardless of theme.

| Token | Hex | Role |
| --- | --- | --- |
| `--color-brand-600` | `#7b1e1e` | Primary maroon (buttons, icon chips) |
| `--color-brand-700` | `#5c1414` | Hover / darker |
| `--color-brand-800` | `#4a0404` | Elevated dark surfaces |
| `--color-brand-900` | `#1a0505` | Near-black maroon backgrounds |
| `--color-accent-400` | `#ddc074` | Light gold (text on dark) |
| `--color-accent-500` | `#c9a84c` | Primary gold CTA / accents |
| `--color-accent-600` | `#a9842f` | Gold for light surfaces |

## Typography

- `--font-display`: **Playfair Display** (variable serif). All H1/H2 + the brand logotype.
- `--font-sans`: **Inter** (variable sans). Default body.
- Loaded via Google Fonts `<link>` in `PageLayout.astro` (preconnect first).
- Fallbacks: Georgia (display), system-ui (body).
- Rule: no sans-serif for H1/H2; no fonts beyond Playfair Display + Inter.

## Layout & spacing

- `--spacing-page`: horizontal page padding (`1.5rem`).
- `--spacing-section`: generous vertical rhythm token (`5rem`); `<Section>` uses
  `py-20 sm:py-28 lg:py-32` for breathing room.
- Content max-width: `max-w-5xl` (within `<Section>`) or `max-w-6xl` (navbar).
- `--radius-soft` (`1rem`), `--radius-card` (`1.5rem`), `--radius-pill` (`9999px`).
  Cards use `rounded-3xl` by convention.

## Components — conventions

- **Buttons:** `min-h-11` (44px tap target), `rounded-md`, gold CTA = `bg-accent-500 text-brand-900`,
  surface-aware `focus-visible:outline-*` (gold on dark, never invisible). Shared shimmer
  via `.btn-primary::after` / `.btn-shimmer::after` (uses `--color-shimmer`).
- **Cards:** `rounded-3xl bg-white shadow-sm dark:bg-brand-800/40` on cream; hover lifts
  via `--shadow-card`.
- **Dividers:** `<hr class="divider-soft">` — gold dotted scallop instead of a hard line.
- **Section dark/light pairings:** every `text-*`, `bg-*`, `border-*` utility outside an
  intentional dark surface (`bg-brand-700`/`-900`) carries a `dark:` companion. Default
  pattern: `text-brand-800 dark:text-brand-100`, `text-brand-700/80 dark:text-brand-100/70`,
  `border-brand-200 dark:border-brand-700`.

## React islands

Hydrate lazily via `client:visible`, except `AuroraHero` (`client:load`, above the fold).
All respect `prefers-reduced-motion`. Current islands: `AuroraHero`, `BrothersExplorer`.

- **No-JS fallback:** `[data-hero]`/`[data-reveal]` are forced visible by a `<noscript>`
  rule in `PageLayout`.
- Shared `cn()` helper (clsx + tailwind-merge) lives in `lib/utils.ts`.
- Icons: Lucide SVGs only — no emoji as icons.

## Animation

- Aurora hero wash + two CTA gradient blobs (keyframes in `global.css` `@theme`).
- Scroll-reveal (`data-animate` / `data-stagger`) via IntersectionObserver in
  `src/scripts/motion.ts`. No-JS safe (`.reveal-ready` class), reduced-motion safe.
- Subtle, purposeful motion only. Always honor `prefers-reduced-motion`.

## Accessibility

- WCAG 2.2 AA contrast for text + UI; light-mode palette was tuned with AA verification
  for body, muted text, and small-text gold.
- Don't convey meaning with color alone.
- Every interactive element keyboard-reachable with visible focus
  (`--color-brand-500` outline at `:focus-visible`).
- Skip link in `PageLayout`; correct heading order.
- Theme toggle has `aria-pressed` + a label that swaps with the action.
