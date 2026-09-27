# Label-Swipe Page Transition (Spec)

**Date:** 2026-06-06
**Status:** Draft for review
**Sub-project:** ③ of 3 in the "Full Editorial Archival pass" (depends on ① Foundations, now merged).

## Context

Brainstorming locked the site's signature motion: on internal navigation, a maroon
curtain **sweeps up carrying the destination page's name in Fraunces italic**, covers
the screen, then **lifts off the top to reveal the new page** — like a magazine turning
to a named section. This is the one "signature → expressive" moment; everything else
stays calm.

## Key engineering decision (please confirm)

There are two ways to build this:

- **A. SPA via Astro `<ClientRouter />` (View Transitions).** Faster (no reload) but the
  site has many interactive pieces — React islands (BrothersExplorer, hero, lightbox,
  testimonials), the theme toggle, scroll-reveal (`motion.ts`), the sticky rush CTA.
  Going SPA means every one of those must be re-initialized on each in-page swap and
  re-tested. **High regression risk** on an about-to-launch site.

- **B. Curtain + full navigation + reveal-on-load (RECOMMENDED).** Intercept link
  clicks, play the cover animation, then do a normal full-page navigation; the new page
  loads with the curtain already down and lifts it off. The full reload means **every
  existing script/island initializes exactly as it does today — zero regression risk** —
  and the curtain masks the reload so it still feels seamless.

This spec assumes **B**. It's the lower-risk choice for a launching site and still
delivers the exact visual. Say the word if you'd rather take the SPA route.

## Goal

A signature label-swipe transition on internal navigation, with a `prefers-reduced-motion`
bypass, that adds no regression risk to existing pages.

## Non-goals

- No SPA / `<ClientRouter />` (per decision B).
- No shared-element morph (a different, un-chosen option).
- No page content changes; no new dependencies.

## Design (approach B)

### Markup (in `PageLayout.astro`, once, near top of `<body>`)
A persistent curtain + label:
```html
<div id="pd-curtain" class="pd-curtain" aria-hidden="true">
  <span class="pd-curtain__label font-display"></span>
</div>
```
Default state: `transform: translateY(100%)` (parked below the viewport), fixed,
full-screen, top `z-index`, `pointer-events: none`.

### Pre-paint cover script (inline `is:inline` in `<head>`, before content)
Reads `sessionStorage['pd:transition']`. If present (we just navigated via a click):
add `.is-covering` immediately so the new page paints **already covered** (no flash) and
set the label text. This runs before paint to avoid any flash of the new page.

### Transition module (`src/scripts/page-transition.ts`, loaded by PageLayout)
1. If `matchMedia('(prefers-reduced-motion: reduce)')` matches → do nothing (links behave
   normally). Otherwise:
2. **Cover (on click):** delegate-listen for clicks on `a[href]`. Ignore when: different
   origin, `target=_blank`, `download`, hash-only (`#…`) / same-page, or modified click
   (ctrl/cmd/shift/alt/middle). Otherwise `preventDefault`, set the label from the
   route→name map, add `.is-covering` (curtain slides up to `translateY(0)` over ~420ms).
   On `transitionend` (or a ~500ms safety timeout), set `sessionStorage['pd:transition'] =
   label` and `window.location.href = href`.
3. **Reveal (on load):** if the pre-paint script put us in `.is-covering`, then after
   `load` (next animation frame) swap to `.is-revealing` (curtain lifts to
   `translateY(-100%)` over ~480ms), clear `sessionStorage['pd:transition']`, and on its
   `transitionend` reset to the parked hidden state.
4. **bfcache:** on `pageshow` with `event.persisted`, force the curtain to parked/hidden
   (so back/forward never shows a stuck curtain).

### Route → label map
`{ '/': 'Home', '/about': 'About', '/brothers': 'Brothers', '/recruitment':
'Recruitment', '/events': 'Events', '/projects': 'Projects' }`. Fallback: title-case the
first path segment, else empty (curtain still sweeps, just unlabeled).

### CSS (`global.css`)
`.pd-curtain` (fixed inset:0, `z-index` above everything incl. navbar, maroon
`--color-maroon` background, flex-centered, `transform: translateY(100%)`,
`transition: transform .42s cubic-bezier(.7,0,.2,1)`, `pointer-events:none`).
`.pd-curtain.is-covering { transform: translateY(0) }`.
`.pd-curtain.is-revealing { transform: translateY(-100%); transition-duration: .48s }`.
`.pd-curtain__label` — Fraunces italic, large, `--color-gold`/cream, subtle rise-in.
`@media (prefers-reduced-motion: reduce) { .pd-curtain { display:none } }`.

## Architecture / files

| Concern | File | Action |
|---|---|---|
| Curtain markup + pre-paint cover script + module load | `src/layouts/PageLayout.astro` | Modify |
| Click-intercept / cover / reveal / bfcache logic | `src/scripts/page-transition.ts` | Create |
| Curtain + label styling, reduced-motion guard | `src/styles/global.css` | Modify (append) |

## Accessibility, performance, constraints

- **Reduced motion:** fully bypassed — no curtain, normal navigation.
- **A11y:** curtain `aria-hidden`, `pointer-events:none`, never traps focus; keyboard
  Enter on a link fires a click so it's covered by the same handler.
- **No-JS:** without JS, no listeners run and links navigate normally (curtain stays
  parked/hidden). Progressive enhancement.
- **Performance:** transform-only (GPU), one element, ~1KB script. Full reload of static
  HTML is fast and hidden by the curtain.
- **Repo rules (CLAUDE.md):** TS strict; small focused module; `npm run check` +
  `npm run build`; one concern per commit.

## Success criteria

1. `npm run check` and `npm run build` pass.
2. Clicking any nav/internal link plays cover → navigates → reveals, with the correct
   destination name shown.
3. External links, new-tab, modified-clicks, and hash links are unaffected.
4. `prefers-reduced-motion` → no curtain, instant navigation.
5. All existing interactivity (theme toggle, brothers explorer, lightbox, sticky CTA,
   scroll-reveal) works exactly as before (guaranteed by full-reload approach).
6. No stuck curtain on back/forward (bfcache handled).

## Open questions

- Curtain color: solid maroon `--color-maroon` (default) vs near-black. (Default: maroon.)
- Show the ΘΤ monogram alongside the page name, or name only? (Default: name only.)
