# Quality Checklist

Run through this before shipping meaningful changes. Adapt as the project matures.

## SEO

- [ ] Unique, descriptive `<title>` and meta description per page
- [ ] Canonical URL set; correct `PUBLIC_SITE_URL`
- [ ] Open Graph + Twitter tags (via `SEO.astro`)
- [ ] Semantic headings (single `<h1>`, logical order)
- [ ] Sitemap + `robots.txt` (add `@astrojs/sitemap` when content exists)
- [ ] Structured data where appropriate (Organization, Event, etc.)
- [ ] Descriptive, lowercase, hyphenated URLs

## Accessibility (WCAG 2.2 AA)

- [ ] Keyboard operable; logical focus order; visible focus
- [ ] Color contrast AA (text + UI components)
- [ ] Meaningful `alt` text; decorative images `alt=""`
- [ ] Form fields have associated `<label>`s; errors announced
- [ ] Landmarks present; skip link works
- [ ] `prefers-reduced-motion` respected
- [ ] Checked with a screen reader / automated tool (axe, Lighthouse)

## Performance

- [ ] Images optimized via `astro:assets`; correct sizes; lazy where appropriate
- [ ] Minimal client JS; islands hydrate lazily
- [ ] Good Lighthouse / Core Web Vitals (LCP, CLS, INP)
- [ ] Fonts loaded efficiently (preload/subset if custom)

## Security

- [ ] No secrets or personal data committed; `.env` git-ignored
- [ ] External links use `rel="noopener"` where needed
- [ ] Contact form has spam protection + server-side validation (when wired)
- [ ] Dependencies reviewed; `npm audit` understood (dev-only vs prod)

## Responsive

- [ ] Works 320px → large desktop
- [ ] No horizontal overflow; tap targets adequate
- [ ] Tested at `sm` / `md` / `lg`

## Content

- [ ] All copy verified — no invented org details
- [ ] Personal data / photos have consent and confirmation to publish
- [ ] No placeholder text remains in shipped pages

## Deployment

- [ ] `npm run build` succeeds; `dist/` previewed
- [ ] Environment variables configured on host
- [ ] Correct production domain / canonical URLs

## Code review

- [ ] `npm run check` passes (typecheck + lint + format)
- [ ] Components small, typed, reusable, accessible
- [ ] No unexplained overwrites of existing work
- [ ] `docs/TODO.md` updated
