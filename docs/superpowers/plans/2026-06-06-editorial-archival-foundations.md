# Editorial Archival — Design Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an additive, opt-in design-token + archival-primitive layer (editorial type scale, generous spacing rhythm, paper grain, stamp/seal, torn edge) plus a `noindex` style-guide page — without changing any of the 7 existing pages.

**Architecture:** Tokens live in `src/styles/global.css` (`:root` / `html.dark` for theme-aware values; opt-in `.ed-*` utility classes appended in a new FOUNDATIONS section). Grain is a single `body::after` fixed layer (the existing `body::before` is the warmth layer). Two small components: a new `Stamp.astro` and a new `torn` variant on the existing `SectionDivider.astro`. A `/styleguide` page renders everything for review.

**Tech Stack:** Astro 6, Tailwind CSS v4 (`@theme` in CSS), TypeScript, Fraunces + Plus Jakarta Sans.

**Verification note:** This is design/CSS code; "tests" here are `npm run check` (typecheck + lint + format), `npm run build`, an HTTP render check of `/styleguide`, and a visual pass in light + dark. There are no unit tests. Each task ends in a commit.

**Critical constraint (from spec):** Foundations are **additive and opt-in**. Do NOT redefine Tailwind defaults (e.g. `--text-3xl`, `--spacing-section`) or restyle existing pages. New names only (`--ed-*`, `.ed-*`, `--color-stamp`, `--grain-opacity`).

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `src/styles/global.css` | Theme-aware archival tokens (`:root`/`html.dark`) + appended `.ed-*` utilities, grain, stamp & torn CSS | Modify |
| `src/layouts/PageLayout.astro` | Add italic axis to the Fraunces `<link>` so accent italics render in the real face | Modify (line ~44) |
| `src/components/ui/Stamp.astro` | Reusable rubber-stamp / wax-seal primitive | Create |
| `src/components/ui/SectionDivider.astro` | Add `variant="torn"` | Modify |
| `src/pages/styleguide.astro` | `noindex` preview of all foundations | Create |

---

## Task 1: Theme-aware archival tokens

**Files:**
- Modify: `src/styles/global.css` (inside the `:root { … }` block ~lines 99–132, and the `html.dark { … }` block ~lines 134–151)

- [ ] **Step 1: Add light-theme tokens inside `:root`**

Inside the `:root { … }` block (after the existing `--color-shimmer` line), add:

```css
  /* --- Editorial Archival foundations (additive; opt-in via .ed-* classes) --- */
  --ed-display: clamp(3rem, 7vw, 5.5rem);
  --ed-display-sm: clamp(2.25rem, 4.5vw, 3.25rem);
  --ed-eyebrow-size: 0.78rem;
  --ed-measure: 64ch;
  --ed-space-section: clamp(4.5rem, 9vw, 9rem);
  --ed-space-block: clamp(2rem, 4vw, 3.5rem);
  /* Archival primitive tokens */
  --color-stamp: rgba(124, 3, 3, 0.5); /* faded rubber-stamp maroon */
  --grain-opacity: 0.06;
```

- [ ] **Step 2: Add dark-theme overrides inside `html.dark`**

Inside the `html.dark { … }` block (after its existing `--color-shimmer` line, before the closing `}`), add:

```css
  /* Editorial Archival — dark overrides */
  --color-stamp: rgba(221, 192, 122, 0.5); /* faded gold on dark */
  --grain-opacity: 0.1;
```

- [ ] **Step 3: Verify it still builds**

Run: `npm run check`
Expected: `0 errors`, format check passes.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(foundations): add editorial + archival design tokens"
```

---

## Task 2: Editorial utility classes

**Files:**
- Modify: `src/styles/global.css` (append a new section at the END of the file)

- [ ] **Step 1: Append the editorial utility classes**

Append to the very end of `src/styles/global.css`:

```css
/* =============================================================================
   EDITORIAL ARCHIVAL FOUNDATIONS — opt-in utilities (sub-project 1/3)
   Pages opt in; nothing here changes existing markup automatically.
   ============================================================================= */

/* Type */
.ed-eyebrow {
  font-family: var(--font-sans);
  font-size: var(--ed-eyebrow-size);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-text-muted);
}
.ed-display {
  font-family: var(--font-display);
  font-size: var(--ed-display);
  line-height: 1.04;
  letter-spacing: -0.015em;
  color: var(--color-text);
}
.ed-display-sm {
  font-family: var(--font-display);
  font-size: var(--ed-display-sm);
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: var(--color-text);
}
/* Italic gold accent word inside a display heading */
.ed-accent {
  color: var(--color-gold);
  font-style: italic;
}

/* Layout rhythm */
.ed-measure {
  max-width: var(--ed-measure);
}
.ed-section {
  padding-block: var(--ed-space-section);
}
.ed-block + .ed-block {
  margin-top: var(--ed-space-block);
}
```

- [ ] **Step 2: Verify build**

Run: `npm run check`
Expected: passes (0 errors, format OK).

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(foundations): add opt-in editorial type + rhythm utilities"
```

---

## Task 3: Paper-grain overlay

**Files:**
- Modify: `src/styles/global.css` (append after the Task 2 block)

- [ ] **Step 1: Append the grain layer**

Append to the end of `src/styles/global.css`:

```css
/* Paper grain — a single fixed layer BEHIND content (z-index -1, like the
   warmth layer on body::before). It tints only the background, never overlaps
   text, so it cannot reduce text contrast. */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: var(--grain-opacity);
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 160px 160px;
  contain: paint;
}
/* On dark backgrounds, multiply hides noise — switch to soft-light so the
   grain reads as a faint lighter speckle instead. */
html.dark body::after {
  mix-blend-mode: soft-light;
}
```

- [ ] **Step 2: Verify build + render**

Run: `npm run build`
Expected: `7 page(s) built`, `Complete!`, no errors.

- [ ] **Step 3: Visual check**

Start `npm run dev` (if not running), open `http://localhost:4321/`. Confirm: the background has a faint texture; body text is still crisp; toggle dark mode and confirm grain is visible but subtle. No layout shift.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(foundations): subtle paper-grain background layer (light + dark)"
```

---

## Task 4: Stamp / wax-seal component

**Files:**
- Create: `src/components/ui/Stamp.astro`
- Modify: `src/styles/global.css` (append after the grain block)

- [ ] **Step 1: Create `src/components/ui/Stamp.astro`**

```astro
---
// Stamp — archival primitive. Two looks:
//   variant="stamp" — rubber-stamp text in a thin box (e.g. "EST. 2013").
//   variant="seal"  — circular dashed medallion (defaults to the ΘΤ monogram).
// Decorative by default (aria-hidden). Pass a meaningful `text` only when it
// adds information beyond what surrounding copy already states.
interface Props {
  variant?: 'stamp' | 'seal';
  /** Text inside the stamp/seal. Seal defaults to the ΘΤ monogram. */
  text?: string;
  /** Degrees of rotation for a hand-applied feel. Default -6. */
  rotate?: number;
}
const { variant = 'stamp', text, rotate = -6 } = Astro.props;
const content = text ?? (variant === 'seal' ? 'ΘΤ' : '');
const style = `--stamp-rotate:${rotate}deg`;
---

{
  variant === 'seal' ? (
    <span class="stamp stamp--seal font-display" style={style} aria-hidden="true">
      {content}
    </span>
  ) : (
    <span class="stamp stamp--mark font-display" style={style} aria-hidden="true">
      {content}
    </span>
  )
}
```

- [ ] **Step 2: Append the stamp CSS to `src/styles/global.css`**

```css
/* Stamp / wax-seal primitive (see components/ui/Stamp.astro) */
.stamp {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-stamp);
  transform: rotate(var(--stamp-rotate, -6deg));
  user-select: none;
}
.stamp--mark {
  padding: 0.3rem 0.7rem;
  border: 2px solid var(--color-stamp);
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.8rem;
  font-weight: 600;
}
.stamp--seal {
  width: 5.25rem;
  height: 5.25rem;
  border-radius: 50%;
  border: 2px dashed var(--color-stamp);
  font-size: 1.7rem;
  font-weight: 600;
}
```

- [ ] **Step 3: Verify build**

Run: `npm run check`
Expected: passes (0 errors). The component is unused so far — that's fine; Task 6 renders it.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Stamp.astro src/styles/global.css
git commit -m "feat(foundations): Stamp/Seal archival component"
```

---

## Task 5: Torn-edge SectionDivider variant

**Files:**
- Modify: `src/components/ui/SectionDivider.astro`
- Modify: `src/styles/global.css` (append after the stamp block)

- [ ] **Step 1: Add `'torn'` to the Props union**

In `src/components/ui/SectionDivider.astro`, change:

```ts
  variant?: 'crest' | 'monogram' | 'ornament' | 'thick';
```

to:

```ts
  variant?: 'crest' | 'monogram' | 'ornament' | 'thick' | 'torn';
```

- [ ] **Step 2: Add the torn render branch**

In the same file, after the `variant === 'thick'` block (after its closing `}` near the end), add:

```astro
{
  variant === 'torn' && (
    <div class="section-divider section-divider--torn" aria-hidden="true" />
  )
}
```

- [ ] **Step 3: Append the torn CSS to `src/styles/global.css`**

```css
/* Torn / deckle paper edge — a divider strip whose bottom is ripped. Uses the
   surface color so it reads as a sheet of paper. clip-path with a clean-edge
   fallback for browsers that don't support it. */
.section-divider--torn {
  height: 2rem;
  margin: var(--ed-space-block) 0;
  background: var(--color-surface);
  box-shadow: 0 8px 18px rgba(74, 4, 4, 0.08);
}
@supports (clip-path: polygon(0 0, 1px 1px, 0 1px)) {
  .section-divider--torn {
    clip-path: polygon(
      0 0, 100% 0, 100% 70%, 96% 80%, 92% 70%, 88% 82%, 84% 70%, 80% 82%,
      76% 70%, 72% 82%, 68% 70%, 64% 82%, 60% 70%, 56% 82%, 52% 70%, 48% 82%,
      44% 70%, 40% 82%, 36% 70%, 32% 82%, 28% 70%, 24% 82%, 20% 70%, 16% 82%,
      12% 70%, 8% 82%, 4% 71%, 0 80%
    );
  }
}
```

- [ ] **Step 4: Verify build**

Run: `npm run check`
Expected: passes (0 errors).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/SectionDivider.astro src/styles/global.css
git commit -m "feat(foundations): torn-edge SectionDivider variant"
```

---

## Task 6: Fraunces italic axis

**Files:**
- Modify: `src/layouts/PageLayout.astro` (the Fraunces `<link>`, ~line 44)

- [ ] **Step 1: Replace the font stylesheet link**

In `src/layouts/PageLayout.astro`, replace this line:

```html
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
```

with (adds the italic axis so `.ed-accent` / `<em>` render in true Fraunces italic, not a synthesized slant):

```html
      href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,500;1,9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: `7 page(s) built`, `Complete!`.

- [ ] **Step 3: Visual check**

On `http://localhost:4321/about`, the italic accent in the hero ("since 2013.") should now render in real Fraunces italic (rounder, true italic forms) rather than a slanted upright.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/PageLayout.astro
git commit -m "feat(foundations): load Fraunces italic axis for accent type"
```

---

## Task 7: Style-guide preview page + final verification

**Files:**
- Create: `src/pages/styleguide.astro`

- [ ] **Step 1: Create `src/pages/styleguide.astro`**

```astro
---
// Internal style guide (noindex, unlinked). Renders the Editorial Archival
// foundations in isolation for review before they're applied to real pages.
import PageLayout from '@layouts/PageLayout.astro';
import Stamp from '@components/ui/Stamp.astro';
import SectionDivider from '@components/ui/SectionDivider.astro';

const swatches = [
  ['--color-bg', 'bg'],
  ['--color-surface', 'surface'],
  ['--color-text', 'text'],
  ['--color-gold', 'gold'],
  ['--color-stamp', 'stamp'],
] as const;
---

<PageLayout title="Style Guide" description="Internal Editorial Archival foundations preview." noindex>
  <main class="ed-section" style="max-width:72rem;margin:0 auto;padding-inline:var(--spacing-page)">
    <p class="ed-eyebrow">Internal · not linked</p>
    <h1 class="ed-display">Editorial <span class="ed-accent">Archival.</span></h1>
    <p class="ed-measure" style="margin-top:1rem">
      Foundations preview — typography, rhythm, and the three archival primitives.
      Toggle dark mode (navbar) to check both themes.
    </p>

    <SectionDivider variant="torn" />

    <h2 class="ed-display-sm">Type scale</h2>
    <div class="ed-block">
      <p class="ed-eyebrow">Eyebrow / label</p>
      <p class="ed-display">Display</p>
      <p class="ed-display-sm">Display small</p>
      <h3 class="font-display" style="font-size:1.5rem">Heading (Fraunces 1.5rem)</h3>
      <p class="ed-measure">Body copy in Plus Jakarta Sans set to a 64ch reading measure so lines stay comfortable. The quick brown fox jumps over the lazy dog.</p>
    </div>

    <SectionDivider variant="torn" />

    <h2 class="ed-display-sm">Color</h2>
    <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1rem">
      {
        swatches.map(([token, label]) => (
          <div style="text-align:center">
            <div style={`width:88px;height:64px;border-radius:8px;border:1px solid var(--color-border);background:var(${token})`} />
            <small class="ed-eyebrow">{label}</small>
          </div>
        ))
      }
    </div>

    <SectionDivider variant="torn" />

    <h2 class="ed-display-sm">Archival primitives</h2>
    <div style="display:flex;gap:2.5rem;align-items:center;flex-wrap:wrap;margin-top:1.5rem">
      <Stamp variant="stamp" text="EST. 2013" />
      <Stamp variant="seal" />
      <Stamp variant="stamp" text="Pi Delta · UCI" rotate={3} />
    </div>
    <p class="ed-measure" style="margin-top:1.5rem">
      Paper grain is applied globally to the page background (visible behind this content).
    </p>
  </main>
</PageLayout>
```

- [ ] **Step 2: Verify build includes the new page**

Run: `npm run build`
Expected: page count increases to `8 page(s) built`; `Complete!`; no errors.

- [ ] **Step 3: Render check**

With `npm run dev` running:
Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/styleguide`
Expected: `200`

- [ ] **Step 4: Visual review (light + dark)**

Open `http://localhost:4321/styleguide`. Confirm: display type is large/dramatic; eyebrow is uppercase tracked; the gold accent is real italic; color swatches render including `stamp`; the stamp box, ΘΤ seal, and torn dividers all display; grain is faintly visible. Toggle dark mode — everything adapts (stamp turns gold, grain still visible, contrast holds).

- [ ] **Step 5: Confirm existing pages are unchanged**

Spot-check `http://localhost:4321/` and `/brothers` render normally (no layout/size shifts) — foundations are additive, so these should look exactly as before aside from the new faint grain.

- [ ] **Step 6: Final full verification**

Run: `npm run check && npm run build`
Expected: check passes (0 errors, format OK); build `Complete!` with `8 page(s)`.

- [ ] **Step 7: Commit**

```bash
git add src/pages/styleguide.astro
git commit -m "feat(foundations): noindex /styleguide preview page"
```

---

## Self-Review

**Spec coverage:**
- Generous/dramatic type scale → Task 1 tokens + Task 2 `.ed-display`/`.ed-display-sm`/`.ed-eyebrow`/`.ed-measure`. ✓ (Implemented as additive `.ed-*` classes, NOT by overriding Tailwind defaults, to honor the "existing pages unchanged" constraint — intentional deviation from a literal `--text-*` override.)
- Generous spacing rhythm → Task 1 `--ed-space-*` + Task 2 `.ed-section`/`.ed-block`. ✓
- Keep Fraunces + Plus Jakarta Sans; real italics → Task 6. ✓
- Archival: paper grain → Task 3; stamp/seal → Task 4; torn edge → Task 5. ✓
- Theme-aware (light + dark) for all archival tokens → Task 1 (`html.dark`), Task 3 (dark blend), Task 4/5 use theme tokens. ✓
- `noindex` style-guide page → Task 7. ✓
- Constraints: AA contrast (grain is behind content, never overlaps text — Task 3 note); fast static build (inline SVG, no new assets); no page redesigns; one concern per commit. ✓
- Open questions from spec: `/styleguide` kept permanently as `noindex` (Task 7); torn edge via `clip-path` with `@supports` fallback (Task 5). ✓

**Placeholder scan:** No TBD/TODO/"handle edge cases"; every code step shows complete code. ✓

**Type/name consistency:** Token names (`--ed-display`, `--ed-display-sm`, `--ed-eyebrow-size`, `--ed-measure`, `--ed-space-section`, `--ed-space-block`, `--color-stamp`, `--grain-opacity`) and class names (`.ed-eyebrow`, `.ed-display`, `.ed-display-sm`, `.ed-accent`, `.ed-measure`, `.ed-section`, `.ed-block`, `.stamp`, `.stamp--mark`, `.stamp--seal`, `.section-divider--torn`) are used consistently across Tasks 1–7. `Stamp.astro` props (`variant`, `text`, `rotate`) match the `/styleguide` usage in Task 7. ✓
