// Label-swipe page transition (approach B: curtain + full navigation + reveal-on-load).
//
// On an internal link click we sweep a maroon curtain up over the page (showing the
// destination's name), then do a normal full-page navigation. The destination loads
// already "covered" (an inline pre-paint script in PageLayout adds `.is-covering`
// before first paint, so there is no flash), and this module lifts the curtain off on
// load. A full reload means every existing script/island initializes exactly as it does
// today, no SPA, no rehydration concerns. `prefers-reduced-motion` bypasses everything.

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
  if (clean in ROUTE_LABELS) return ROUTE_LABELS[clean]!;
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
      // Reduced motion: never animate, make sure nothing is covering or blurred.
      curtain.classList.remove('is-covering', 'is-revealing');
      document.documentElement.classList.remove('pd-blur');
    } else {
      // The pre-paint inline script already added `.is-covering`. Lift it off.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          curtain.classList.remove('is-covering');
          curtain.classList.add('is-revealing');
          const done = (ev: TransitionEvent): void => {
            // Only react to the curtain's own slide, not child (label/eyebrow) fades.
            if (ev.target !== curtain || ev.propertyName !== 'transform') return;
            curtain.removeEventListener('transitionend', done);
            // Snap back to the parked position without a visible slide.
            curtain.classList.add('pd-curtain--instant');
            curtain.classList.remove('is-revealing');
            void curtain.offsetWidth; // force reflow so the next line re-enables transitions
            curtain.classList.remove('pd-curtain--instant');
            // Curtain is off, bring the blurred page into focus.
            document.documentElement.classList.remove('pd-blur');
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
      document.documentElement.classList.remove('pd-blur');
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
    // Same page (with or without a hash), let the browser handle it normally.
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
        /* sessionStorage unavailable, navigation still proceeds */
      }
      window.location.href = url.href;
    };

    // Navigate when the curtain's own slide finishes, ignore child (label) fades.
    const onCover = (ev: TransitionEvent): void => {
      if (ev.target !== curtain || ev.propertyName !== 'transform') return;
      curtain.removeEventListener('transitionend', onCover);
      go();
    };
    curtain.classList.add('is-covering');
    curtain.addEventListener('transitionend', onCover);
    window.setTimeout(go, 480); // safety net if transitionend doesn't fire
  });
}
