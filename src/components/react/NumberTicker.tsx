// NumberTicker, a small count-up animator. Watches its own container with
// IntersectionObserver; when it scrolls into view, animates from 0 to the
// target value with eased rAF. Honors prefers-reduced-motion (renders the
// final value statically). Pattern adapted from the Magic UI / shadcn
// motion-numbers family, fresh implementation, no third-party dep.
import { useEffect, useRef, useState } from 'react';

interface Props {
  /** The target number (the value the ticker counts up to). */
  value: number;
  /** Animation length in ms. Defaults to ~1.4s; cap is enforced internally. */
  duration?: number;
  /** Text appended after the number, e.g. "+" or "%". */
  suffix?: string;
  /** Text rendered before the number, e.g. "$". */
  prefix?: string;
  /** Decimal places to display. Defaults to 0 (whole numbers). */
  decimals?: number;
}

// Standard easeOutCubic, a slight initial overshoot would look more "playful"
// here but on a chapter site we want crisp, settled.
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function NumberTicker({
  value,
  duration = 1400,
  suffix = '',
  prefix = '',
  decimals = 0,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  // Seed with the real value so the server-rendered HTML carries the actual
  // number (crawlers and no-JS visitors used to read a literal 0). The
  // count-up resets to 0 inside the effect, client-side only.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const node = ref.current;
    if (!node) return;

    // Respect reduced motion, settle on the final value without animating.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let started = false;
    const cap = Math.min(Math.max(duration, 400), 2500);

    const start = () => {
      if (started) return;
      started = true;
      // Drop back to 0 only now, once we know we're animating on the client.
      setDisplay(0);
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / cap);
        setDisplay(value * easeOutCubic(t));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
      // No observer support, just animate immediately on mount.
      start();
      return () => cancelAnimationFrame(raf);
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            start();
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(node);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  const formatted = display.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className="number-ticker" aria-label={`${prefix}${value}${suffix}`}>
      <span aria-hidden="true">
        {prefix}
        {formatted}
        {suffix}
      </span>
    </span>
  );
}
