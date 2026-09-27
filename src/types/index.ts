// Shared TypeScript types for the site.
// These are structural placeholders, expand as real content is modeled.

export interface NavLink {
  label: string;
  href: string;
  /** Optional: open in a new tab (external links). */
  external?: boolean;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  description: string;
  url: string;
  nav: NavLink[];
  social: SocialLink[];
}

export interface SocialLink {
  label: string;
  href: string;
  /** Icon key, map to an SVG in /public/icons or an icon component. */
  icon?: string;
}

export interface SeoProps {
  title: string;
  description?: string;
  /** Path or absolute URL to an Open Graph image. */
  image?: string;
  /** Canonical path (defaults to the current page). */
  canonical?: string;
  /** Set true on pages that should not be indexed. */
  noindex?: boolean;
}
