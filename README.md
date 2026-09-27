# Theta Tau · Pi Delta Chapter — Website

The official chapter website for **Theta Tau, Pi Delta Chapter at UC Irvine**.
A modern, static-first site built with Astro and Tailwind, designed to be
welcoming to prospective rushees, easy for any future chapter member to
maintain, and quick to update with new brothers, pledge classes, and events.

> **If you're picking this up from a previous webmaster, start with the
> [Quick start](#quick-start) section, then [How to update content](#how-to-update-content).**

---

## What the site is

A multi-page chapter website:

| Page            | Path           | What it shows                                                                                                                            |
| --------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Home**        | `/`            | Scroll-driven hero, stats, pillars, employer marquee, brotherhood voices, Explore bento (drifting brother portraits), rush CTA           |
| **About**       | `/about`       | Chapter facts, majors chart, our-story timeline, pillars, Western Region chapter mosaic                                                  |
| **Brothers**    | `/brothers`    | Filterable brother roster with detail cards (interests, experience, favorite song, Spotify embed), class lineage drawer, alumni section  |
| **Recruitment** | `/recruitment` | Rush schedule, "How rush works", FAQ accordion, interest form                                                                            |
| **Events**      | `/events`      | Past-event archive, category browser, "What's coming up"                                                                                 |
| **Projects**    | `/projects`    | Current chapter project + past-project archive                                                                                           |
| **404**         | any unknown    | Custom not-found page that points back to the main paths                                                                                 |

Default theme is a bright, paper-white light mode — maroon + gold accents on a
near-white "open notebook on a desk" page (white card surfaces lift off the
off-white background). A dark mode toggle lives in the navbar — choice persists
in `localStorage`.

A sticky rush CTA pill floats above the fold on every page and links to
`/recruitment`. Most images on the site are clickable — they open in a global
`Lightbox` overlay (real images zoom in from origin, placeholders open a
chapter-monogram card).

---

## Quick start

Requirements: **Node 20+** (or the version pinned in `.nvmrc`) and **npm**.

```bash
git clone https://github.com/daokoa/ThetaTauWebsite.git
cd ThetaTauWebsite
nvm use                       # picks up Node version from .nvmrc (optional)
npm install
cp .env.example .env          # optional — site runs fine without it
npm run dev                   # opens at http://localhost:4321
```

The site renders without any environment variables (the recruitment form
falls back to `mailto:`, canonical URLs default to `localhost`). To wire up
Formspree, OG canonicals, etc., see [Environment variables](#environment-variables) below.

Every meaningful script:

| Command            | What it does                                                  |
| ------------------ | -------------------------------------------------------------- |
| `npm run dev`      | Start the dev server with hot reload                           |
| `npm run build`    | Build the production site into `dist/`                         |
| `npm run preview`  | Preview the built site locally                                 |
| `npm run check`    | Typecheck + lint + format check — run this before committing   |
| `npm run lint:fix` | Auto-fix lint issues                                           |
| `npm run format`   | Auto-format with Prettier                                      |

---

## Environment variables

All env vars are optional. Copy `.env.example` → `.env` and fill the ones you
need:

| Variable              | Used for                                                            | Required? |
| --------------------- | ------------------------------------------------------------------- | --------- |
| `PUBLIC_SITE_URL`     | Canonical URLs, sitemap, Open Graph (set to your production domain) | Production |
| `PUBLIC_SITE_NAME`    | Site display name in meta tags                                      | Optional |
| `PUBLIC_FORMSPREE_ID` | Recruitment interest form POSTs to `https://formspree.io/f/<id>`    | Optional — without it the form falls back to `mailto:` |
| `PUBLIC_ANALYTICS_ID` | Reserved for analytics (Plausible / PostHog / GA4)                  | Optional |

Anything that needs to reach the browser **must** be prefixed `PUBLIC_` — that's
an Astro convention. Never commit a real `.env`.

---

## How to update content

**Almost every change you'll want to make lives in two files:**

### `src/data/chapter.ts`

The single source of truth for chapter content. Add or update:

- **Executive Board** members (`execBoard`)
- **Directors / Officers** (`directors`)
- **Active members** (`actives`) — name, major, optional fields below
- **Pledge classes** lineage (`pledgeClasses`) and the current class (`currentClass`)
- **Testimonials** (`testimonials`)
- **Rush schedule** (`rushSchedule`)
- **FAQ** (`recruitmentFaqs`)
- **Western Region chapters** (`regionalChapters`)
- **Employer marquees** for the home page (`alumniEmployers`, `internEmployers`)
- **Chapter facts** (`chapterFacts.foundedAtUci`, `installed`, `membersAndAlumni`, `currentActives`)

Every Active/Officer can also set optional profile fields that appear in the
brother detail card on `/brothers`:

```ts
{
  name: 'Jane Doe',
  major: 'Computer Engineering',
  // Optional fields below:
  pledgeClass: 'Iota Beta',
  year: 'Sophomore',                     // any string label
  photo: '/images/brothers/jane.jpg',   // path under /public
  favoriteSong: 'Sunflower — Post Malone',
  spotifyTrackId: '4cOdK2wGLETKBW3PvgPWqT', // from a Spotify share URL
  interests: ['Cycling', 'CTFs'],
  experience: ['Apple SWE intern', 'UCI Mars Rover'],
  askMeAbout: ['Climbing', 'Photography'],
}
```

### `src/data/site.ts`

Top-level site settings — chapter name, nav links, contact info, social URLs.

### Photos

Drop headshot images into **`public/images/brothers/`** and reference them by
path on each brother — e.g. `photo: '/images/brothers/jane-doe.jpg'`. The
brother card portrait is a 3:4 aspect ratio; portrait-style photos work best.
Without a photo set, the card shows initials in a maroon tile.

The home page hero video URL is hardcoded in `src/pages/index.astro` as
`videoSrc` on the `<ScrollExpandHero>` component. Replace the sample URL
when you have real chapter footage; you can also pass a different
`backgroundVideoSrc` if you want the inner / outer videos to differ.

### Rush schedule each quarter

`rushSchedule` in `src/data/chapter.ts` drives the schedule on `/recruitment`,
the next-event date in the home page's sticky rush CTA, and the date range
in the announcement banner across the top. Update it once per rush period.

---

## How the site is built

| Concern        | Choice                                       | Notes                                                              |
| -------------- | -------------------------------------------- | ------------------------------------------------------------------ |
| Framework      | **Astro 6** (static output)                  | Ships ~zero JS by default → fast pages and great SEO              |
| Language       | **TypeScript** (strict)                      | Type-safe data + components                                        |
| Styling        | **Tailwind CSS v4** (CSS-first via `@theme`) | Design tokens live in `src/styles/global.css`                      |
| Interactivity  | **React islands** (`@astrojs/react`)         | Only the brothers explorer, hero, and testimonials use React       |
| Fonts          | **Fraunces** (display) + **Plus Jakarta Sans** (body) | Loaded from Google Fonts in `PageLayout.astro`           |
| Quality        | ESLint + Prettier + `astro check` + CI       | GitHub Actions runs all three on every push                        |

Astro was chosen because it lets you write `.astro` files (HTML + a frontmatter
block) for static content, sprinkle in React only where interactivity is
needed, and have the whole thing ship as fast static HTML.

---

## Project layout

```
src/
  pages/              File-based routes (each .astro is a page)
    index.astro         Home
    about.astro         About
    brothers.astro      Brothers (renders BrothersExplorer island)
    recruitment.astro   Recruitment + rush schedule + interest form
    events.astro        Events archive + categories
    projects.astro      Chapter project showcase
    404.astro           Custom not-found
  layouts/
    PageLayout.astro    Shared <html>/<head>/Navbar/Footer wrapper
  components/
    layout/             Navbar, Footer
    sections/           Reusable section blocks (Pillars, EmployerMarquee,
                        BentoExplore, BrothersFloat, NextPath, TierBands,
                        MajorMosaic, PledgeLineage, StickyRushCTA, …)
    react/              Interactive React islands (ScrollExpandHero, BrothersExplorer,
                        TestimonialsScroller, Lightbox, MagneticButton, RushSchedule, …)
    ui/                 Generic primitives (Section, ImagePlaceholder,
                        SectionDivider)
    SEO.astro           Per-page meta tags
  data/
    chapter.ts          Chapter content (roster, rush, FAQ, etc.) — edit here
    site.ts             Top-level site settings (nav, social links)
  styles/
    global.css          Tailwind v4 @theme tokens + all component CSS
  scripts/
    motion.ts           Scroll-reveal observer (data-animate / data-stagger)
    theme.ts            Light/dark toggle module
  types/                Shared TypeScript types
  lib/                  Small helper utilities (cn)
public/
  favicon.svg
  images/, icons/, logos/   Static assets (photos go here)
docs/                   Long-form documentation (see below)
.github/                CI workflow and PR template
```

### Notable patterns

- **`Lightbox`** is a single React island mounted globally. Any element with
  `data-lightbox="<src>"` (real images) or `data-lightbox-placeholder="<label>"`
  (empty tiles) opens it. Group images with `data-lightbox-gallery="<name>"`
  for arrow-key navigation.
- **`ImagePlaceholder`** is a clickable button that either pops a real image
  (when `src` is set) or a styled "Photo coming soon" card (when it isn't),
  routed through `Lightbox`.
- **`Section`** is the universal section wrapper used across every inner
  page. Supports `accent="word"` (italic-gold accent inside the title) and
  `eyebrow="text"` (small label above the number).
- **`BrothersFloat`** is a drifting marquee of circle portraits. Two
  variants: `background` (low-opacity field behind hero text) and `tile`
  (full-opacity field inside the home page's Brothers bento card).
- **`StickyRushCTA`** is the floating "Rush Theta Tau" pill that follows
  the viewport on every page.

---

## Documentation

Long-form references that explain the design, palette, and conventions:

- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — palette tokens, typography, component conventions
- [`docs/BRAND_GUIDE.md`](docs/BRAND_GUIDE.md) — colors, fonts, tone, accessibility constraints
- [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md) — repository layout in more detail
- [`docs/DEVELOPMENT_GUIDE.md`](docs/DEVELOPMENT_GUIDE.md) — dev workflow, deploying, env vars
- [`docs/QUALITY_CHECKLIST.md`](docs/QUALITY_CHECKLIST.md) — pre-launch and pre-merge checks
- [`docs/ARCHITECTURE_DECISION_RECORD.md`](docs/ARCHITECTURE_DECISION_RECORD.md) — why we picked what we picked
- [`docs/TODO.md`](docs/TODO.md) — iteration log + open follow-ups

Two operating documents for contributors:

- [`CONTRIBUTING.md`](CONTRIBUTING.md) — quick setup + contribution rules
- [`CLAUDE.md`](CLAUDE.md) — operating rules for Claude Code agents working on this repo

Verified chapter content is mirrored in [`thetatau-uci-context.md`](thetatau-uci-context.md)
for reference.

---

## Conventions

- **No invented chapter content.** Don't add member names, alumni claims,
  event dates, or stats that aren't on the official chapter site or
  explicitly confirmed. Placeholder entries that say `"Add employer"` are a
  deliberate prompt for real data.
- **Personal data is sensitive.** Don't commit photos of people without
  likeness consent.
- **Run `npm run check` before pushing.** CI will fail otherwise.
- **One concern per commit.** Easier to review and roll back.
- **Comments explain WHY, not WHAT.** Identifiers cover the what.

---

## Deployment

The site is fully static (`output: 'static'` in `astro.config.mjs`), so any
static host works. Recommended options:

| Host                  | Setup                                                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cloudflare Pages**  | Connect the GitHub repo, set framework preset to **Astro**, build command `npm run build`, output `dist`. Add env vars under Settings → Variables. |
| **Vercel**            | Import the repo, framework is auto-detected. Add env vars under Project Settings → Environment Variables.                                          |
| **Netlify**           | New site from Git, build command `npm run build`, publish directory `dist`. Add env vars under Site Settings → Environment.                        |

Set `PUBLIC_SITE_URL` to the production domain on whichever host you pick —
canonical URLs and Open Graph tags depend on it.

To preview the production build locally before deploying:

```bash
npm run build && npm run preview
```

---

## Roadmap

- [ ] Replace the placeholder hero video with real chapter footage
- [ ] Populate the optional brother profile fields (interests, experience,
      ask-me-about, favorite song / Spotify) with real content
- [ ] Replace placeholder employer marquee entries with real company names
- [ ] Add brother headshot photos to `public/images/brothers/`
- [ ] Add `@astrojs/sitemap` + `robots.txt` before launch
- [x] Recruitment contact form wired to Formspree (set `PUBLIC_FORMSPREE_ID`)
- [x] Dark mode + theme toggle
- [x] Global image lightbox
- [x] Sticky rush CTA + custom 404 page

See [`docs/TODO.md`](docs/TODO.md) for the full backlog.

---

## License / ownership

© Theta Tau, Pi Delta Chapter at UC Irvine. Licensing for code and content is
to be decided by the chapter; no open-source license is currently applied.
