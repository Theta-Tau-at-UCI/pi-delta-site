// ScaleMotion, the single scroll-linked motion language for the revamp
// prototype (see docs/REVAMP-BRIEF.md). Everything here is driven *continuously*
// by scroll position via Framer Motion's useScroll/useTransform, smoothed by one
// shared spring, instead of on/off IntersectionObserver toggles. That shared
// physics is what makes the motion read as one deliberate system (like scale.com)
// rather than a pile of unrelated effects.
//
// Honors prefers-reduced-motion: motion is dropped and content renders static.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

// One spring, reused everywhere, so every element eases with the same feel.
const SPRING = { stiffness: 190, damping: 30, mass: 0.5 } as const;

/**
 * Rise, fades and lifts its children in as they enter the viewport, tied to
 * scroll position (not a one-shot). The default motion system for text/blocks.
 */
export function Rise({
  children,
  y = 20,
  className = '',
  as = 'div',
}: {
  children: ReactNode;
  /** How far (px) it starts below its resting position. */
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'span';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    // Finish sooner (over a shorter scroll span) so text settles in quickly
    // instead of drifting up over neighbouring content.
    offset: ['start 0.96', 'start 0.74'],
  });
  const p = useSpring(scrollYProgress, SPRING);
  const opacity = useTransform(p, [0, 1], [0, 1]);
  const ty = useTransform(p, [0, 1], [y, 0]);

  const MotionTag = motion[as] as typeof motion.div;
  if (reduce) {
    const Tag = as;
    return (
      <Tag ref={ref as never} className={className}>
        {children}
      </Tag>
    );
  }
  return (
    <MotionTag
      ref={ref}
      className={className}
      // Matches the no-JS rule in PageLayout, which forces the pre-animation
      // opacity:0 wrappers back to visible when hydration never happens.
      data-reveal
      style={{ opacity, y: ty, willChange: 'transform, opacity' }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Parallax, drifts its children vertically as the section scrolls past, for
 * subtle depth. `speed` > 0 moves slower than scroll (recedes), < 0 faster.
 */
export function Parallax({
  children,
  speed = 0.15,
  className = '',
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const range = 120 * speed;
  const ty = useTransform(scrollYProgress, [0, 1], [range, -range]);
  const y = useSpring(ty, SPRING);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }
  return (
    <motion.div ref={ref} className={className} data-reveal style={{ y, willChange: 'transform' }}>
      {children}
    </motion.div>
  );
}

/**
 * PinnedRow, the signature scale.com move: a section that pins to the screen
 * while its horizontal track slides left, so vertical scrolling reveals a
 * horizontal sequence. Distance is measured from the real track width, so it
 * always ends flush regardless of how many panels are inside.
 */
export function PinnedRow({
  children,
  className = '',
  heightVh = 320,
}: {
  children: ReactNode;
  className?: string;
  /** Total scroll length of the pinned section, in vh. More = slower slide. */
  heightVh?: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [children]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const x = useSpring(xRaw, SPRING);

  // Reduced motion (or before measuring): fall back to a normal horizontal
  // scroll container so all panels are still reachable.
  if (reduce) {
    return (
      <section className={className}>
        <div
          ref={trackRef}
          style={{ display: 'flex', gap: '2rem', overflowX: 'auto', scrollSnapType: 'x mandatory' }}
        >
          {children}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className={className} style={{ height: `${heightVh}vh` }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <motion.div
          ref={trackRef}
          style={{ display: 'flex', gap: '2rem', x, willChange: 'transform', paddingInline: '6vw' }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
