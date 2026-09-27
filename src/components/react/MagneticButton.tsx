// MagneticButton, wraps any child anchor or button and applies a subtle
// pull-toward-cursor translate on hover. Snaps back smoothly on leave.
// Honors prefers-reduced-motion (renders as a static pass-through).
import { useEffect, useRef } from 'react';

interface Props {
  href?: string;
  className?: string;
  /** Maximum pixel pull at the edge of the activation radius. */
  strength?: number;
  /** Activation radius around the button center, in px. Cursor pulls the
   *  button only while inside this radius. */
  radius?: number;
  ariaLabel?: string;
  children: React.ReactNode;
}

export default function MagneticButton({
  href,
  className = '',
  strength = 14,
  radius = 90,
  ariaLabel,
  children,
}: Props) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let targetX = 0;
    let targetY = 0;
    const SMOOTH = 0.22;

    const animate = () => {
      tx += (targetX - tx) * SMOOTH;
      ty += (targetY - ty) * SMOOTH;
      if (Math.abs(tx - targetX) < 0.1 && Math.abs(ty - targetY) < 0.1) {
        tx = targetX;
        ty = targetY;
        el.style.transform = `translate(${tx}px, ${ty}px)`;
        raf = 0;
        return;
      }
      el.style.transform = `translate(${tx}px, ${ty}px)`;
      raf = requestAnimationFrame(animate);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) {
        targetX = 0;
        targetY = 0;
      } else {
        // Falloff from 1 at center to 0 at radius edge.
        const falloff = 1 - dist / radius;
        const pull = strength * falloff;
        targetX = (dx / dist || 0) * pull;
        targetY = (dy / dist || 0) * pull;
      }
      kick();
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      kick();
    };

    window.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [strength, radius]);

  const sharedStyle = {
    display: 'inline-block',
    willChange: 'transform',
    transition: 'transform 0s',
  } as const;

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={`magnetic-btn ${className}`}
        style={sharedStyle}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      className={`magnetic-btn ${className}`}
      style={sharedStyle}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
