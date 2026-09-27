# Development Guide

Practical guide for working in this repo.

## Prerequisites

- Node.js >= 20 (developed on Node 24; see `engines` in `package.json`)
- npm (project uses npm + `package-lock.json`)

## Setup

```bash
npm install
cp .env.example .env   # then edit values (PowerShell: Copy-Item .env.example .env)
```

## Everyday commands

```bash
npm run dev          # dev server at http://localhost:4321
npm run build        # production build → dist/
npm run preview      # serve the production build locally
npm run check        # typecheck + lint + format check (run before committing)
npm run lint:fix     # auto-fix lint issues
npm run format       # auto-format with Prettier
```

## Adding a page

1. Create `src/pages/<name>.astro`.
2. Wrap it in `PageLayout` and pass SEO props: `<PageLayout title="..." description="...">`.
3. Compose with `Section`, `Card`, and section components.

## Adding a component

- Static/markup → `.astro` under the appropriate `components/` subfolder.
- Needs interactivity → React island `.tsx`, used with a `client:*` directive
  (prefer `client:visible` or `client:idle` to minimize JS).
- Keep components small, typed, and accessible. Reuse `ui/` primitives.

## Styling

- Tailwind CSS v4 with **CSS-first config** in `src/styles/global.css` (`@theme`).
- Design tokens (colors, fonts, spacing) live there as CSS variables — edit tokens, not
  scattered hex values. See `DESIGN_SYSTEM.md`.
- Prettier (with `prettier-plugin-tailwindcss`) auto-sorts class lists.

## Images

- Put raw static files in `public/` for direct serving.
- For optimized, responsive images, import assets into `src/` and use Astro's
  `<Image />` / `<Picture />` from `astro:assets` (automatic format/size optimization).
- Always provide meaningful `alt` text. Member/event photos need consent (see `BRAND_GUIDE.md`).

## Environment variables

- Defined in `.env` (never committed). Template: `.env.example`.
- Browser-exposed vars MUST be prefixed `PUBLIC_`. Read via `import.meta.env`.

## SEO

- Per-page metadata flows through `PageLayout` → `SEO.astro` → `src/lib/seo.ts`.
- Set the real `site` URL via `PUBLIC_SITE_URL` and in `astro.config.mjs`.

## Deployment (to confirm)

- Static output deploys to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages).
- Build command `npm run build`, output dir `dist/`. Finalize choice in the ADR.

## Before you commit

- Run `npm run check` and `npm run build`.
- Do not commit `.env`, secrets, or personal data / member photos without confirmation.
