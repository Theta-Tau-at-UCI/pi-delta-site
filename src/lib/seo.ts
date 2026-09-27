import type { SeoProps } from '@/types/index';
import { site } from '@data/site';

export interface ResolvedSeo {
  title: string;
  description: string;
  canonical: string;
  image: string;
  noindex: boolean;
}

/**
 * Resolves per-page SEO props against site defaults and the current URL.
 * Pass the page's `Astro.url` as `currentUrl`.
 */
export function resolveSeo(props: SeoProps, currentUrl: URL): ResolvedSeo {
  const titleSuffix = site.name;
  const title = props.title ? `${props.title} | ${titleSuffix}` : titleSuffix;

  const canonical = new URL(props.canonical ?? currentUrl.pathname, site.url).toString();
  const image = new URL(props.image ?? '/images/og-default.png', site.url).toString();

  return {
    title,
    description: props.description ?? site.description,
    canonical,
    image,
    noindex: props.noindex ?? false,
  };
}
