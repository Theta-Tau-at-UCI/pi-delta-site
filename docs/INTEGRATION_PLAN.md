# Integration Plan — Merging the live Pi Delta site into this redesign

**Status:** Planning / preparation. Nothing here has been pushed.
**Author:** prepared 2026-06-22.
**Goal:** Bring all real content (roster, headshots, chapter photos, company logos,
videos, copy) from the **currently-live** site into this Astro redesign, then make
this redesign the production site.

---

## 1. TL;DR — the good news

The live site is an old **Create React App + AWS Amplify** project, but **it does not
read from AWS at runtime.** The entire roster is a hardcoded file, and every image is
in a git repo. **No AWS access, DataStore export, or backend credentials are needed** —
everything is portable from two public repos:

| Source repo | What it holds | How we use it |
| --- | --- | --- |
| `Theta-Tau-at-UCI/pi-delta-site` | App code, `brother_info.js` (339 brothers), `src/Media/**` (photos, 24 company logos, 5 videos), all page copy | Roster data + media + copy |
| `Theta-Tau-at-UCI/pi-delta-brothers-images` | 391 headshots in 31 pledge-class folders | Brother portraits |
| `Theta-Tau-at-UCI/pi-delta-xlsx-ripper` | 2020 spreadsheet→data tool | Reference only; not needed |

The redesign's content model already mirrors the live copy (pillars, history, FAQ,
testimonials were transcribed on 2026-06-01), so integration is mostly **data + assets**,
not rewriting text.

---

## 2. The original site, analyzed

- **Stack:** CRA (`react-scripts`) + TypeScript, React 17, React Router 5, Bootstrap/MDB,
  Chart.js + d3, multiple carousels. Hosted on **AWS Amplify** (`amplify/`, `amplify.yml`,
  region us-east-2); earlier on Heroku/gh-pages.
- **Amplify is vestigial.** `src/models/` defines DataStore models (`Class`, `Brother`) and
  `amplify/backend` provisions AppSync + Cognito + S3 — but the Brothers page imports a
  static file (`import { brotherInfo } from "./brother_info"`), not DataStore. **We ignore
  the entire AWS backend.**
- **Pages:** `/` Landing, `/about` About, `/brothers` Brothers, `/recruitment` Recruitment.
- **Roster source of truth:** `src/Pages/Brothers/brother_info.js` — 339 records.
- **All page copy is hardcoded JSX** (mission, 3 pillars, founding history, Ecclesiastes
  motto, Western Region chapter list, 8-item FAQ, 5-event rush schedule, 2 testimonials).
  This already lives in this redesign's `src/data/chapter.ts`; use the original only to
  fill any gaps.

### `brother_info.js` record shape (the important one)
```jsonc
{
  "id": 1.0,
  "name": "Richard Staebler",
  "gender": "M",                 // "M" | "F"
  "class": "Founding",           // pledge class (Greek letter / "X Beta" / "Founding")
  "active_status": "N",          // "Y" active, "N" alumni
  "linkedin_url": "NULL",        // URL or "NULL"
  "major": "Aerospace Engineering",
  "cabby_exec_status": "N",      // "Y" if officer/cabinet
  "cabby_exec_position": "NULL", // role title or "NULL"
  "profile_url": "https://raw.githubusercontent.com/Theta-Tau-at-UCI/pi-delta-brothers-images/main/Founders/richardstaebler.jpg",
  "casual_photo": "NULL",
  "blurb": ""
  // richer records also carry: company, company_logo, experience[], hobbies[],
  // fun_fact, hometown, year, testimonial
}
```
Note the literal string `"NULL"` is used for empty values — the importer must treat
`"NULL"` as absent.

---

## 3. Target model (this redesign) — recap

- `src/data/chapter.ts` is the single content store. Brothers are `Officer[]`
  (`execBoard`, `directors`) + `Active[]` (`actives`), unified as `allActives` /
  `allBrothersWithAlumni` with a `tier: 'exec' | 'officer' | 'active' | 'alumni'`.
- Brother profile fields: `name, major, role?, memberClass?, year?, photo?, interests?,
  experience?, askMeAbout?, favoriteSong?, spotifyTrackId?, currentlyAt?`.
- **Portrait convention:** `/public/images/brothers/<key>.jpg` where
  `key = name.toLowerCase().replace(/[^a-z0-9]/g, '')` (e.g. "Wilson Nguyen" →
  `wilsonnguyen.jpg`). **This is the same convention the brothers-images repo uses**, so
  headshots map 1:1.
- Class history: `memberClasses`, `currentClass`, `memberClassRosters` feed
  `ClassLineage` / `ClassRosters`. Western Region: `regionalChapters` + `colonies`.

---

## 4. Field-by-field mapping (`brother_info.js` → `chapter.ts`)

| Original field | Redesign field | Transform |
| --- | --- | --- |
| `name` | `name` | passthrough |
| `major` | `major` | passthrough |
| `class` | `memberClass` | "Founding" → "Founding Class"; else passthrough |
| `active_status` | `tier` | `"Y"` → exec/officer/active (by position); `"N"` → `alumni` |
| `cabby_exec_position` | `role` | drop `"NULL"`; if present → officer/exec tier |
| `linkedin_url` | `linkedinUrl` *(new field)* | drop `"NULL"` |
| `gender` | `gender` *(new field)* | `"M"`/`"F"` → feeds `genderBreakdown` |
| `profile_url` | `photo` | download → `/images/brothers/<key>.jpg`; or keep remote |
| `company` | `currentlyAt` + employer lists | dedupe into `alumniEmployers`/`internEmployers` |
| `hobbies[]` | `interests[]` | passthrough |
| `experience[]` | `experience[]` | passthrough |
| `fun_fact` | `askMeAbout[]` or `funFact` *(new)* | wrap as a one-item list / new field |
| `hometown` | `hometown` *(new field)* | passthrough |
| `year` | `year` | passthrough |
| `testimonial` | `testimonials[]` | promote non-empty quotes into the testimonials list |

**Tier rule:** `active_status === "Y"` and `cabby_exec_status === "Y"` → match the
`cabby_exec_position` against the exec titles (Regent, Vice-Regent, Marshal, Treasurer,
Scribe, Corresponding Secretary) → `exec`, otherwise `officer`. `active_status === "Y"`
with no position → `active`. `active_status === "N"` → `alumni`.

**Employer marquee payoff:** the redesign's `EmployerMarquee` was just fixed to drop
`"Add employer"` placeholders. The `company` field across 339 brothers is the real data
that replaces them — collect distinct companies of alumni vs. current actives.

---

## 5. Asset migration

| Asset | From | To | Notes |
| --- | --- | --- | --- |
| **Headshots** | `pi-delta-brothers-images/<Class>/<key>.jpg` (391) | `/public/images/brothers/<key>.jpg` | Flatten all class folders; key already matches. Fills the 23 missing active photos + all alumni. Recommend recompressing (sharp, ~q80) — the source repo is 382 MB. |
| **Company logos** | `pi-delta-site/src/Media/companies/` (24) | `/public/logos/<company>.png` | Wire into employer marquee / brother cards. Skip the 1-byte `test` junk file. |
| **Chapter photos** | `src/Media/chapter-photos/{landing,brotherhood,professionalism,service}` | `/public/images/chapter/` + pillar slots | Keep only the *used* originals (see cruft list); recompress (sources are 6–20 MB each). |
| **Pillar photos** | `chapter-photos/{brotherhood,professionalism,service}` | pillar section images | `Pillars.astro` currently has no photo — these can fill it. |
| **Videos** | `src/Media/animations/Spring_Rush_Teaser_Compressed_.mp4`, `src/Media/rush/rush_section2.mp4` | `/public/videos/` | Landing hero (`ScrollExpandHero` accepts `videoSrc`) + recruitment hero. Skip unused teasers/splashscreen. |
| **Brand graphics** | `src/Media/tt-graphics/{ttbadge,tt-wordmark-uci,shield-theta-tau}.png` | `/public/logos/` | Only if the redesign wants raster marks (it currently uses CSS/SVG). |
| **Testimonials** | already ported (`jake-silverman.jpg`, `luke-vargas.jpg`) | — | Add more if desired from `testimonial` fields. |

**OG image:** already generated (`/public/images/og-default.png`). Leave as-is.

---

## 6. Schema gaps — additive fields (prepared in this branch)

To receive the richer original data without losing anything, `BrotherProfile` in
`src/data/chapter.ts` has been extended with optional fields (all backward-compatible):
`linkedinUrl?`, `hometown?`, `funFact?`, `gender?`, `crossingQuarter?`, `crossingYear?`.
These render nowhere until populated, so existing pages are unaffected. The brother detail
card and `BrothersExplorer` can surface LinkedIn + hometown + fun fact in a follow-up.

---

## 7. Redesign components that "wake up" after integration

These exist but aren't wired into a page yet — they are integration *targets*, not dead
code, so **do not delete them**:

- `ClassRosters.astro` — full per-class roster accordion (feeds from `memberClassRosters`,
  which the 339-record import will complete for all 30 classes).
- `FoundersGrid.astro` — 12 founder cards (founding class data is in the import).
- `TestimonialsScroller.tsx` — animated testimonials (more quotes arrive via `testimonial`).
- `RegionalChapters.astro` — already wired; verify the Western Region list matches.

`BrothersFloat`, `ClassChips`, `RevealImageList` are genuinely unused experiments — decide
per-component during integration, after the roster lands.

---

## 8. Recommended migration sequence

1. **Clone the two source repos** locally (read-only):
   `gh repo clone Theta-Tau-at-UCI/pi-delta-site`
   `gh repo clone Theta-Tau-at-UCI/pi-delta-brothers-images`
2. **Run the roster importer** (`scripts/migrate-roster.mjs`, see §9) in `--report` mode to
   see coverage: how many of the 339 have headshots, LinkedIn, company, class.
3. **Generate the roster draft** (`--emit`) → review, then merge into `chapter.ts`
   (officers/actives/alumni + completed `memberClassRosters`).
4. **Copy + recompress headshots** into `/public/images/brothers/` (only the keys the
   roster references, to avoid carrying 391 full-size images).
5. **Copy + recompress** the used chapter photos, pillar photos, and 24 company logos.
6. **Copy the 2 videos** into `/public/videos/` and wire `ScrollExpandHero` + recruitment.
7. **Derive employer lists** from `company` fields → replace the marquee placeholders.
8. **Reconcile rush schedule** (add `time`/`location`), and any copy gaps vs. the original.
9. `npm run check && npm run build`, eyeball every page, then commit.

---

## 9. Tooling: `scripts/migrate-roster.mjs`

A read-only helper has been added. Point it at the cloned original; it does **not** write
into the repo by default:

```bash
node scripts/migrate-roster.mjs --src /path/to/pi-delta-site --images /path/to/pi-delta-brothers-images --report
node scripts/migrate-roster.mjs --src ... --images ... --emit > /tmp/roster.draft.ts
```
- `--report` prints coverage stats (headshot match %, LinkedIn count, distinct companies,
  per-class counts, names whose headshot is missing).
- `--emit` prints a draft TypeScript roster mapped to the redesign's model for review.

It never mutates `chapter.ts` or copies images — image copy/recompression is a deliberate,
reviewed step (see §8).

---

## 10. What NOT to bring over

- The entire **AWS Amplify backend** (`amplify/`, `src/models/`) — unused at runtime.
- **Cruft:** root `fall_rush_2025.JPG` (9 MB stray), `debug.log`, `.idea/`, `.vscode/`,
  `src/Media/companies/test` (1-byte), and the many unused duplicate photos/videos
  (`rush_teaser.mp4`, `splashscreen.mp4`, `jakeHeadshot.png` variants, `spring25_hbs.jpg`,
  `winter_photoshoot_2020.jpg`, etc.).
- The original's **CRA/Bootstrap/MDB/d3/carousel dependencies** — the redesign reimplements
  all of this; bring no `package.json` deps across.
- `.git` histories of the source repos.

---

## 11. Personal-data & consent

The roster, headshots, and testimonials are **already published on the public chapter
site**, and `chapter.ts` documents the user's explicit confirmation to include them. The
391-image and 339-record sets are larger (includes alumni). Before committing alumni
photos/PII that aren't currently on the public redesign, confirm scope — the per-record
`linkedin_url` especially. Keep `.gitignore`'s personal-data staging rules intact.

---

## 12. Open questions for the owner

1. **Headshots:** copy locally (repo grows, but optimizable + no external dependency) or
   keep referencing the raw GitHub URLs (zero bloat, external dependency)? Recommended:
   copy + recompress the actives; alumni can stay remote initially.
2. **Alumni scope:** import all 339 (incl. alumni) into the Brothers explorer, or actives
   only for now?
3. **Repo combination:** this redesign becomes the new site and content is ported *into*
   it (recommended — clean history), vs. a git merge of the two unrelated histories
   (messy). Confirm before any remote/branch surgery.
