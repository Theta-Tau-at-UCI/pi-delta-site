// GlowCard, pointer-tracking glow border. Adapted from the original snippet
// shared by the user: removed the inline <style> injection and Next.js-specific
// dependencies; the styles now live in global.css. Move the cursor over the
// card to see a warm spotlight chase the pointer along the border.
import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  /** Base hue (degrees). Defaults to maroon → gold range for on-brand glow. */
  hue?: number;
  /** Spread (degrees) the hue covers as the pointer travels. */
  spread?: number;
}

export default function GlowCard({ children, className = '', hue = 30, spread = 60 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Only track the pointer while the card is hovered, adding a document-level
  // listener per card (e.g. for 55 brother cards) would fire 55 callbacks per
  // mouse-move event and tank the framerate. Scoping to the card itself means
  // exactly one card is doing work at a time.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let inside = false;
    const onMove = (e: PointerEvent) => {
      if (!inside) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--x', String(e.clientX - rect.left));
      el.style.setProperty('--xp', String((e.clientX - rect.left) / rect.width));
      el.style.setProperty('--y', String(e.clientY - rect.top));
    };
    const onEnter = () => {
      inside = true;
    };
    const onLeave = () => {
      inside = false;
    };
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointermove', onMove);
    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-glow-card
      style={
        {
          '--base': hue,
          '--spread': spread,
        } as React.CSSProperties
      }
      className={`glow-card ${className}`}
    >
      {children}
    </div>
  );
}
