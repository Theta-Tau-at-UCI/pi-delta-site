// TestimonialsScroller, two staggered columns of testimonial cards that loop
// infinitely. Instead of a fixed framer-motion transform (which the viewer
// can't touch), each column is a real scroll container that the component
// gently auto-advances via requestAnimationFrame. The viewer can grab and
// scroll it themselves at any time, touch drag, trackpad, or wheel, and the
// auto-scroll pauses while they interact (or hover) and resumes afterward.
// Each column duplicates its testimonials so the wrap seam never shows.
// Honors prefers-reduced-motion (no auto-advance; manual scroll still works).
import { useEffect, useMemo, useRef } from 'react';

export interface ScrollerTestimonial {
  name: string;
  role: string;
  memberClass: string;
  quote: string;
  photo?: string;
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Column({
  testimonials,
  speed,
  className = '',
}: {
  testimonials: ScrollerTestimonial[];
  /** Auto-scroll speed in pixels per second. */
  speed: number;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Reduced motion: no auto-advance, but the column is still a native scroll
    // container so the reader can scroll it themselves.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let last = 0;
    let paused = false;
    let resumeTimer = 0;
    // Float accumulator for the auto-scroll position (scrollTop rounds, so we
    // can't rely on reading it back to accumulate sub-pixel steps). `lastSet`
    // is the value we last wrote, used to tell our own scrolls apart from the
    // user's.
    let pos = el.scrollTop;
    let lastSet = -1;
    // The list is duplicated, so a full set is exactly half the scrollHeight;
    // wrapping within [0, half) keeps the loop seamless (both halves match).
    const half = () => el.scrollHeight / 2;

    const step = (now: number) => {
      if (last === 0) last = now;
      // Clamp the delta so a backgrounded tab (or a locked phone) coming back
      // can't apply one giant frame and leap the column across the list.
      const dt = Math.min(now - last, 50);
      last = now;
      if (!paused) {
        pos += (speed * dt) / 1000;
        const h = half();
        if (h > 0 && pos >= h) pos -= h;
        el.scrollTop = pos;
        lastSet = el.scrollTop;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    // Detect user scrolls (wheel, drag, touch, anything) by noticing the
    // scroll position diverge from what we last wrote. Pause the auto-advance
    // and resume a beat after the user stops, continuing from where they left
    // it. This has no hover/pointer listeners to get wedged in a paused state.
    const RESUME_DELAY_MS = 1200;
    const onScroll = () => {
      if (Math.abs(el.scrollTop - lastSet) <= 2) return; // our own write
      paused = true;
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        paused = false;
        pos = el.scrollTop;
        last = 0;
      }, RESUME_DELAY_MS);
    };
    el.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      if (resumeTimer) window.clearTimeout(resumeTimer);
      el.removeEventListener('scroll', onScroll);
    };
  }, [speed]);

  return (
    <div ref={scrollRef} className={`testimonials-scroller__column ${className}`}>
      <div className="testimonials-scroller__track">
        {[...testimonials, ...testimonials].map((t, idx) => (
          <figure className="testimonials-scroller__card" key={`${t.name}-${idx}`}>
            <blockquote className="testimonials-scroller__quote">“{t.quote}”</blockquote>
            <figcaption className="testimonials-scroller__caption">
              <span className="testimonials-scroller__portrait" aria-hidden="true">
                {t.photo ? (
                  <img src={t.photo} alt="" className="testimonials-scroller__portrait-img" />
                ) : (
                  <span className="testimonials-scroller__portrait-initials font-display">
                    {initials(t.name)}
                  </span>
                )}
              </span>
              <span>
                <span className="testimonials-scroller__name font-display">{t.name}</span>
                <span className="testimonials-scroller__role">
                  {t.role} · {t.memberClass}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsScroller({
  testimonials,
}: {
  testimonials: ScrollerTestimonial[];
}) {
  // Always render two columns for editorial rhythm. With a small number of
  // testimonials each column shows the same items at different speeds, the
  // tracks drift in and out of phase rather than reading as a single loop.
  const { columnA, columnB } = useMemo(() => {
    const a: ScrollerTestimonial[] = [];
    const b: ScrollerTestimonial[] = [];
    testimonials.forEach((t, i) => (i % 2 === 0 ? a.push(t) : b.push(t)));
    return {
      columnA: a.length ? a : testimonials,
      columnB: b.length ? b : testimonials,
    };
  }, [testimonials]);

  return (
    <div className="testimonials-scroller">
      <Column testimonials={columnA} speed={32} />
      <Column testimonials={columnB} speed={24} className="testimonials-scroller__column--alt" />
      <div
        className="testimonials-scroller__fade testimonials-scroller__fade--top"
        aria-hidden="true"
      />
      <div
        className="testimonials-scroller__fade testimonials-scroller__fade--bottom"
        aria-hidden="true"
      />
    </div>
  );
}
