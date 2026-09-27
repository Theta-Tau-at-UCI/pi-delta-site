// Lightbox, global photo-popout viewer. Mounted once on the page, it
// listens for clicks on anchors with [data-lightbox] and opens a modal
// overlay with the enlarged image. Smooth zoom from the click origin to
// center, dimmed backdrop, X close button, Escape to close, arrow keys
// to step through images sharing the same [data-lightbox-gallery] group,
// focus trap. Honors prefers-reduced-motion (skip the zoom, fade only).
import { useCallback, useEffect, useRef, useState } from 'react';

interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface Origin {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function Lightbox() {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<LightboxImage[]>([]);
  const [index, setIndex] = useState(0);
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  // When a tile without a real `src` is clicked we render an alternate
  // "Photo coming soon" view (chapter monogram + caption) using the same
  // overlay + close + Escape infrastructure. `placeholderLabel` is non-null
  // exactly when we're in that mode.
  const [placeholderLabel, setPlaceholderLabel] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Detect reduced motion at mount; if true, skip the zoom transform.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Wire global click listener, any anchor/button with data-lightbox opens.
  // Images within the same data-lightbox-gallery="<name>" become a navigable
  // group; clicking opens at the right starting index.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Placeholder-mode trigger, tile has no real image yet. Render the
      // chapter monogram + "coming soon" view in the same overlay.
      const placeholderTarget = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        '[data-lightbox-placeholder]',
      );
      if (placeholderTarget) {
        e.preventDefault();
        const label = placeholderTarget.getAttribute('data-lightbox-placeholder') || '';
        const rect = placeholderTarget.getBoundingClientRect();
        setOrigin({ x: rect.left, y: rect.top, w: rect.width, h: rect.height });
        setImages([]);
        setIndex(0);
        setPlaceholderLabel(label || 'Chapter photo');
        triggerRef.current = placeholderTarget;
        setOpen(true);
        return;
      }

      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-lightbox]');
      if (!target) return;
      const src = target.getAttribute('data-lightbox') || '';
      if (!src) return;
      e.preventDefault();

      const gallery = target.getAttribute('data-lightbox-gallery');
      let group: LightboxImage[];
      let start = 0;
      if (gallery) {
        const members = [
          ...document.querySelectorAll<HTMLElement>(
            `[data-lightbox][data-lightbox-gallery="${gallery}"]`,
          ),
        ];
        group = members.map((m) => ({
          src: m.getAttribute('data-lightbox') || '',
          alt: m.getAttribute('data-lightbox-alt') || '',
          caption: m.getAttribute('data-lightbox-caption') || undefined,
        }));
        start = Math.max(
          0,
          members.findIndex((m) => m === target),
        );
      } else {
        group = [
          {
            src,
            alt: target.getAttribute('data-lightbox-alt') || '',
            caption: target.getAttribute('data-lightbox-caption') || undefined,
          },
        ];
      }

      const rect = target.getBoundingClientRect();
      setOrigin({ x: rect.left, y: rect.top, w: rect.width, h: rect.height });
      setImages(group);
      setIndex(start);
      setPlaceholderLabel(null);
      triggerRef.current = target;
      setOpen(true);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    // Restore focus to the element that opened us, good a11y hygiene.
    requestAnimationFrame(() => {
      triggerRef.current?.focus?.();
    });
  }, []);

  const goPrev = useCallback(() => {
    if (images.length <= 1) return;
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);
  const goNext = useCallback(() => {
    if (images.length <= 1) return;
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  // Body scroll lock + keyboard + focus trap while open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Pause global Lenis smooth-scroll while the overlay is open, otherwise the
    // page keeps scrolling behind it (Lenis scrolls the window, not body).
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowLeft') {
        goPrev();
      } else if (e.key === 'ArrowRight') {
        goNext();
      } else if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    // Focus the close button on open so SR users land inside the dialog.
    requestAnimationFrame(() => closeBtnRef.current?.focus());

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [open, close, goPrev, goNext]);

  if (!open) return null;

  const image = images[index];
  const isPlaceholder = placeholderLabel !== null;
  if (!isPlaceholder && !image) return null;

  // Compute the initial transform for the zoom-from-origin animation.
  // We render the image centered (filling the viewport with object-fit:
  // contain) and animate from the origin tile's position via a CSS
  // custom property carried into a keyframe. Reduced-motion users skip
  // this and just get a fade.
  const styleVars: React.CSSProperties = origin
    ? ({
        // The keyframe reads --x/--y/--w/--h from the wrapper.
        ['--lb-x' as string]: `${origin.x}px`,
        ['--lb-y' as string]: `${origin.y}px`,
        ['--lb-w' as string]: `${origin.w}px`,
        ['--lb-h' as string]: `${origin.h}px`,
      } as React.CSSProperties)
    : {};

  return (
    <div
      ref={dialogRef}
      className={reducedMotion ? 'lightbox lightbox--reduced' : 'lightbox'}
      role="dialog"
      aria-modal="true"
      aria-label={
        isPlaceholder ? placeholderLabel || 'Photo coming soon' : image?.alt || 'Image viewer'
      }
      style={styleVars}
    >
      <div className="lightbox__backdrop" aria-hidden="true" onClick={close} role="presentation" />

      <button
        ref={closeBtnRef}
        type="button"
        className="lightbox__close"
        onClick={close}
        aria-label="Close image viewer"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {!isPlaceholder && images.length > 1 && (
        <>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            onClick={goPrev}
            aria-label="Previous image"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            onClick={goNext}
            aria-label="Next image"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {isPlaceholder ? (
        <figure className="lightbox__figure lightbox__figure--placeholder">
          <div className="lightbox__placeholder-card">
            <span className="lightbox__placeholder-monogram font-display" aria-hidden="true">
              ΠΔ
            </span>
            <span className="lightbox__placeholder-eyebrow">{placeholderLabel}</span>
            <span className="font-display lightbox__placeholder-headline">Photo coming soon.</span>
            <span className="lightbox__placeholder-body">
              The chapter is uploading real photos. Until then, this tile sits as a styled monogram
              so the page composition is already in place.
            </span>
          </div>
        </figure>
      ) : (
        image && (
          <figure className="lightbox__figure" key={image.src}>
            <img className="lightbox__img" src={image.src} alt={image.alt} />
            {/* Enlarged view shows the photo only, no descriptive caption.
                For a multi-image gallery we still show the position counter so
                the viewer knows where they are in the set. */}
            {images.length > 1 && (
              <figcaption className="lightbox__caption">
                <span className="lightbox__counter" aria-hidden="true">
                  {index + 1} / {images.length}
                </span>
              </figcaption>
            )}
          </figure>
        )
      )}
    </div>
  );
}
