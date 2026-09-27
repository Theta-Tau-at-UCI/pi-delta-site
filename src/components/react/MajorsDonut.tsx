// MajorsDonut, interactive SVG donut chart.
//
// Inspired by the interactive donut/chart patterns common across 21st.dev /
// shadcn-charts / Magic UI families. Fresh implementation, no third-party
// chart lib. Beyond the basic draw-in animation, this version is genuinely
// interactive:
//
//   • Hovering or focusing a slice (or its legend item) pops that slice
//     outward, dims the others, and updates the center label to the
//     focused datum's count + percent.
//   • The slice and the legend item are cross-linked, hovering either
//     highlights both.
//   • Clicking a slice (or pressing Enter/Space on a legend item) locks
//     the selection. Clicking again, pressing Escape, or hovering outside
//     clears it.
//   • Honors prefers-reduced-motion: no draw-in animation, no transitions.
//
// Designed to be reused for any donut, gender breakdown, major
// breakdown, future stat breakdowns. Pass `data` + a `totalLabel`.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface DonutDatum {
  label: string;
  count: number;
}

interface Props {
  data: DonutDatum[];
  /** Default label under the centered total when no slice is focused. */
  totalLabel?: string;
  /** Optional chart caption rendered above the chart. */
  caption?: string;
  /** Optional palette override. Default cycles through warm chapter tones. */
  palette?: string[];
}

/* -------------------------------------------------------------------------- */
/*                          Default warm-tone palette                         */
/* -------------------------------------------------------------------------- */

// Categorical palette for the majors donut, distinct hues with good contrast
// against each other so the major slices are easy to tell apart at a glance.
// Deliberately off-brand: with twelve majors, shades of a single hue pair are
// too close to read apart, so this chart is the one sanctioned exception to the
// maroon/gold palette. Owner decision, keep it.
const DEFAULT_PALETTE = [
  '#2563eb', // blue
  '#dc2626', // red
  '#16a34a', // green
  '#f59e0b', // amber
  '#7c3aed', // violet
  '#ec4899', // pink
  '#0891b2', // cyan
  '#65a30d', // lime
  '#ea580c', // orange
  '#0d9488', // teal
  '#db2777', // rose
  '#64748b', // slate
];

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export default function MajorsDonut({
  data,
  totalLabel = 'actives',
  caption,
  palette = DEFAULT_PALETTE,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawProgress, setDrawProgress] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [pinIdx, setPinIdx] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const focusedIdx = hoverIdx !== null ? hoverIdx : pinIdx;
  const total = useMemo(() => data.reduce((a, d) => a + d.count, 0), [data]);

  // SVG geometry. Bigger viewBox + radius so the center label has room to
  // breathe inside the inner ring (the previous geometry let the focused-
  // slice label overflow into the stroke). Stroke kept proportional.
  const VIEW = 220;
  const CENTER = VIEW / 2;
  const RADIUS = 88;
  const STROKE = 18;
  const HOVER_POP = 5; // outward translate on hover/focus
  const CIRC = 2 * Math.PI * RADIUS;

  const segments = useMemo(() => {
    let cumulative = 0;
    return data.map((d, i) => {
      const fraction = total > 0 ? d.count / total : 0;
      const start = cumulative;
      cumulative += fraction;
      return {
        ...d,
        index: i,
        color: palette[i % palette.length] ?? '#B8902F',
        fraction,
        length: fraction * CIRC,
        startOffset: start * CIRC,
        // Midpoint angle in degrees for the hover-pop transform.
        midAngleDeg: (start + fraction / 2) * 360 - 90,
      };
    });
  }, [data, palette, total, CIRC]);

  // Detect reduced motion + observe scroll-into-view for the draw-in.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(reduced);
    if (reduced) {
      setDrawProgress(1);
      return;
    }
    const node = ref.current;
    if (!node) return;
    if (!('IntersectionObserver' in window)) {
      setDrawProgress(1);
      return;
    }
    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const t0 = performance.now();
            const DURATION = 1100;
            const tick = (now: number) => {
              const t = Math.min(1, (now - t0) / DURATION);
              setDrawProgress(1 - Math.pow(1 - t, 3));
              if (t < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  // Escape clears any pinned selection.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPinIdx(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSliceActivate = useCallback((idx: number) => {
    setPinIdx((prev) => (prev === idx ? null : idx));
  }, []);

  /* ---------------------------- Center label ---------------------------- */
  const center =
    focusedIdx !== null && data[focusedIdx]
      ? {
          value: data[focusedIdx]!.count,
          label: data[focusedIdx]!.label,
          pct: total > 0 ? Math.round((data[focusedIdx]!.count / total) * 100) : 0,
          isSlice: true,
        }
      : {
          value: total,
          label: totalLabel,
          pct: 100,
          isSlice: false,
        };

  // Empty / placeholder state, render a quiet note instead of a hollow ring.
  if (total <= 0) {
    return (
      <div ref={ref} className="majors-donut majors-donut--empty">
        {caption && <p className="majors-donut__caption">{caption}</p>}
        <p className="majors-donut__empty">
          Add counts in <code>src/data/chapter.ts</code> to populate this chart.
        </p>
      </div>
    );
  }

  return (
    <div ref={ref} className="majors-donut" data-has-focus={focusedIdx !== null ? 'true' : 'false'}>
      {caption && <p className="majors-donut__caption">{caption}</p>}

      <div className="majors-donut__layout">
        <div className="majors-donut__chart-wrap" onMouseLeave={() => setHoverIdx(null)}>
          <svg
            className="majors-donut__svg"
            viewBox={`0 0 ${VIEW} ${VIEW}`}
            role="img"
            aria-label={`Donut chart of ${total} ${totalLabel} across ${data.length} categories`}
          >
            {/* Background ring */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="rgba(212, 181, 106, 0.16)"
              strokeWidth={STROKE}
            />

            {segments.map((s) => {
              const isFocused = focusedIdx === s.index;
              const isDimmed = focusedIdx !== null && !isFocused;
              const drawn = s.length * drawProgress;
              const gap = CIRC - drawn;
              const offset = -s.startOffset * drawProgress;

              // Push the focused slice outward along its mid-angle vector.
              const rad = (s.midAngleDeg * Math.PI) / 180;
              const popX = isFocused && !reducedMotion ? Math.cos(rad) * HOVER_POP : 0;
              const popY = isFocused && !reducedMotion ? Math.sin(rad) * HOVER_POP : 0;

              return (
                <g
                  key={`${s.label}-${s.index}`}
                  style={{
                    transform: `translate(${popX}px, ${popY}px)`,
                    transformOrigin: `${CENTER}px ${CENTER}px`,
                    transition: reducedMotion
                      ? 'none'
                      : 'transform 0.25s cubic-bezier(0.2, 0.7, 0.2, 1), opacity 0.18s ease',
                    opacity: isDimmed ? 0.32 : 1,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoverIdx(s.index)}
                  onClick={() => handleSliceActivate(s.index)}
                >
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={STROKE}
                    strokeDasharray={`${drawn} ${gap}`}
                    strokeDashoffset={offset}
                    transform={`rotate(-90 ${CENTER} ${CENTER})`}
                  />
                  {/* Wider invisible hit area so small slices stay clickable. */}
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={STROKE + 14}
                    strokeDasharray={`${drawn} ${gap}`}
                    strokeDashoffset={offset}
                    transform={`rotate(-90 ${CENTER} ${CENTER})`}
                    pointerEvents={drawn > 0 ? 'stroke' : 'none'}
                  />
                </g>
              );
            })}
          </svg>

          {/* Center label, content shifts when a slice is focused. */}
          <div className="majors-donut__center" aria-live="polite">
            <span className="font-display majors-donut__center-value">{center.value}</span>
            <span className="majors-donut__center-label">
              {center.isSlice ? `${center.label} · ${center.pct}%` : center.label}
            </span>
          </div>
        </div>

        <ul className="majors-donut__legend">
          {segments.map((s) => {
            const isFocused = focusedIdx === s.index;
            const isDimmed = focusedIdx !== null && !isFocused;
            // Joined rather than interpolated: the tailwind prettier plugin
            // strips whitespace inside a className template literal, which is
            // what previously glued these into "legend-itemis-focused" and
            // stopped the .is-focused / .is-dimmed styles from ever matching.
            const legendClass = [
              'majors-donut__legend-item',
              isFocused && 'is-focused',
              isDimmed && 'is-dimmed',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <li key={`legend-${s.label}-${s.index}`} className={legendClass}>
                <button
                  type="button"
                  className="majors-donut__legend-btn"
                  onMouseEnter={() => setHoverIdx(s.index)}
                  onMouseLeave={() => setHoverIdx(null)}
                  onFocus={() => setHoverIdx(s.index)}
                  onBlur={() => setHoverIdx(null)}
                  onClick={() => handleSliceActivate(s.index)}
                  aria-pressed={pinIdx === s.index}
                >
                  <span
                    className="majors-donut__swatch"
                    style={{ background: s.color }}
                    aria-hidden="true"
                  />
                  <span className="majors-donut__legend-text">
                    <span className="majors-donut__legend-label">{s.label}</span>
                    <span className="majors-donut__legend-count font-display">
                      {s.count}
                      <span className="majors-donut__legend-pct" aria-hidden="true">
                        {' '}
                        · {Math.round(s.fraction * 100)}%
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
