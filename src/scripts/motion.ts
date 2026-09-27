// Scroll-reveal controller. Elements with [data-animate] / [data-stagger] /
// [data-stream-in] / [data-reveal-scroll] start hidden (only under
// `.reveal-ready`, so no-JS users see everything) and get `.is-visible` when
// they enter the viewport.
export function initScrollAnimations(): void {
  if (typeof window === 'undefined') return;

  const els = document.querySelectorAll(
    '[data-animate], [data-stagger], [data-stream-in], [data-reveal-scroll]',
  );
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' },
  );

  els.forEach((el) => observer.observe(el));
}
