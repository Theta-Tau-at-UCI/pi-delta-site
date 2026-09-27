import type { SiteConfig } from '@/types/index';

/**
 * Central site configuration. Verified content (chapter facts, roster, rush,
 * Southwestern Region) is mirrored from thetatau-uci-context.md and lives in
 * src/data/chapter.ts. Do not invent member names, dates, or event info.
 */
export const site: SiteConfig = {
  name: 'Theta Tau: Pi Delta Chapter',
  shortName: 'Theta Tau',
  description:
    'Theta Tau, Pi Delta Chapter at UC Irvine. The professional engineering fraternity, built on brotherhood, professionalism, and service.',
  // Feeds canonical + Open Graph URLs. MUST match `site` in astro.config.mjs
  // (which feeds the sitemap); both default here and read the same env var.
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://www.thetatauuci.com',
  // Lean nav mirroring the official site (no dead-end pages).
  nav: [
    { label: 'Brothers', href: '/brothers' },
    { label: 'Events', href: '/events' },
    // Projects tab hidden until we have real projects to show. The /projects
    // page and its data are kept in the repo for when it's ready, just unlinked
    // from the nav, footer, and Explore section so visitors don't hit an empty page.
    // { label: 'Projects', href: '/projects' },
    { label: 'Recruitment', href: '/recruitment' },
    { label: 'About', href: '/about' },
  ],
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/thetatauuci/', icon: 'instagram' },
    { label: 'Facebook', href: 'https://www.facebook.com/thetatauuci/', icon: 'facebook' },
  ],
};
