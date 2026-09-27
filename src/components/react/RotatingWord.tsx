import { useEffect, useRef, useState } from 'react';

interface Props {
  /** Words to cycle through. The first is used as the accessible label. */
  words: string[];
  /** Class applied to the wrapper (e.g. the hero's gold italic accent class). */
  className?: string;
  /** Milliseconds each word is shown. */
  interval?: number;
}

/**
 * RotatingWord, an inline headline accent that cycles through words with a
 * vertical slide. Stacks every word in a single inline-grid cell so the line
 * width tracks the widest word (no layout shift). The slide is a plain CSS
 * transition on transform + opacity (GPU-composited) rather than a JS spring,
 * so it stays smooth on mobile with no per-frame main-thread work. Decorative
 * motion: the first word is the accessible label and the animated spans are
 * hidden. Honors prefers-reduced-motion (instant swap, no slide).
 */
export default function RotatingWord({ words, className = '', interval = 2200 }: Props) {
  const [index, setIndex] = useState(0);
  const reduceRef = useRef(false);

  useEffect(() => {
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (words.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [words.length, interval]);

  return (
    <span
      className={className}
      aria-label={words[0]}
      style={{
        display: 'inline-grid',
        position: 'relative',
        overflow: 'hidden',
        // Baseline-align with the static word beside it. The padding gives the
        // italic ascenders/descenders room inside the clip box; the equal
        // negative margin cancels it out of layout so nothing shifts and the
        // baseline still matches (parked words at ±110% stay hidden).
        verticalAlign: 'baseline',
        padding: '0.18em 0.1em',
        margin: '-0.18em -0.1em',
        // Carry the gold-italic accent inline: Astro scopes the hero's accent
        // class to its own template, so it doesn't reach this island's DOM.
        color: 'var(--color-gold)',
        fontStyle: 'italic',
      }}
    >
      {words.map((word, i) => {
        // current = centered; earlier words parked above, later ones below.
        const y = i === index ? '0%' : i < index ? '-110%' : '110%';
        const transition = reduceRef.current
          ? 'none'
          : 'transform 0.55s cubic-bezier(0.2, 0.7, 0.2, 1), opacity 0.4s ease';
        return (
          <span
            key={word}
            aria-hidden="true"
            style={{
              gridArea: '1 / 1',
              whiteSpace: 'nowrap',
              transform: `translateY(${y})`,
              opacity: i === index ? 1 : 0,
              transition,
              willChange: 'transform, opacity',
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
}
