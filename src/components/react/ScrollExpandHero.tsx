// ScrollExpandHero, fullscreen intro that captures the first scroll and
// expands a centered video tile from poster size to fullscreen. The earlier
// version updated React state on every wheel tick (laggy) and never resolved
// half-states (wonky). This version:
//
//  * Stores progress in refs, not React state, no per-frame re-renders.
//  * A single requestAnimationFrame loop reads the target progress and writes
//    the result to CSS custom properties on the section element, so the
//    browser handles the animation smoothly.
//  * When the user stops scrolling, a 140 ms idle timer snaps the target to
//    the nearer end (0 or 1), that's the "lock when finished" behavior.
//  * Only flips React state when the expanded boundary is crossed (so the
//    page can release the body scroll lock).
import { useEffect, useRef, useState } from 'react';

interface Props {
  videoSrc?: string;
  posterSrc?: string;
  /** Optional background video that plays behind the centered tile, dimmed and
   *  fullscreen. Falls back to `videoSrc` when omitted. */
  backgroundVideoSrc?: string;
  title?: string;
  eyebrow?: string;
  scrollHint?: string;
}

export default function ScrollExpandHero({
  videoSrc = '',
  posterSrc,
  backgroundVideoSrc,
  title = 'Theta Tau · Pi Delta',
  eyebrow = 'The professional engineering fraternity at UC Irvine',
  scrollHint = 'Scroll to enter',
}: Props) {
  const bgSrc = backgroundVideoSrc ?? videoSrc;
  const sectionRef = useRef<HTMLElement>(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const touchYRef = useRef(0);
  // Timestamp (ms) when the hero first reached the fully-expanded state. Used
  // to enforce a "dwell" period during which page scroll stays locked so the
  // user actually sees the fullscreen video before the page moves on.
  const expandedAtRef = useRef<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Smoothing factor, higher = snappier, lower = silkier. 0.18 lands between
  // "obvious lerp" and "instant" without ever overshooting.
  const SMOOTHING = 0.18;
  const IDLE_SNAP_MS = 250;
  // How long the page stays locked after the video reaches fullscreen, so a
  // fast scroll gesture can't blow past the intro.
  const DWELL_AFTER_EXPAND_MS = 800;
  // Cap the progress change a single wheel/touch event can produce. Without
  // this, one fast trackpad fling can jump straight from 0 to 1.
  const MAX_DELTA_PER_EVENT = 0.15;

  // Skip the scroll-hijack entirely when it would do more harm than good:
  //  * prefers-reduced-motion is set, OR
  //  * the device is touch-primary (coarse pointer), on phones/tablets the
  //    touchmove preventDefault + scrollTo(0,0) lock fights the native scroll
  //    and traps the user on the intro. In every skip case we jump straight to
  //    the expanded state (static fullscreen hero) and attach no listeners.
  const staticHeroRef = useRef(false);
  // The tile video, we force-play it on mount (see effect below) because the
  // `autoplay` attribute alone is unreliable on mobile.
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    sectionRef.current?.style.setProperty('--progress', '0');
    document.documentElement.style.setProperty('--hero-progress', '0');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    // Static mode = no scroll-hijack. Both reduced-motion and touch devices use
    // it. On touch the CSS presents a full-bleed autoplay video hero (no
    // per-frame scaling of the video, which janks phones); scaling-on-scroll is
    // reserved for desktop pointers where it's smooth.
    staticHeroRef.current = prefersReduced || coarsePointer;
    // Static mode holds the hero at its INTRO composition (progress 0): the
    // title/eyebrow stay visible, page chrome (navbar) stays visible, and the
    // page scrolls normally past a full-height hero section. We deliberately do
    // NOT jump to the expanded state here, expanded flips `html.hero-expanded`,
    // which sets `display:none` on the navbar. On desktop the scroll loop later
    // clears that class; in static mode nothing would, leaving touch/reduced-
    // motion users with no navigation and a scroll-locked page. Holding at 0
    // (the default target/current) plus the no-op listener effect below gives a
    // clean, static, fully-scrollable hero with the nav intact.
    return () => {
      document.documentElement.style.removeProperty('--hero-progress');
      document.documentElement.classList.remove('hero-expanded');
    };
  }, []);

  // Force the tile video to play. The `autoplay` attribute is unreliable on
  // mobile (the browser can evaluate it before React reflects `muted`, then
  // never retries), so set the muted property explicitly and call play(),
  // retrying once metadata is ready. Muted + playsInline keeps it within every
  // browser's autoplay policy.
  useEffect(() => {
    // On touch with motion enabled the hero does a scroll-expand: the video is
    // kept PAUSED (showing its poster) while it scales, scaling a paused video
    // is as cheap as scaling an image, whereas scaling a playing one janks. The
    // mobile-expand effect below calls play() once it's basically fullscreen. So
    // skip the eager force-play there; everywhere else (desktop, and reduced-
    // motion touch which shows a static full-bleed video) play immediately.
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarse && !reduced) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = () => {
      v.play().catch(() => {
        /* Autoplay blocked (e.g. iOS Low Power Mode), leave the poster. */
      });
    };
    tryPlay();
    v.addEventListener('loadeddata', tryPlay);
    return () => v.removeEventListener('loadeddata', tryPlay);
  }, []);

  // Touch scroll-expand (motion enabled). Unlike the desktop version this does
  // NOT hijack scroll, that trapped touch users. Instead the section is made
  // tall and its inner viewport is `position: sticky`, so the hero pins for one
  // screen of NATIVE scrolling. We map how far the sticky has been scrolled to
  // --progress (0->1), and CSS scales the media tile from a small poster to
  // fullscreen, exactly like desktop, but driven by real scroll. The video
  // stays paused (poster) during the scale (cheap; no per-frame video resample)
  // and we call play() once it's essentially fullscreen. Passive + rAF-coalesced.
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!coarse || reduced) return;
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;
    let played = false;
    const write = () => {
      raf = 0;
      // Pin range = how much taller the section is than one viewport = the
      // distance over which the sticky viewport stays pinned. Complete the
      // expand over the first ~72% of it so the last stretch holds the video
      // full-screen (a short dwell) before the hero unpins into the page.
      const pinRange = Math.max(section.offsetHeight - window.innerHeight, 1);
      const p = Math.min(Math.max(window.scrollY / (pinRange * 0.72), 0), 1);
      const ps = p.toFixed(4);
      section.style.setProperty('--progress', ps);
      document.documentElement.style.setProperty('--hero-progress', ps);
      const v = videoRef.current;
      if (!played && p >= 0.9 && v) {
        played = true;
        v.muted = true;
        v.play().catch(() => {
          /* Autoplay blocked, poster stays, no harm. */
        });
      }
      // Scrolled back to the very top: restore the paused poster so the expand
      // reads the same way the next time down.
      if (played && p <= 0.04 && v) {
        played = false;
        try {
          v.pause();
          v.currentTime = 0;
        } catch {
          /* ignore */
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };
    write();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    // The lerp loop only drives the desktop scroll-hijack. Static mode
    // (reduced-motion or touch) holds --progress and needs no loop.
    if (staticHeroRef.current) return;
    const tick = () => {
      const diff = targetRef.current - currentRef.current;
      if (Math.abs(diff) < 0.001) {
        currentRef.current = targetRef.current;
      } else {
        currentRef.current += diff * SMOOTHING;
      }
      const p = currentRef.current.toFixed(4);
      sectionRef.current?.style.setProperty('--progress', p);
      // Also publish on <html> so elements outside this section (Navbar,
      // AnnouncementBanner) can fade in step with the video expansion.
      document.documentElement.style.setProperty('--hero-progress', p);
      // Toggle expanded state only at the boundary. Record the timestamp the
      // first time we hit fullscreen so the wheel handler can enforce the
      // dwell period. Also toggle a class on <html> so page chrome (navbar,
      // banner) can switch to visibility:hidden and never leak a sticky
      // sliver during fullscreen.
      if (currentRef.current >= 0.985 && !expanded) {
        expandedAtRef.current = Date.now();
        document.documentElement.classList.add('hero-expanded');
        setExpanded(true);
      }
      if (currentRef.current < 0.985 && expanded) {
        expandedAtRef.current = null;
        document.documentElement.classList.remove('hero-expanded');
        setExpanded(false);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [expanded]);

  // Schedule a snap to whichever end-state is closer when the user stops
  // scrolling. Resets on every new input.
  const scheduleSnap = () => {
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      targetRef.current = targetRef.current >= 0.5 ? 1 : 0;
    }, IDLE_SNAP_MS);
  };

  useEffect(() => {
    const updateTarget = (delta: number) => {
      // Clamp the per-event jump so one fast trackpad fling can't blast from
      // 0 to 1 in a single tick, the user needs to actually experience the
      // expansion, not skip it.
      const capped = Math.max(-MAX_DELTA_PER_EVENT, Math.min(MAX_DELTA_PER_EVENT, delta));
      targetRef.current = Math.min(Math.max(targetRef.current + capped, 0), 1);
      scheduleSnap();
    };

    // True while we're in the post-expand dwell, page scroll stays locked
    // even though we technically have a fullscreen video.
    const inDwell = () =>
      expanded &&
      expandedAtRef.current !== null &&
      Date.now() - expandedAtRef.current < DWELL_AFTER_EXPAND_MS;

    const onWheel = (e: WheelEvent) => {
      // Once expanded AND past the dwell, let the user scroll the page
      // normally, but if they scroll up at the very top, snap back to intro.
      if (expanded && !inDwell()) {
        if (e.deltaY < 0 && window.scrollY <= 4) {
          targetRef.current = 0;
          e.preventDefault();
        }
        return;
      }
      // Intro or dwell: absorb the wheel event. During dwell we ignore the
      // delta so the user just "waits out" the buffer.
      e.preventDefault();
      if (!expanded) updateTarget(e.deltaY * 0.0012);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? 0;
      const delta = touchYRef.current - y;
      if (expanded && !inDwell()) {
        if (delta < -25 && window.scrollY <= 4) {
          targetRef.current = 0;
          e.preventDefault();
        }
        return;
      }
      e.preventDefault();
      if (!expanded) updateTarget(delta * 0.005);
      touchYRef.current = y;
    };

    const lockTopWhileIntro = () => {
      // Keep the page pinned to scrollTop=0 while we're in the intro or in
      // the post-expand dwell, so a runaway scroll can't jump past the hero.
      if (!expanded || inDwell()) window.scrollTo(0, 0);
    };

    // Keyboard accessibility, Space, PageDown, ArrowDown advance the intro;
    // Escape / End skip directly to expanded so keyboard-only users aren't
    // stuck behind the scroll lock.
    const onKey = (e: KeyboardEvent) => {
      if (expanded) return;
      const advance = ['ArrowDown', 'PageDown', ' ', 'Space'].includes(e.key);
      const skip = e.key === 'Escape' || e.key === 'End';
      if (advance) {
        e.preventDefault();
        updateTarget(0.18);
      } else if (skip) {
        e.preventDefault();
        targetRef.current = 1;
      }
    };

    // Static hero (reduced-motion or touch): no scroll listeners at all. On
    // touch the CSS shows a full-bleed autoplay video; the page scrolls past
    // it normally.
    if (staticHeroRef.current) return;

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('scroll', lockTopWhileIntro);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('scroll', lockTopWhileIntro);
      window.removeEventListener('keydown', onKey);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, [expanded]);

  // Prefer splitting on a separator character, middle dot (·) or em-dash (, )
  // so the two halves fan cleanly with the separator as the implicit hinge.
  // The separator is rendered as its own animated span so it can disappear
  // upwards as the hero expands. Falls back to splitting after the first
  // word when no separator is found.
  const sepMatch = title.match(/[·, ]/);
  const sepChar = sepMatch?.[0] ?? '';
  const sepIdx = sepChar ? title.indexOf(sepChar) : -1;
  const [firstHalf, secondHalf] =
    sepIdx >= 0
      ? [title.slice(0, sepIdx).trim(), title.slice(sepIdx + 1).trim()]
      : [title.split(' ')[0] ?? '', title.split(' ').slice(1).join(' ')];

  return (
    <section
      ref={sectionRef}
      className={`scroll-expand-hero ${expanded ? 'is-expanded' : ''}`}
      aria-label="Introduction"
    >
      {/* Sticky viewport. On desktop this is display:contents and does nothing.
          On touch it becomes a 100dvh sticky box inside a tall section, so the
          media/title pin to the screen while the page scrolls the expand. */}
      <div className="scroll-expand-hero__viewport">
        {bgSrc && (
          <video
            className="scroll-expand-hero__bg-video"
            src={bgSrc}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        )}
        <div className="scroll-expand-hero__bg" aria-hidden="true" />

        {/* Media tile lives OUTSIDE the flex stage so its size doesn't have to
          compete with the title/eyebrow/hint heights. Positioned absolutely
          and centered, it can actually reach the viewport edges at full
          expansion (the previous in-flow flex layout left ~40px gaps top and
          bottom even when "100dvh" tall). */}
        <div className="scroll-expand-hero__media">
          {videoSrc ? (
            // No `autoPlay` attribute on purpose: playback is started from JS
            // (the force-play effect on desktop/reduced-motion, the scroll-
            // expand driver on touch once it's nearly fullscreen). The HTML
            // autoplay attribute would start the video immediately and defeat
            // the "scale the paused poster, not a playing video" trick on mobile.
            <video
              ref={videoRef}
              src={videoSrc}
              poster={posterSrc}
              muted
              loop
              playsInline
              className="scroll-expand-hero__video"
            />
          ) : (
            <div className="scroll-expand-hero__placeholder" aria-hidden="true">
              <span className="scroll-expand-hero__placeholder-label">Chapter video</span>
              <span className="scroll-expand-hero__placeholder-hint">
                Pass a videoSrc prop in src/pages/index.astro to replace this.
              </span>
            </div>
          )}
          <div className="scroll-expand-hero__media-tint" aria-hidden="true" />
        </div>

        <div className="scroll-expand-hero__stage">
          <h1 className="scroll-expand-hero__title-row">
            <span className="font-display scroll-expand-hero__title-word scroll-expand-hero__title-word--first">
              {firstHalf}
            </span>
            {secondHalf && sepChar && (
              <span
                className="scroll-expand-hero__title-sep"
                aria-hidden="true"
                data-sep-char={sepChar}
              />
            )}
            {secondHalf && (
              <span className="font-display scroll-expand-hero__title-word scroll-expand-hero__title-word--rest">
                {secondHalf}
              </span>
            )}
          </h1>
          <p className="scroll-expand-hero__eyebrow">{eyebrow}</p>
          <p className="scroll-expand-hero__hint">{scrollHint}</p>
        </div>
      </div>
    </section>
  );
}
