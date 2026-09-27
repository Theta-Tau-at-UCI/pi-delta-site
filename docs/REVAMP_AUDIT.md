# Revamp Audit — Theta Tau Pi Delta Website

**Date:** July 5, 2026
**Auditor stance:** senior web developer reviewing for a full revamp; zero tolerance for
vibecoded patterns (gimmick components, placeholder content in production, dead code,
token systems that exist but aren't used).
**Method:** full code review (all pages, components, styles, data, scripts, configs),
live browser inspection of every page at desktop 1440px and mobile 375px in light and
dark themes, keyboard interaction testing, production build analysis, and a Lighthouse
mobile audit.

---

## Verdict

The foundation is far better than a typical vibecoded site — typecheck/lint/format are
clean, SEO meta is centralized and correct, there's a skip link, focus traps in modals,
and serious `prefers-reduced-motion` coverage. **But the site currently ships editor
placeholders to the public, scroll-jacks the landing page, carries four contradictory
member counts, hauls React + framer-motion everywhere for decorative effects, and runs
on a 5,700-line CSS monolith with a token system it ignores.** The styleguide documents
a design system the site doesn't use. Roughly 1,200 lines of components are dead code.

Every finding below is ticketed with an ID, severity, evidence, and the revamp action.
The revamp plan at the end sequences all of them.

**Severity:** 🟥 P0 = ship-stopper (would fail a professional launch review) ·
🟧 P1 = major (fix during revamp) · 🟨 P2 = minor (fix opportunistically)

### Lighthouse (mobile, dev server)

| Category | Score |
|---|---|
| Accessibility | 97 |
| Best Practices | 96 |
| SEO | 100 |

Good scores — but Lighthouse can't see placeholder content, scroll hijacking, dead code,
or bundle bloat. The failures it did catch are C-14 and A-07 below.

---

## A. Content & product integrity

**A-01 🟥 Placeholder content ships to production — events page.**
Every one of the six event categories on `/events` renders a sample card:
"Sample brotherhood event", "Sample prodev night", "Sample service day", "Sample mixer",
"Sample formal", "Sample regional" — each with a visible **"PLACEHOLDER — REPLACE IN
SRC/DATA/EVENTS.TS"** line and a "FOR EDITORS:" callout box. Verified live in browser.
A visitor (or a rushee's parent) reads scaffolding instructions.
→ *Revamp:* the events archive does not ship until it has ≥1 real event per rendered
category. Categories with no real events render nothing (with an honest "more coming
after fall quarter" line at most). Editor notes must be gated to `import.meta.env.DEV`.

**A-02 🟥 Placeholder content ships to production — projects page.**
`/projects` renders "Sample past project · Sample year" with the same
"PLACEHOLDER — REPLACE IN SRC/DATA/PROJECTS.TS" text. Same rule as A-01.

**A-03 🟥 Placeholder content ships to production — home testimonials.**
The testimonials section on `/` shows two populated quotes next to **two empty
dashed-border "Chapter photo" placeholder frames** (verified in screenshot). Empty
placeholder frames on the landing page are the single loudest "unfinished AI site" tell.
→ *Revamp:* render only populated items; the grid must reflow to fill.

**A-04 🟥 Four contradictory member counts across the site.**
- `src/data/chapter.ts:1-7` comment: "Full **55**-member roster"
- `chapter.ts:408`: `currentActives: 51` (hardcoded literal)
- `brothers.astro:85,92,101`: "**51** active / Fifty-one current brothers"
- `about.astro:287`: "**Sixty-six** current actives"
- Home stat band: "200+ members & alumni, 51 current actives"
→ *Revamp:* every count on the site is derived from `allActives.length`,
`memberClasses.length`, and tier reductions. Zero hand-typed numerals in prose.
This is non-negotiable for a roster-centric site.

**A-05 🟧 Rush information self-contradicts.**
The sticky CTA site-wide announces "**Next: Info Night · 9/29**" with a "See schedule"
button, while the recruitment hero stamp says "**Fall '26 — dates TBD**". One of these
is wrong. → *Revamp:* single `rushStatus` object in `src/data` drives the banner, the
hero stamp, and the schedule; banner renders nothing when dates are TBD.

**A-06 🟧 Employer "logos" are fabricated monograms.**
`EmployerMarquee.astro` renders `name.slice(0,2).toUpperCase()` in a colored box ("KA"
for Kaiser Permanente, "TE" for Tevora…). Fake logo chips read as filler.
→ *Revamp:* either obtain real logo SVGs (with usage permission) or drop the chip
aesthetic and set the employer names in a clean typographic list. No invented marks.

**A-07 🟨 Footer email is visually truncated.** "ucithetatau@g…" at desktop width, and
Lighthouse flags the footer lockup for accessible-name/visible-text mismatch.
→ *Revamp:* let the address wrap or shorten the label ("Email us"), and make the
lockup's `aria-label` start with its visible text.

**A-08 🟨 Events hero decorates with invented date stamps** (OCT 12, FEB 07…) next to an
archive that contains no real events (`events.astro:34-51`). Decorative fake data
adjacent to missing real data compounds A-01. Remove or replace with real dates.

---

## B. UX & interaction

**B-01 🟥 The landing page scroll-jacks the browser.**
`ScrollExpandHero.tsx:142-214` captures `wheel`, `touchmove`, and `keydown` globally
with `passive:false` + `preventDefault()`, pins the page with `window.scrollTo(0,0)` on
every scroll event (line 179), caps progress per event so a fast fling is ignored
(`MAX_DELTA_PER_EVENT = 0.15`), and enforces an **800 ms lock after expansion**
(`DWELL_AFTER_EXPAND_MS`) during which input is swallowed. Verified live: PageDown did
nothing; direct `scrollTop` assignment was reverted; only ~6 key presses or the End key
got through. Scrolling back up at the top re-traps you in the intro.
This is the canonical "award-site" anti-pattern: it breaks user scroll expectation,
WCAG 2 interaction principles, browser find-in-page, and every user's patience on the
second visit. It also makes the page's entire content hostage to one React island.
→ *Revamp:* delete the scroll hijack. If the video hero stays, it plays inline in a
normal-flow hero section. Any scroll-linked flourish must use CSS `animation-timeline:
scroll()`/plain scroll position — never captured input. No dwell locks, ever.

**B-02 🟥 Below-the-fold content is invisible without JS-triggered reveal, and
re-hides when it leaves the viewport.**
Full-page screenshots of `/`, `/recruitment`, `/projects` show 40–70% blank page:
sections animate from `opacity:0` on viewport entry and revert when scrolled away.
Consequences: print/save-as-PDF produces blank pages, full-page capture (and some
crawler renderers) see nothing, and reveal replays every time the user scrolls back up.
→ *Revamp:* reveals run **once** (`IntersectionObserver … unobserve` / animation
fill-mode), and the no-JS default is fully visible content. Verify by full-page
screenshot and by printing.

**B-03 🟧 Sticky rush CTA overlaps content on every page.**
The fixed banner (`sticky-rush-cta`, z-60) covers body copy in the pillars section,
testimonial text, and the footer at 1440×900 (verified in four screenshots). It has a
close button, but occludes content until dismissed on every page height.
→ *Revamp:* reserve space for it (padding-bottom on `main` while visible), shrink it to
a pill on scroll, or scope it to recruitment-adjacent pages. It must never sit on top
of running text. Persist dismissal in `sessionStorage`.

**B-04 🟧 Filter drawer content is scaled with `zoom: 0.68`** (`brothers.astro:507`).
Non-standard property, shrinks interactive filter tiles below the 24×24 CWCAG target
minimum, and fights browser zoom (WCAG 1.4.10).
→ *Revamp:* design the filter panel at real size; delete `zoom`.

**B-05 🟧 The brothers hero headline rotates "brothers." → "friends."** via
`RotatingWord` on a 2.2 s interval — on the page whose entire job is the word
"brothers". Rotating-word heroes are a stock AI-template flourish; five pages mount
this component. → *Revamp:* pick the best word and set it in type (see D-01).

**B-06 🟨 Home hero `h1` is "ΘΤ — UCI"** — a glyph pair, not a message. First-time
visitors (and screen readers, and Google) get no value proposition from the most
important heading on the site. → *Revamp:* real headline ("The professional engineering
fraternity at UC Irvine" belongs in the `h1`, not below it in small text).

**B-07 🟨 Page-transition curtain.** A fixed `pd-curtain` overlay (z-1000) wipes
"PI DELTA" across the screen between page loads. Decorative latency added to every
navigation. → *Revamp:* cut it, or reduce to a ≤150 ms crossfade via the View
Transitions API with reduced-motion respected.

**B-08 🟨 Light mode is a second-class theme.** First visit defaults to light (the
pre-paint script only honors stored preference, not `prefers-color-scheme`), yet the
hero and several sections are authored dark-first — at mobile the cream navbar sits on
the permanently-dark hero. → *Revamp:* honor OS preference on first visit; every
section must be designed in both themes, not repainted via override forests (see C-04).

---

## C. Design system & styling

**C-01 🟥 There is no design system in practice — there's a 5,735-line CSS monolith
plus 2,091 lines of per-page `<style>`.**
`global.css` holds ~19 keyframes, 244 `rgba()` literals, 76 gradients, 18 `!important`;
`events/projects/recruitment/about/brothers.astro` each embed 200–830-line style blocks
of bespoke BEM (`.brother-detail__*` alone ≈ 700 lines). Every section is a one-off
island — the signature of feature-by-feature generation with no composition layer.
→ *Revamp:* extract primitives (Button, Card, Surface, Eyebrow, Pill, Field, Divider,
SectionHeader) consuming tokens; target < 1,000 lines of global CSS and zero page-level
style blocks that restyle shared concepts.

**C-02 🟥 Two competing color systems, three different maroons.**
Tailwind `@theme` defines `--color-brand-50..900` + accents (`global.css:20-34`);
`:root` defines a second semantic set (`--color-maroon #7c0303`, `--color-gold`,
`--color-text`, …) at `global.css:107-143`. Components mix both freely; maroon exists
as `#7b1e1e`, `#7c0303`, `#a82e2e`, `#8a1a1a` depending on which layer a component
happened to use. The file admits the palette is "provisional" (`global.css:18`).
→ *Revamp:* lock official Theta Tau brand values; one primitive palette in `@theme`,
one semantic alias layer (`--surface`, `--text`, `--brand`, `--accent-*`); components
consume only semantics.

**C-03 🟥 Tokens exist but are dead.**
`--radius-soft/card/pill` are each used once; `--spacing-section` is used **zero**
times — meanwhile 24 distinct literal border-radius values, ~90 hardcoded hex colors,
244 rgba literals, 14 ad-hoc z-index values (`-1…1000`), and 65 bespoke multi-layer
shadows are hand-written. 19 mutually inconsistent `clamp()` headline scales; body text
drops to `text-sm` (14 px) on several pages.
→ *Revamp:* enforce scales — radius (4), spacing (8-step), type (display/h1/h2/h3/body/
small/eyebrow with fixed line-height + tracking, 16 px body minimum), elevation (3–4
shadows), z-index (named layers: base/raised/nav/overlay/modal/toast). Lint against raw
hex/rgba in components.

**C-04 🟧 Dark/light theming is hand-forked per element.**
78 `html.dark` + 33 `html:not(.dark)` override blocks; the brother-detail modal alone
carries ~130 lines of light-mode repaint (`global.css:1652-1787`).
→ *Revamp:* semantic tokens flip at `:root` / `html.dark`; delete both override forests.

**C-05 🟧 The gimmick component roster is the full Aceternity/Magic-UI starter pack,
all live:** GlowCard (cursor-chasing HSL spotlight border, 55 instances on the roster),
MagneticButton (cursor-pull rAF lerp), NumberTicker (self-described "adapted from the
Magic UI family"), RotatingWord (framer-motion word cycler), ScrollExpandHero (B-01),
two CSS marquees, TestimonialsScroller (auto-scrolling columns), button hover glow +
sweeping shimmer pseudo-element (`global.css:643-664`), aurora-blob keyframes
(`moveHorizontal/moveVertical`, `global.css:66-87`).
→ *Revamp:* delete GlowCard, MagneticButton, NumberTicker, RotatingWord,
ScrollExpandHero, the shimmer/glow button effects, the aurora keyframes, and at least
one marquee. A chapter site earns trust through photography, real numbers, and clean
typography — not cursor toys. Keep at most one signature motion idea, executed in CSS.

**C-06 🟧 The styleguide documents a system the site doesn't use.**
`styleguide.astro` renders `ed-*` ("Editorial Archival") classes that appear **zero**
times on real pages; the shipped site runs on entirely different undocumented classes.
→ *Revamp:* the styleguide becomes the contract — rebuild it from the real token +
primitive layer, and add a CI grep that fails on classes used in pages but absent from
the styleguide's component inventory.

**C-07 🟧 Fonts: render-blocking Google Fonts stylesheet loading 6 Fraunces variable
instances + 4 Plus Jakarta Sans weights** (`PageLayout.astro:41-46`); no preload, no
self-hosting, no fallback metrics. LCP and CLS risk on every page, plus a GDPR-adjacent
third-party call. → *Revamp:* self-host via fontsource, subset to the 3–4 weights
actually used, preload the display face, add `size-adjust` fallback metrics. Dropping
RotatingWord removes the italic axes entirely.

**C-08 🟨 Glassmorphism/blur inventory:** 16 `blur()` + 11 `backdrop-filter` in CSS
(nav glass, hero video blur, logo chip blur). Keep nav glass at most.

**C-09 🟨 Four duplicate fade-in keyframes** (`brother-detail-fade-in`, `lb-fade-in`,
`lb-fade-only`, `rush-fade-in`) plus `chip-pop`/`chip-pop-staggered`. Consolidate into
one motion-primitive set with shared duration/easing tokens.

**C-14 🟧 Contrast failures confirmed by Lighthouse:** `site-footer__sub`, stamp text,
and the low-opacity token pattern (`/40`–`/70` opacity text: `text-brand-100/60`,
placeholder text at `/40`, 0.55 rem uppercase micro-labels) across pages.
→ *Revamp:* audit every text style ≤ 16 px against WCAG AA with computed colors; kill
the sub-4.5:1 combinations. (Also see A-07.)

---

## D. Architecture & code quality

**D-01 🟥 React + framer-motion ship site-wide for decoration.**
Production JS: **184 KB** React client chunk + **120 KB** framer-motion chunk + per-
island bundles — on a static brochure site. `framer-motion` is imported by exactly two
components (RotatingWord — a `setInterval` word swap; TestimonialsScroller — an
auto-scroller) yet its runtime reaches ~5 pages because every hero mounts RotatingWord.
MagneticButton is one `useEffect` doing `style.transform` — "a vanilla mousemove
handler wearing a React costume." `about.astro` mounts **7 hydration roots** (6
NumberTickers + RotatingWord) to count numbers up.
→ *Revamp:* React islands are justified only where there's real state — keep
`BrothersExplorer`, `RushSchedule`, `Lightbox`. Everything else becomes Astro + small
vanilla scripts (the codebase already has that pattern in `src/scripts/`). Drop
framer-motion from package.json. Target: JS on `/about` ≈ 0 KB, `/` < 15 KB.

**D-02 🟥 1,216 lines of dead components (≈14% of the component layer).**
`ClassChips.astro` (193), `ClassRosters.astro` (410), `FoundersGrid.astro` (432),
`RevealImageList.astro` (181) — zero import sites (verified by cross-reference).
`FoundersGrid` was the only consumer of `chapter.ts`'s `foundingFathers` export, which
is therefore also dead. → *Revamp:* delete all four (git history preserves them); drop
or re-wire `foundingFathers` in the same commit.

**D-03 🟧 The class-filter cluster is six near-duplicate components.**
`ClassLineage`, `TierBands`, `YearChips`, `MajorMosaic` (live) + `ClassChips`,
`ClassRosters` (dead) all render click-to-filter grids. The Greek-letter map +
`monogram()` is duplicated **verbatim in 4 files**; the click-dispatch `<script>` is
copy-pasted in 5; the count-refresh listener in 4.
→ *Revamp:* one `FilterGrid` component (variant prop), `src/lib/greek.ts`, and a single
delegated document-level listener for `[data-filter-type]`.

**D-04 🟧 YearChips ships a dead filter with an editor TODO to the public.**
No brother record has a `year` field (0 matches in `chapter.ts`), so the component
always renders "Year of study isn't tracked yet… add a `year` value" — visible on the
live brothers page filter drawer, with all counts at 0. → *Revamp:* remove until the
data exists (or populate the data). Same production/dev gating rule as A-01.

**D-05 🟧 Hero boilerplate copy-pasted across 5 pages.**
index/about/brothers/events/recruitment each hand-roll the identical hero structure
(eyebrow + Stamp + h1 + RotatingWord + intro + 2 CTAs) with ~150 lines of near-identical
scoped CSS each; the reduced-motion blocks are byte-for-byte copies.
→ *Revamp:* one `PageHero` component with slots/props.

**D-06 🟧 Types are duplicated and drifting.** `RushEvent` is declared in
`chapter.ts:75` **and** re-declared with different optionality in `RushSchedule.tsx:19`.
Domain types (`Active`, `Officer`, `ChapterEvent`, `RushEvent`) live ad-hoc in data
files while `src/types/index.ts` is nearly empty.
→ *Revamp:* move domain types to `src/types`, import everywhere, no re-declarations.

**D-07 🟧 Eager hydration on the heaviest islands.** `ScrollExpandHero client:load`
(index) and `BrothersExplorer client:load` (brothers) contradict the repo's own
CLAUDE.md rule ("hydrate as lazily as possible"). → *Revamp:* B-01 removes the hero
island; `BrothersExplorer` justifies `client:load` only if above the fold — otherwise
`client:visible`.

**D-08 🟨 Dead scaffolding and broken pointers.** Empty content-collections setup
(`content.config.ts` exporting `{}` + `src/content/.gitkeep`); `events.ts:139`
references `src/scripts/calendar.ts` which doesn't exist; the `noscript` CSS in
`PageLayout.astro:56-65` targets `[data-hero]`/`[data-reveal]` selectors that exist
nowhere. → *Revamp:* delete all three or make them real.

**D-09 🟨 Generator scripts aren't wired into npm.** `scripts/import-assets.mjs`
(produces `brother-photos.generated.ts`), `migrate-roster.mjs`, `generate-og.mjs` are
manual `node …` invocations documented only in a doc file.
→ *Revamp:* `npm run generate:photos` / `generate:og`, and decide whether OG generation
runs in build/CI.

**D-10 🟨 Bleeding-edge unpinned majors.** `astro ^6.4.2`, `typescript ^6.0.3`,
`@types/node ^25` — pin framework majors (remove `^`) so `npm i` can't silently jump.

**D-11 🟨 Dates are display strings.** `"Oct 12, 2024"` literals with an optional
parallel `isoDate`, plus a hardcoded month array inside `RushSchedule.tsx:40-53`.
→ *Revamp:* ISO dates as source of truth; one `formatDate` in `src/lib`.

**D-12 🟨 Marketing copy lives in page frontmatter.** Four pages pass ~15-line inline
`NextPath` prop blobs with near-duplicated CTA copy. → *Revamp:* move to `src/data`,
reference by key.

---

## E. Accessibility (beyond B-01/B-04/C-14)

**E-01 🟥 The homepage's only `<h1>` lives inside a `client:load` React island**
(`ScrollExpandHero.tsx:276`), and it's the glyph pair from B-06. If hydration fails,
the page has no h1. → *Revamp:* static, descriptive, server-rendered h1. (Falls out of
B-01 automatically.)

**E-02 🟧 Employer marquee fails reduced-motion.** The global reduced-motion block
(`global.css:3681-3689`) exempts `.marquee-track` but **not**
`.employer-marquee__track` — the employer strip animates forever for vestibular-safety
users. WCAG 2.3.3. → *Revamp:* one shared "all infinite animations off" reduced-motion
rule; also make global `scroll-behavior: smooth` conditional (`global.css:170`).

**E-03 🟧 Marquee content is duplicated for the loop without `aria-hidden`.**
`EmployerMarquee.astro:34` renders every employer twice into the accessibility tree
(the disciplines `Marquee.astro` does this correctly — the fix is already in the
codebase, unused here).

**E-04 🟧 Mobile nav likely unusable without JS.** `Navbar.astro:84` ships the menu
with the `hidden` class; the comment claims "with no JS the menu stays open" but
`data-[open=true]:flex` requires JS and `md:flex` only kicks in ≥768 px.
→ *Revamp:* verify with JS off at 375 px; if broken, `<details>`/`:target` fallback or
server-default open.

**E-05 🟨 Live-region misuse in BrothersExplorer.** Redundant `role="status"` +
`aria-live` on the results count (`:535-541`); the "no matches" empty state wraps an
interactive "Clear filters" button inside a `role="status"` region (`:625-643`).
→ *Revamp:* live region wraps message text only.

**E-06 🟨 Small semantics.** RushSchedule timeline buttons should sit in an `<ol>`;
dialog `aria-labelledby` should reference the visible heading; external Instagram link
(`recruitment.astro:186`) needs `rel="noopener"` and trimmed link text.

---

## F. SEO & metadata

*(Baseline is genuinely good: per-page title/description/canonical/OG/Twitter, real
1200×630 OG image, sitemap with styleguide filtered, robots.txt, env-driven site URL.)*

**F-01 🟧 No structured data at all.** Zero JSON-LD.
→ *Revamp:* `Organization` (name, url, logo, `sameAs` socials from `site.ts`) in the
head; `FAQPage` on recruitment (the FAQ data already exists in `recruitmentFaqs`);
`BreadcrumbList` on inner pages.

**F-02 🟨 404 page lacks `noindex`** (`resolveSeo` defaults it false) and its canonical
resolves to the requested path — a soft-404 signal if the host ever serves it as 200.
→ *Revamp:* `noindex` prop on 404; confirm the host returns HTTP 404.

**F-03 🟨 `<meta name="generator">` exposes the Astro version** (`PageLayout.astro:20`).
Remove.

**F-04 🟨 B-02 is also an SEO risk:** content that only exists after scroll-triggered
JS is fragile for rendering-queue crawlers. Fixing B-02 resolves it.

---

## G. Performance

**G-01 🟥 ~330 KB of JS for a static site** (184 KB React client + 120 KB framer-motion
+ island chunks) — see D-01. The revamp's JS budget: **< 50 KB total, loaded only on
pages with real interactivity.**

**G-02 🟧 136 KB main CSS bundle** — direct consequence of C-01's monolith; the
primitive/token rebuild should land under 40 KB.

**G-03 🟧 Render-blocking font stylesheet** — C-07.

**G-04 🟨 Hero videos autoplay with no poster-first strategy or `preload` control**
(`ScrollExpandHero.tsx:236-263`: two `<video autoPlay loop>` elements, one blurred
behind the other — double decode). Resolved by B-01; any remaining video gets
`preload="metadata"`, `poster`, and lazy attachment.

**G-05 🟨 No `width`/`height` on several content images** (roster/photo strips) —
reserve space to protect CLS; use `astro:assets` `<Image>` per the repo's own CLAUDE.md.

---

## H. What's genuinely good (do not regress)

- Clean `npm run check`: 0 type errors, 0 lint errors, prettier-clean.
- Central `PageLayout` + `SEO.astro` + `resolveSeo` — correct meta architecture.
- Skip link, landmark structure, `lang`, focus-visible styles, modal focus traps with
  Escape + focus restore, FOUC-safe theme script with proper `aria-pressed` toggle.
- `prefers-reduced-motion` handled in most components (gaps: E-02).
- BrothersExplorer SSR-renders the roster grid — indexable without JS.
- No emoji-as-icons (lucide SVGs), no gradient text, near-zero Tailwind arbitrary
  values — the mess is in hand-written CSS, not utility soup.
- Styleguide pruned from production output and sitemap.
- Typed data layer exists (`ClassMember`, `ChapterEvent`, …) — right instinct, wrong
  location (D-06).

---

## The revamp plan

Sequenced so each phase leaves the site shippable. IDs map to findings above.

### Phase 0 — Stop the bleeding (½ day)
Content integrity fixes that need no redesign:
- Gate every placeholder/editor note behind `import.meta.env.DEV`; hide empty
  testimonial frames and the YearChips filter. **(A-01, A-02, A-03, D-04)**
- Derive all member counts from data; fix the 51/55/66 contradiction. **(A-04)**
- Single `rushStatus` data object; banner hides when dates are TBD. **(A-05)**
- `noindex` on 404, drop generator meta, add `rel="noopener"`. **(F-02, F-03, E-06)**

### Phase 1 — Kill the hijack, free the content (1 day)
- Remove scroll capture, dwell lock, and scroll pinning; hero becomes normal flow with
  a static, descriptive server-rendered `<h1>`. **(B-01, B-06, E-01)**
- Reveal animations: play once, content visible by default, verified by full-page
  screenshot + print preview. **(B-02, F-04)**
- Sticky CTA: no content occlusion; sessionStorage dismissal. **(B-03)**
- Employer marquee: reduced-motion exemption + `aria-hidden` dupes (or delete the
  marquee entirely per C-05). **(E-02, E-03)**

### Phase 2 — One design system (2–3 days)
- Lock brand colors; single token architecture (primitive → semantic); radius/spacing/
  type/elevation/z scales. **(C-02, C-03)**
- Extract primitives; dissolve per-page `<style>` blocks and both theme-override
  forests; both themes via token flip; honor `prefers-color-scheme`. **(C-01, C-04, B-08)**
- Contrast pass on all small/low-opacity text. **(C-14, A-07)**
- Self-host + subset fonts, preload display face. **(C-07, G-03)**
- Rebuild the styleguide from the real system; add the drift check. **(C-06)**

### Phase 3 — De-slop and de-React (1–2 days)
- Delete GlowCard, MagneticButton, NumberTicker, RotatingWord, ScrollExpandHero,
  shimmer/glow effects, aurora keyframes, TestimonialsScroller autoplay; one marquee
  max, CSS-only. **(C-05, B-05, B-07, C-08, C-09)**
- Re-implement the two effects worth keeping (stat count-up, testimonial browse) as
  vanilla scripts; drop framer-motion; React remains only in BrothersExplorer,
  RushSchedule, Lightbox with lazy hydration. **(D-01, D-07, G-01)**
- Fix zoom-scaled filter drawer at real size. **(B-04)**

### Phase 4 — Architecture hygiene (1 day)
- Delete the four dead components + `foundingFathers`; empty content-collections
  scaffold; dead noscript selectors; phantom `calendar.ts` pointer. **(D-02, D-08)**
- Consolidate the filter cluster into `FilterGrid` + `lib/greek.ts` + one delegated
  listener. **(D-03)**
- `PageHero` component; NextPath copy to data; domain types to `src/types`; ISO dates +
  one formatter; npm scripts for generators; pin framework majors. **(D-05, D-06, D-11,
  D-12, D-09, D-10)**

### Phase 5 — Finish line (½ day)
- JSON-LD (Organization, FAQPage, breadcrumbs). **(F-01)**
- Image dimensions/`astro:assets` everywhere; video poster/preload policy. **(G-05, G-04)**
- No-JS mobile nav verification; live-region and dialog-labelling fixes. **(E-04, E-05, E-06)**
- Exit criteria run (below).

### Exit criteria (the "professional developer signs off" bar)
1. Zero placeholder/sample/editor text reachable in a production build (`grep -ri
   "placeholder\|sample\|FOR EDITORS" dist/` returns nothing user-visible).
2. All member/class counts on the site derive from one data source and agree.
3. PageDown, wheel, and touch scroll work normally on every page from first paint.
4. Full-page screenshot and print preview of every route show 100% of content.
5. JS shipped: < 50 KB total; framer-motion absent from the lockfile.
6. One color-token layer; `grep -c 'html:not(.dark)' src/styles/global.css` → 0;
   global.css < 1,000 lines; no page-level `<style>` restyling shared concepts.
7. Lighthouse mobile ≥ 95 across the board **including Performance** on the built site,
   with zero contrast failures.
8. Reduced-motion: no infinite animation runs; smooth-scroll disabled.
9. The styleguide page renders every primitive actually used in production, and only
   those.
10. `npm run check` and `npm run build` stay green.

**Estimated total: 6–8 focused days.**
