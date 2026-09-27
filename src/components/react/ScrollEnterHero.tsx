// ScrollEnterHero — the scale.ai-style "scroll to enter" intro. A tall section
// with a sticky viewport: as you scroll, a centered video tile scales from a
// small poster card to fullscreen, the title fades, then the page continues into
// the site. Crucially this uses NATIVE (Lenis) scroll — no scroll-hijack — so it
// plays nice with the global smooth scroll, and it scales a PAUSED poster (cheap,
// no jank), only calling play() once it's essentially fullscreen. Honors
// prefers-reduced-motion (static full-bleed video, no expand).
import { useEffect, useRef, type CSSProperties } from 'react';

interface Props {
  videoSrc: string;
  posterSrc?: string;
  kicker?: string;
  title?: string;
  cue?: string;
}

export default function ScrollEnterHero({
  videoSrc,
  posterSrc,
  kicker = 'Theta Tau · Pi Delta · UC Irvine',
  title = 'The professional engineering fraternity.',
  cue = 'Scroll to enter',
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      // Static full-bleed video hero: hold at fully-entered, play immediately.
      section.style.setProperty('--enter', '1');
      const v = videoRef.current;
      if (v) {
        v.muted = true;
        v.play().catch(() => {});
      }
      return;
    }

    let raf = 0;
    let played = false;
    const write = () => {
      raf = 0;
      // Pin range = how much taller the section is than one viewport. Complete
      // the expand over the first ~72% of it, holding fullscreen for the rest.
      const pin = Math.max(section.offsetHeight - window.innerHeight, 1);
      const p = Math.min(Math.max(window.scrollY / (pin * 0.72), 0), 1);
      section.style.setProperty('--enter', p.toFixed(4));
      const v = videoRef.current;
      if (!played && p >= 0.9 && v) {
        played = true;
        v.muted = true;
        v.play().catch(() => {});
      }
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

  const words = title.split(' ');

  return (
    <section ref={sectionRef} className="se-hero">
      <div className="se-hero__sticky">
        {/* Faded chapter photo behind the tile, so the ground reads as an image
            washed back into the maroon (no gradient, just a flat scrim). */}
        <div className="se-hero__bg" aria-hidden="true" />
        <div className="se-hero__tile">
          {/* preload="none": nothing is fetched until play() is called near
              full-screen, the poster covers the frame until then. */}
          {videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              poster={posterSrc}
              muted
              loop
              playsInline
              preload="none"
              className="se-hero__video"
              aria-hidden="true"
            />
          ) : null}
          <div className="se-hero__tint" aria-hidden="true" />
        </div>
        <div className="se-hero__stage">
          <p className="rv-eyebrow se-hero__kicker">{kicker}</p>
          {/* Words settle in from the centre one after another on load. Each
              span keeps a trailing space so tag-stripping crawlers read
              "The professional engineering fraternity." rather than one run-on
              word; the span is inline-block, so that space is trimmed at the
              end of its line box and the visible spacing is unchanged. */}
          <h1 className="font-display se-hero__title" aria-label={title}>
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="se-hero__word"
                style={{ '--w': i } as CSSProperties}
                aria-hidden="true"
              >
                {i < words.length - 1 ? `${word} ` : word}
              </span>
            ))}
          </h1>
          <p className="se-hero__cue" aria-hidden="true">
            {cue}
          </p>
        </div>
      </div>
    </section>
  );
}
