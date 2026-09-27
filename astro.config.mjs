// @ts-check
import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Production domain. MUST stay in sync with `url` in src/data/site.ts (which
// feeds canonical/OG tags) — both default to the live domain and are overridden
// by the same PUBLIC_SITE_URL env var, so the sitemap and the canonical tags
// never diverge. Set PUBLIC_SITE_URL in the deploy environment if it changes.
const SITE_URL = process.env.PUBLIC_SITE_URL ?? 'https://www.thetatauuci.com';

// Routes that exist for development only: the foundations preview, the revamp
// prototype, and the still-placeholder projects page. They are excluded from
// the sitemap *and* deleted from the build output by `pruneInternalRoutes()`
// below, so they 404 in production and stay fully usable in `npm run dev`.
// One list feeds both steps so the two can never drift apart. Drop a route from
// here the moment its page holds real, linked content.
const INTERNAL_ROUTES = ['styleguide', 'prototype', 'projects'];

/**
 * True when a sitemap candidate URL belongs to one of INTERNAL_ROUTES.
 * Compares whole path segments so a future '/projects-archive' is not caught.
 * @param {string} page Absolute URL emitted by @astrojs/sitemap.
 */
const isInternalRoute = (page) => {
  const path = new URL(page).pathname.replace(/\/+$/, '');
  return INTERNAL_ROUTES.some((route) => path === `/${route}` || path.startsWith(`/${route}/`));
};

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,

  // Static output is ideal for a content-driven marketing site (best SEO +
  // performance). Switch to 'server'/'hybrid' only if a route truly needs it.
  output: 'static',

  // React is added as an *island* integration. Most of the site is static
  // HTML with zero JS; React is used only where interactivity is required
  // via `client:*` directives. @astrojs/sitemap emits sitemap-index.xml +
  // sitemap-0.xml at build (referenced from public/robots.txt). The inline
  // `prune-internal-routes` integration drops the dev-only routes from the
  // build output (see its comment).
  integrations: [
    react(),
    sitemap({
      // Keep the dev-only routes out of the public sitemap.
      filter: (page) => !isInternalRoute(page),
    }),
    pruneInternalRoutes(),
  ],

  // Tailwind CSS v4 is wired through its first-party Vite plugin (CSS-first
  // config lives in src/styles/global.css — no tailwind.config.js needed).
  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    // Tighten this allow-list when real remote image hosts are known.
    remotePatterns: [{ protocol: 'https' }],
  },
});

/**
 * INTERNAL_ROUTES are unlinked, dev-only pages (foundations preview, revamp
 * prototype, placeholder projects page). They're useful in `npm run dev` but
 * should never ship publicly, so delete them from the build output. Result: a
 * real 404 in production, full access in dev. Excluding them from the sitemap
 * is not enough on its own — a 200 with placeholder copy is still crawlable and
 * shareable once the site is on its real domain.
 * @returns {import('astro').AstroIntegration}
 */
function pruneInternalRoutes() {
  return {
    name: 'prune-internal-routes',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        await Promise.all(
          INTERNAL_ROUTES.map((route) =>
            rm(fileURLToPath(new URL(`${route}/`, dir)), {
              recursive: true,
              force: true,
            }),
          ),
        );
      },
    },
  };
}
