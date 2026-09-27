# Label-Swipe Page Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A signature page transition where, on internal navigation, a maroon curtain sweeps up carrying the destination page's name in Fraunces italic, covers the screen, then lifts off to reveal the freshly-loaded page — with a `prefers-reduced-motion` bypass and zero regression risk to existing pages.

**Architecture:** Approach B (no SPA). A persistent `#pd-curtain` element + label live in `PageLayout`. A small TS module (`page-transition.ts`) intercepts internal link clicks, sweeps the curtain up, then does a normal full-page navigation. An inline pre-paint script in `PageLayout` puts the next page in the "covered" state before it paints (no flash); the module then lifts the curtain on load. Full reloads mean every existing script/island initializes exactly as today.

**Tech Stack:** Astro 6, TypeScript (strict), CSS in `global.css`, Fraunces display font, `--color-maroon` token.

**Verification note:** This is browser-interaction code; "tests" are `npm run check`, `npm run build`, grepping built HTML for the curtain/markup, and a manual behavior pass in `npm run dev`. No unit tests. Each task ends in a commit.

**Constraints:** Curtain is solid `--color-maroon`, name only (no monogram). Must not alter page content. Must not break existing interactivity (guaranteed by full-reload approach). `npm run check` + `npm run build` must pass.

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `src/scripts/page-transition.ts` | Click-intercept, cover, reveal-on-load, bfcache reset, route→label map | Create |
| `src/styles/global.css` | `.pd-curtain` + label styling, reduced-motion guard, instant-reset helper | Modify (append) |
| `src/layouts/PageLayout.astro` | Curtain markup, pre-paint cover inline script, load the module | Modify |

---

## Task 1: Curtain CSS

**Files:**
- Modify: `src/styles/global.css` (APPEND at end of file)

- [ ] **Step 1: Append the curtain styles**

Append to the end of `src/styles/global.css`:

```css
/* =============================================================================
   LABEL-SWIPE PAGE TRANSITION (sub-project 3/3) — see scripts/page-transition.ts
   A maroon curtain sweeps up from the bottom carrying the destination page name,
   then lifts off the top to reveal the new (already-loaded) page.
   ============================================================================= */
.pd-curtain {
  position: fixed;
  inset: 0;
  z-index: 1000; /* above navbar + sticky CTA */
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-maroon);
  transform: translateY(100%); /* parked below the viewport */
  transition: transform 0.42s cubic-bezier(0.7, 0, 0.2, 1);
  pointer-events: none;
  will-change: transform;
}
.pd-curtain.is-covering {
  transform: translateY(0);
}
.pd-curtain.is-revealing {
  transform: translateY(-100%);
  transition-duration: 0.48s;
}
/* Used to snap the curtain back to its parked position without animating. */
.pd-curtain--instant {
  transition: none !important;
}
.pd-curtain__label {
  color: var(--color-accent-400, #ddc074);
  font-style: italic;
  font-size: clamp(2.5rem, 7vw, 5rem);
  letter-spacing: -0.01em;
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 0.4s ease 0.08s,
    transform 0.4s ease 0.08s;
}
.pd-curtain.is-covering .pd-curtain__label {
  opacity: 1;
  transform: translateY(0);
}
/* Reduced motion: no curtain at all — navigation is instant/normal. */
@media (prefers-reduced-motion: reduce) {
  .pd-curtain {
    display: none;
  }
}
```

- [ ] **Step 2: Verify**

Run: `npm run check`
Expected: 0 errors, format check passes. (If prettier flags formatting, run `npm run format` then re-run.)

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(transition): curtain styles for label-swipe page transition"
```

---

## Task 2: Transition module

**Files:**
- Create: `src/scripts/page-transition.ts`

- [ ] **Step 1: Create `src/scripts/page-transition.ts`**

```ts
// Label-swipe page transition (approach B: curtain + full navigation + reveal-on-load).
//
// On an internal link click we sweep a maroon curtain up over the page (showing the
// destination's name), then do a normal full-page navigation. The destination loads
// already "covered" (an inline pre-paint script in PageLayout adds `.is-covering`
// before first paint, so there is no flash), and this module lifts the curtain off on
// load. A full reload means every existing script/island initializes exactly as it does
// today — no SPA, no rehydration concerns. `prefers-reduced-motion` bypasses everything.

const ROUTE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/about': 'About',
  '/brothers': 'Brothers',
  '/recruitment': 'Recruitment',
  '/events': 'Events',
  '/projects': 'Projects',
};

/** Human label for a pathname: explicit map first, else title-cased first segment. */
function labelFor(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean in ROUTE_LABELS) return ROUTE_LABELS[clean];
  const seg = clean.split('/').filter(Boolean)[0];
  return seg ? seg.charAt(0).toUpperCase() + seg.slice(1) : '';
}

export function initPageTransition(): void {
  if (typeof window === 'undefined') return;

  const curtain = document.getElementById('pd-curtain');
  const labelEl = document.getElementById('pd-curtain-label');
  if (!curtain) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Reveal on load: if we arrived via a transition, lift the curtain off. ---
  let pending: string | null = null;
  try {
    pending = sessionStorage.getItem('pd:transition');
    if (pending !== null) sessionStorage.removeItem('pd:transition');
  } catch {
    pending = null;
  }

  if (pending !== null) {
    if (prefersReduced) {
      // Reduced motion: never animate — make sure nothing is covering.
      curtain.classList.remove('is-covering', 'is-revealing');
    } else {
      // The pre-paint inline script already added `.is-covering`. Lift it off.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          curtain.classList.remove('is-covering');
          curtain.classList.add('is-revealing');
          const done = (): void => {
            curtain.removeEventListener('transitionend', done);
            // Snap back to the parked position without a visible slide.
            curtain.classList.add('pd-curtain--instant');
            curtain.classList.remove('is-revealing');
            void curtain.offsetWidth; // force reflow so the next line re-enables transitions
            curtain.classList.remove('pd-curtain--instant');
          };
          curtain.addEventListener('transitionend', done);
        });
      });
    }
  }

  // bfcache restore (back/forward): never show a stuck curtain.
  window.addEventListener('pageshow', (e) => {
    if ((e as PageTransitionEvent).persisted) {
      curtain.classList.remove('is-covering', 'is-revealing');
    }
  });

  if (prefersReduced) return; // no cover animation on clicks

  // --- Cover on internal link click ---
  document.addEventListener('click', (e: MouseEvent) => {
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const target = e.target as Element | null;
    const anchor = target?.closest?.('a') as HTMLAnchorElement | null;
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;
    if (anchor.target && anchor.target !== '_self') return;
    if (anchor.hasAttribute('download')) return;
    if (href.startsWith('#')) return;

    let url: URL;
    try {
      url = new URL(anchor.href, window.location.href);
    } catch {
      return;
    }
    if (url.origin !== window.location.origin) return;
    // Same page (with or without a hash) — let the browser handle it normally.
    if (url.pathname === window.location.pathname && url.search === window.location.search) {
      return;
    }

    e.preventDefault();
    const label = labelFor(url.pathname);
    if (labelEl) labelEl.textContent = label;

    let navigated = false;
    const go = (): void => {
      if (navigated) return;
      navigated = true;
      try {
        sessionStorage.setItem('pd:transition', label);
      } catch {
        /* sessionStorage unavailable — navigation still proceeds */
      }
      window.location.href = url.href;
    };

    curtain.classList.add('is-covering');
    curtain.addEventListener('transitionend', go, { once: true });
    window.setTimeout(go, 600); // safety net if transitionend doesn't fire
  });
}
```

- [ ] **Step 2: Verify**

Run: `npm run check`
Expected: 0 errors (TypeScript strict OK), lint clean, format OK. (The module is not yet imported anywhere — that's fine; Task 3 wires it.)

- [ ] **Step 3: Commit**

```bash
git add src/scripts/page-transition.ts
git commit -m "feat(transition): page-transition module (cover, reveal, bfcache)"
```

---

## Task 3: Wire into PageLayout

**Files:**
- Modify: `src/layouts/PageLayout.astro`

- [ ] **Step 1: Add the curtain markup + pre-paint cover script at the top of `<body>`**

In `src/layouts/PageLayout.astro`, the `<body>` currently opens like this:

```astro
  <body class="min-h-dvh antialiased">
    {/* Accessibility: keyboard skip link to main content. */}
    <a
      href="#main"
```

Insert the curtain block immediately after the `<body ...>` line, BEFORE the skip-link comment, so it becomes:

```astro
  <body class="min-h-dvh antialiased">
    {/* Page-transition curtain (see scripts/page-transition.ts). The inline script
       runs at parse time: if we arrived via a transition, it puts the curtain in the
       covered state before first paint so the new page never flashes. */}
    <div id="pd-curtain" class="pd-curtain" aria-hidden="true">
      <span id="pd-curtain-label" class="pd-curtain__label font-display"></span>
    </div>
    <script is:inline>
      (function () {
        try {
          var label = sessionStorage.getItem('pd:transition');
          if (label !== null) {
            var c = document.getElementById('pd-curtain');
            var l = document.getElementById('pd-curtain-label');
            if (c) c.classList.add('is-covering');
            if (l) l.textContent = label;
          }
        } catch (e) {
          /* sessionStorage unavailable — no pre-cover */
        }
      })();
    </script>

    {/* Accessibility: keyboard skip link to main content. */}
    <a
      href="#main"
```

- [ ] **Step 2: Load the transition module at the end of `<body>`**

The body currently ends with the scroll-reveal script:

```astro
    {/* Scroll-reveal: reveal sections as they enter the viewport (see scripts/motion.ts). */}
    <script>
      import { initScrollAnimations } from '@/scripts/motion';
      initScrollAnimations();
    </script>
  </body>
```

Add the transition module import right after the scroll-reveal script (before `</body>`):

```astro
    {/* Scroll-reveal: reveal sections as they enter the viewport (see scripts/motion.ts). */}
    <script>
      import { initScrollAnimations } from '@/scripts/motion';
      initScrollAnimations();
    </script>

    {/* Label-swipe page transition (see scripts/page-transition.ts). */}
    <script>
      import { initPageTransition } from '@/scripts/page-transition';
      initPageTransition();
    </script>
  </body>
```

- [ ] **Step 3: Verify build + check**

Run: `npm run check && npm run build`
Expected: check passes (0 errors, format OK); build `Complete!` with `8 page(s)`.

- [ ] **Step 4: Verify the markup is in the output**

Run: `npm run build` then
`grep -c 'id="pd-curtain"' dist/index.html dist/about/index.html`
Expected: `1` on each (curtain present on every page via the shared layout).

- [ ] **Step 5: Manual behavior check (dev server)**

With `npm run dev` running, open `http://localhost:4321/`:
- Click a navbar link (e.g. Brothers). Expect: maroon curtain sweeps up showing "Brothers", page loads, curtain lifts off the top. Destination label matches the page.
- Click the browser Back button. Expect: no stuck curtain.
- Cmd/Ctrl-click a link. Expect: opens in a new tab, no curtain on the current page.
- An external link / a `#`-only link. Expect: normal behavior, no curtain.
- Toggle OS "Reduce motion" on and reload. Expect: links navigate instantly with no curtain.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/PageLayout.astro
git commit -m "feat(transition): wire label-swipe curtain into PageLayout"
```

---

## Self-Review

**Spec coverage:**
- Curtain sweeps up with destination name in Fraunces italic → Task 1 CSS (`.pd-curtain`, `.pd-curtain__label`, `font-display` class in markup Task 3) + Task 2 `labelFor`/label set. ✓
- Lifts off to reveal → Task 1 `.is-revealing` + Task 2 reveal-on-load. ✓
- Approach B (no SPA): full navigation via `window.location.href`; pre-paint cover script avoids flash → Task 2 + Task 3 inline script. ✓
- Route→label map with fallback → Task 2 `ROUTE_LABELS` + `labelFor`. ✓
- prefers-reduced-motion bypass → Task 1 `@media` (display:none) + Task 2 early bail. ✓
- Ignore external/new-tab/download/hash/modified-click/same-page → Task 2 click guards. ✓
- bfcache (back/forward) no stuck curtain → Task 2 `pageshow` handler. ✓
- No regression to existing interactivity → full reload (no SPA); only additive markup/script. ✓
- Curtain solid maroon, name only → Task 1 `background: var(--color-maroon)`, label markup has no monogram. ✓
- Gates pass, 8 pages → Task 3 verification. ✓

**Placeholder scan:** No TBD/TODO; all code complete. ✓

**Type/name consistency:** Element IDs `pd-curtain` / `pd-curtain-label` and classes `.pd-curtain`, `.is-covering`, `.is-revealing`, `.pd-curtain--instant`, `.pd-curtain__label` are identical across Tasks 1–3. The sessionStorage key `pd:transition` is identical in the pre-paint inline script (Task 3) and the module (Task 2). The exported function `initPageTransition` matches its import in Task 3. ✓
