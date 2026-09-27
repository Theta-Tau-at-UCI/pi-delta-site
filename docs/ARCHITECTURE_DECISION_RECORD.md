# Architecture Decision Record (ADR)

Records key technical decisions for this project and why alternatives were rejected.
Append new decisions as the project evolves; don't rewrite history.

---

## ADR-001 — Framework: **Astro** (static output)

**Date:** 2026-06-01 · **Status:** Accepted

**Context.** Public, content-driven marketing site for an organization. Strong needs: SEO,
performance, accessibility, maintainability, simple deployment. Low need for heavy client-side
app behavior.

**Decision.** Use **Astro** with `output: 'static'`, plus React **islands** for the few
interactive pieces.

**Alternatives considered.**

- **Next.js** — excellent SSG/SSR and SEO, but its App Router / server-component model is more
  machinery than this mostly-static site needs; higher complexity and JS baseline. Strong
  runner-up.
- **Vite + React (SPA)** — weakest fit: client-rendered by default → poor out-of-the-box SEO
  and slower first paint for a content site. Rejected.

**Why Astro wins.** Ships ~zero JS by default (best default performance/SEO), HTML-first and
easy to maintain, first-class image optimization (`astro:assets`) and Content Collections, and
still supports React islands where interactivity is genuinely needed. Best fit on the merits
without over-engineering.

**Verified versions at setup (2026-06-01):** astro 6.4.2, react 19.2.7, @astrojs/react 5.0.6.

---

## ADR-002 — Styling: **Tailwind CSS v4** (CSS-first, Vite plugin)

**Date:** 2026-06-01 · **Status:** Accepted

**Decision.** Tailwind v4 via `@tailwindcss/vite`, configured CSS-first in
`src/styles/global.css` using `@theme` (no `tailwind.config.js`). Design tokens live as CSS
variables.

**Alternatives.** Plain CSS / CSS Modules (more boilerplate, less consistent); the deprecated
`@astrojs/tailwind` integration (superseded by the Vite plugin for v4). Rejected.

---

## ADR-003 — Content structure: **Astro Content Collections** (scaffolded, not yet active)

**Date:** 2026-06-01 · **Status:** Accepted (deferred activation)

**Decision.** Use typed Content Collections (`src/content.config.ts`) for repeating content
(events, members, news) once content is modeled. Structured site data (nav, social) lives in
`src/data`. No collections are defined yet — avoids inventing content prematurely.

---

## ADR-004 — Tooling: **ESLint (flat config) + Prettier**, with **ESLint 9**

**Date:** 2026-06-01 · **Status:** Accepted

**Decision.** ESLint flat config (`eslint-plugin-astro`, `typescript-eslint`,
`eslint-plugin-jsx-a11y`) + Prettier (`prettier-plugin-astro`, `prettier-plugin-tailwindcss`).
Type-checking via `astro check`.

**Why not Biome?** Biome's `.astro` template support is still partial; the ESLint + Prettier
Astro plugins give complete, first-class linting/formatting of `.astro` files today.

**Why ESLint 9, not 10?** ESLint 10 was published, but `eslint-plugin-jsx-a11y` (and parts of
the flat-config plugin ecosystem) still peer-depend on ESLint ≤9 at setup time. Pinning ESLint
**9** yields a clean, coherent dependency tree and keeps accessibility linting, rather than
forcing an incompatible install with `--legacy-peer-deps`. Revisit when plugins support 10.

---

## ADR-005 — Deployment target: **static host (TBD)**

**Date:** 2026-06-01 · **Status:** Proposed

**Decision (tentative).** Static `dist/` output deploys to any static host
(Vercel / Netlify / Cloudflare Pages / GitHub Pages). Final host to be confirmed with the user.

---

## ADR-006 — External repo: **Ruflo → SKIP**

**Date:** 2026-06-01 · **Status:** Accepted

**Context.** Evaluated `ruvnet/ruflo` (read-only) as possible workflow tooling.

**Decision.** **Skip.** Ruflo is a large multi-agent orchestration framework (100+ agents,
vector DB, Raft/Byzantine consensus, federation, 33 plugins, daemons). It is far beyond the
needs of a small content-driven marketing site and would add significant complexity and an
operational/security surface (its install paths include `curl | bash`, `npx ruflo init`, and
auto-triggering post-install hooks). **No Ruflo code was executed.**

---

## ADR-007 — External repo: **UI/UX Pro Max Skill → INSTALLED (project-scoped)**

**Date:** 2026-06-01 · **Status:** Accepted (per user confirmation)

**Context.** Evaluated `nextlevelbuilder/ui-ux-pro-max-skill` (read-only). It's a design-system
intelligence skill (UI styles, color palettes, type pairings, UX/accessibility rules) installed
via the `uipro-cli` npm package.

**Safety review (before any execution).** Inspected `uipro-cli@2.2.3` registry metadata:
**no `preinstall`/`postinstall`/`prepare` lifecycle hooks** (only author-side build scripts);
dependencies are standard CLI libs (commander, chalk, ora, prompts); MIT licensed. The CLI's
`init` writes skill files into the **current project's** `.claude/skills/`; its runtime engine
(`search.py`) requires Python 3 (present on this machine).

**Decision.** The user confirmed installing it now. Installed project-scoped via
`uipro init -a claude`. It is a reference/assist tool for UI/UX and design-system work — it does
not change the application framework or ship anything to the production site. Revisit/remove if
it proves unhelpful once real design begins.

---

## ADR-008 — Animated UI: **framer-motion + lucide-react React islands** (21st.dev / Magic UI patterns)

**Date:** 2026-06-01 · **Status:** Accepted (per user confirmation)

**Context.** The user asked to use components from **21st.dev** to give the homepage a modern,
animated feel (AKPsi-UCI as visual inspiration), and chose the "install real React components"
path with full knowledge of the added dependencies.

**Decision.** Add a small set of animated React islands under `src/components/react/`, built on
the 21st.dev / **Magic UI** patterns: `AuroraHero`, `BentoFeatures`, `Marquee`,
`SocialProofMarquee`, `NumberTicker`. New runtime deps: **framer-motion, lucide-react, clsx,
tailwind-merge, class-variance-authority**.

**How it respects the project's rules.**

- **Static-first preserved.** Most of the page stays static Astro HTML; islands hydrate lazily
  (`client:visible`), except the above-the-fold hero (`client:load`). Animations are mostly CSS
  keyframes (Tailwind v4 `@theme`); JS is only for orchestration/entrance.
- **Accessibility.** Every island honors `prefers-reduced-motion` (`useReducedMotion`), keeps
  44px touch targets and visible focus rings, uses Lucide SVGs (no emoji icons), and ships a
  `<noscript>` fallback so content is visible without JS.
- **No third-party CLI run.** Components were authored in-repo from the open patterns rather than
  pulling via `npx shadcn add` — avoids unreviewed install scripts (consistent with ADR-006).

**Alternatives considered.** (a) Port the designs into pure Astro/CSS with zero new deps — lighter
and more static-pure, but the user explicitly chose the real React components. (b) Run the 21st.dev
CLI — rejected (unreviewed remote install; Tailwind-v3/Next assumptions to reconcile).

**Trade-offs.** Larger client JS for the hydrated islands and a heavier dependency tree than a
pure-static build. Acceptable for the demo and scoped to a few components. Revisit if bundle size
or maintenance cost grows.

**Verified versions at adoption (2026-06-01):** framer-motion, lucide-react, clsx, tailwind-merge
installed via npm (see `package.json`). `class-variance-authority` was briefly installed then
removed as unused (we author components directly rather than via shadcn's `cva` variants).

---

## ADR-009 — Information architecture: **multi-page routes** + scoped scroll component

**Date:** 2026-06-01 · **Status:** Accepted (per user request)

**Context.** The initial demo put every section on one long homepage. The user asked to split the
content into separate "tabs," to add more on-scroll motion, and (via a 21st.dev-style paste) to
integrate an Aceternity `ContainerScroll` component plus a `RadialOrbitalTimeline` and shadcn
primitives.

**Decisions.**

1. **Multi-page routing.** Content is now split into Astro routes — `/about`, `/projects`,
   `/outcomes`, `/events`, `/brotherhood`, `/contact` — surfaced as nav "tabs" with an
   `aria-current` active state. The home page is a landing (hero + scroll showcase + explore
   cards + CTA). A new `PageHeader.astro` gives inner pages a consistent branded header. The
   `Navbar` gained an accessible mobile toggle (progressive-enhancement script; usable with no JS).
2. **Adopt `ContainerScroll`** (scroll-driven 3D card reveal), **adapted** to this stack: removed
   `next/image` and `"use client"`, used our `cn()`, added `useReducedMotion` gating and sane
   heights. Composed via `HomeShowcase` with a branded, abstract preview — **no stock photos of
   people** (likeness consent required).
3. **Rejected: converting the repo to shadcn structure.** Unnecessary churn for an Astro app —
   `cn()` already exists, and we don't need Radix/`cva` primitives. Provided no shadcn CLI setup.
4. **Rejected: `RadialOrbitalTimeline`.** The pasted source was corrupted/incomplete, and a heavy
   interactive orbital widget is a poor fit for a fraternity marketing site. Not integrated.

**Why.** Matches the user's IA request, keeps the static-first model (only the animated islands
hydrate), and avoids importing broken code or a framework-structure migration that earns nothing here.

---

## ADR-010 — Mirror the official site IA + integrate real content

**Date:** 2026-06-01 · **Status:** Accepted (per user request)

**Context.** The user supplied a content scrape of the official site (`thetatauuci.com`) and asked
to **mirror its information architecture** and rebuild every page with the real wording.

**Decision.**

1. **Routes realigned** to the official nav: **Home / Brothers / Recruitment / About** (the earlier
   About/Projects/Outcomes/Events/Brotherhood/Contact tabs were removed; their useful content folded
   in). Real content lives in a typed `src/data/chapter.ts` module (actives, pledge classes,
   testimonials, rush schedule, FAQ, regional chapters, contact).
2. **Personal data included with explicit user confirmation** (CLAUDE.md gate): the public Actives
   directory and named officer testimonials. No LinkedIn URLs were provided (only presence), so the
   badge is a non-linked indicator.
3. **No invented facts.** The Actives roster is partial (source paste truncated), and the founding
   story, demographics charts, officer roster, and founded year were **not** in the provided content
   — these are clearly-labeled placeholders, not fabricated. Counts shown (29 pledge classes, 18
   Western Region chapters) are verifiable from the real data.
4. **Copy voice.** Wording follows the official site; gratuitous em dashes removed from user-facing
   copy. Testimonials are kept verbatim.

**Trade-offs.** A few sections (history, demographics, full roster, officers) remain placeholders
pending data; flagged in `TODO.md`.

---

## ADR-011 — Scrape + adapt specific 21st.dev components (the senior-review polish pass)

**Date:** 2026-06-01 · **Status:** Accepted (per user request)

**Context.** A senior review asked for specific 21st.dev components; the user said to implement them
and "scrape 21st.dev for these components."

**Decision.** The 21st.dev registry endpoint (`https://21st.dev/r/<author>/<slug>`) returns real
component source via WebFetch, so the actual Aceternity/Magic UI source was pulled and **adapted** to
this stack (Astro islands / Tailwind v4 / our `cn()`; no Next.js, no shadcn/radix):

- **AnimatedTestimonials** — Lucide icons (not Tabler), initials avatars (no member photos / consent),
  deterministic tilt (not `Math.random`, avoids hydration mismatch), full reduced-motion handling.
- **Sparkles** — reimplemented as a **dependency-free canvas** (the original needs three
  `@tsparticles` packages); same twinkle effect, reduced-motion aware.
- **BackgroundGradientAnimation** — scoped to a CTA band (not full-screen), pure CSS (dropped the
  pointer-tracking JS), Theta Tau palette; blob keyframes added to `global.css`.
- **BentoGrid** → `BentoExplore` — Astro-native, Lucide SVGs, no shadcn Button/radix.
- **AnnouncementBanner** — custom (rush dates), dismissible via a tiny session script.

**Why.** Faithful to the real components the reviewer named, while keeping static-first, accessible,
and dependency-light. No unverified stats were introduced (see ADR-010).

---

## ADR-012 — Dark-primary theme + multi-agent design pass

**Date:** 2026-06-01 · **Status:** Accepted (per user brand brief)

**Context.** The user supplied a brand brief (maroon `#4A0404` / near-black, gold `#C9A84C`, serif
display + sans body, refs: Linear/Vercel/Stripe) and ran a multi-agent design review (via the
`ui-ux-pro-max` skill) because the site "still looked bad."

**Decisions.**

1. **Dark-primary.** The site now forces dark mode: `class="dark"` on `<html>` + a class-based
   `dark:` variant (`@custom-variant dark (&:where(.dark, .dark *))`) instead of OS-only. Tokens
   updated to the brief's exact maroon/gold (`brand-800 #4a0404`, `brand-900 #1a0505`,
   `accent-500 #c9a84c`, `accent-400 #ddc074`).
2. **Applied the design review's top fixes:** fixed dead hero CTAs (pointed to deleted
   `/contact`/`/brotherhood` → now `/recruitment`/`/brothers`); removed the over-animation
   (deleted Sparkles, slowed aurora 24s→40s + CTA blobs to 2, calmed opacity); shrank
   ContainerScroll's empty bands + tilt; replaced the "Placeholder image N" gallery with a designed
   empty state; tightened Section rhythm + heading tier + width; made the BentoExplore CTA visible
   at rest; reskinned the off-brand green tag; de-doubled the stats band.
3. **Workspace cleanup.** Removed unused files: `Button.astro`, `Card.astro`, `ContactForm.tsx`,
   `Marquee.tsx`, `SocialProofMarquee.tsx`, `Sparkles.tsx`, and dead animation tokens/keyframes.
   Added `thetatau-uci-context.md` as the consolidated content/brand source.

**Why.** Matches the brief and the review's evidence (the site read "demo, not done" via dead links,
dead space, and over-animation). Accessibility fundamentals (focus, reduced-motion, touch targets)
were preserved — the fixes target the default experience, not the a11y layer.

---

## ADR-013 — Expanded page set + native (no-recharts) statistic graphics

**Date:** 2026-06-01 · **Status:** Accepted (per user request)

**Context.** The user chose to build **beyond** the official 4-page site, and asked for chart/graphic
treatments of the statistics using 21st.dev components.

**Decisions.**

1. **Pages expanded** past the official mirror (ADR-010) to: Home, About, Brothers, Recruitment,
   **Events, Projects, Outcomes, Contact**. The new pages use real content where it exists and a
   shared `EmptyState.astro` (designed placeholder) where data is still missing — no invented content.
2. **Statistic graphics built natively, not via recharts.** 21st.dev's chart components are shadcn +
   **recharts** (a heavy React charting lib); their registry endpoints 500'd and recharts conflicts
   with this static-first, light stack. So the **major-breakdown bar chart** (`MajorsChart.astro`,
   real data derived from the listed actives) and the **stat-card graphics** (icon + animated
   `NumberTicker`) are lightweight CSS/SVG in the shadcn chart aesthetic — same pattern as the
   dependency-free `Sparkles` decision (ADR-011). Chart type (horizontal bar, descending, value
   labels) follows the `ui-ux-pro-max` chart guidance.

**Honesty note.** The majors chart is labeled as covering only the **listed (partial) actives**, not
the full chapter; gender/full demographics remain absent (not provided) and are not fabricated.

---

## ADR-014 — Code-review pass: lean nav, full roster, Playfair, scroll-reveal, crest

**Date:** 2026-06-01 · **Status:** Accepted (per user code-review brief)

**Context.** A detailed review brief (with the full 55-member roster + brand rules) superseded the
earlier "keep 8 pages" choice.

**Decisions.**

1. **Nav slimmed to Brothers / Recruitment / About** (+ Home). The Events/Projects/Outcomes/Contact
   pages were deleted (dead-end, no real content); `EmptyState.astro` and `ImageGallery.astro`
   removed with them. Contact lives in the footer. (Supersedes ADR-013's expansion.)
2. **Full 55-member roster** in `chapter.ts` (21 officers + 34 actives). Brothers page shows officers
   first with **gold role badges**, then general actives, then the class lineage. "Partial roster"
   language removed everywhere; `majorBreakdown` now covers all 55.
3. **Typography → Playfair Display** (display) + Inter (body); rule: no sans for H1/H2, no other fonts.
4. **Scroll-reveal motion** added site-wide (IntersectionObserver on every `Section`; no-JS- and
   reduced-motion-safe) — the requested "things that move."
5. **Nav crest:** ΘΤ monogram chip next to the wordmark (stand-in until a real crest SVG is provided).
6. About stat boxes given proper hierarchy (large gold value, small uppercase label).

---

## ADR-015 — Stripe revamp + islands→static for reliability

**Date:** 2026-06-01 · **Status:** Accepted (per user)

**Context.** Using Playwright screenshots (installed locally, `--no-save`, not committed) revealed the
real problem behind "the look isn't sitting right": the below-the-fold **React islands** (`BentoFeatures`
pillars, `AnimatedTestimonials`, `NumberTicker`) were SSR-rendered hidden and `client:visible`, so they
**never hydrated/revealed without scroll** — pillars and testimonials showed as empty black voids and
counters stuck at "0". Static Astro content (majors chart, region table) rendered perfectly.

**Decision.** Anchor the design on **Stripe** (precise stat blocks, strong hierarchy, gradient accents)
and **convert the fragile islands to reliable static Astro**:

- `Pillars.astro` (static feature cards) replaces the `BentoFeatures` island on Home + About.
- Static multi-column `Testimonials.astro` replaces the `AnimatedTestimonials` carousel (also matches
  the brief's "multi-column, not a carousel").
- Home stats are a **static precise stat band** (200+/55/29/2011) — no `NumberTicker` "0" flash.
- Removed the `HomeShowcase`/`ContainerScroll` 3D card (off-brand for Stripe, low value).
- **Only `AuroraHero` remains a React island.** Deleted `BentoFeatures`, `AnimatedTestimonials`,
  `NumberTicker`, `HomeShowcase`, `ContainerScroll`.

**Why.** Content visibility must not depend on JS hydration + scroll. Static-first is the whole point
of the Astro stack; the islands were a reliability liability. Verified fixed via screenshots.

**Tooling note.** Playwright is now available locally for screenshot-based visual verification (run a
script from the project root so `node_modules` resolves; emulate `reducedMotion: 'reduce'` to capture
all reveal-on-scroll content in a static shot).
