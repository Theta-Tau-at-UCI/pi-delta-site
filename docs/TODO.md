# TODO / Project state

Living checklist for the Theta Tau · Pi Delta Chapter site. Update as work
progresses.

## Current state (one-line summary)

Seven Astro pages with distinct custom heroes, a filterable roster of every
active brother across every pledge class, rush schedule with per-event
modal, dual interactive demographics donuts, vintage About hero with
founders modal, and a 404 page with chapter-themed copy. Build is green.

## Shipped recently

- **Pages** — Home, Brothers, Events, Projects, Recruitment, About, 404
- **Custom heroes** — every inner page has its own visual treatment:
  - Home: `ScrollExpandHero` (scroll-driven video expand)
  - Brothers: constellation network + "Active brothers / 66" stat block
  - Events: animated calendar grid + floating date stamps
  - Projects: blueprint paper grid + corner title-block stamp
  - Recruitment: open gold archway + "Fall '25" wax-stamp badge
  - About: vintage "Pi Delta · UC Irvine / Est. 2013" seal + paper texture
- **Brothers explorer** — filter by tier/major/class/year via a collapsible
  drawer above the roster. `PledgeLineage`, `TierBands`, `MajorMosaic`,
  `ClassChips`, `YearChips` all dispatch the shared `brothers:filter`
  CustomEvent the React island listens for. Search bar with leading icon
  + clear button. Per-brother card has a hover-reveal frosted strip showing
  the company (or a fallback to the UCI school).
- **Rush schedule** — `RushSchedule` React island; per-event modal pops out
  with a big calendar-day chip, status / dress pills, time + location
  strip, description, and prev/next chip navigator.
- **Demographics** — interactive `MajorsDonut` with hover/click slice
  highlighting, cross-linked legend, and center label that updates with
  the focused datum. Reused for the gender breakdown.
- **Bento About** — lede + photo + five count-up stat tiles (founded,
  installed, members and alumni, active brothers, pledge classes, majors
  represented) + dual donut chart tile.
- **Founders modal** — twelve clickable cards on About, each opens a
  native `<dialog>` with a placeholder bio pointing to where chapter-
  provided bios should land.
- **Lightbox** — global photo popout listening for `[data-lightbox]`;
  `ImagePlaceholder` wraps real images in a trigger so every page photo
  is enlarge-on-click. Optional `gallery` prop chains tiles into a
  navigable set.
- **Stream-in stagger** — stronger reveal variant (`data-stream-in`)
  used for FAQ + rush timeline.

## Data layer

See `src/data/`:

- `chapter.ts` — roster (current + historical), pledge class rosters,
  pillars, testimonials, employers, rush schedule, FAQ, regional
  chapters, founding fathers, gender breakdown.
- `events.ts` — chapter event archive (categories + entries + upcoming).
  Currently seeded with one labeled placeholder per category.
- `projects.ts` — current featured project + past projects array.
  Currently one labeled placeholder.
- `site.ts` — nav + footer + SEO config.

## Blocked on chapter content

These items are wired up and rendering placeholders; replace the data and
they populate automatically:

- [ ] Real photos (drop files under `/public/` and set `src` on the
      relevant `ImagePlaceholder`)
- [ ] Real events in `src/data/events.ts` (replace the labeled sample
      entries)
- [ ] Real projects in `src/data/projects.ts` (replace the current and
      past placeholders)
- [ ] `currentlyAt` per brother in `src/data/chapter.ts` — currently
      falls back to the UCI school by major
- [ ] Founder bios — add a `foundingFatherBios` map keyed by name so
      the founders modal shows real content
- [ ] Real Spotify track IDs per brother (`spotifyTrackId`) so the
      brother detail card embeds the player

## Optional next features

- Cmd-K site-wide search (needs content indexing + shadcn `Command` modal)
- Spotify chapter playlist embed (could aggregate from the per-brother
  songs once data lands)
- Sponsors / supporters page (needs sponsor data)
- Rushee dashboard (`/welcome?email=…` after the interest form)
- OS-sync dark/light mode toggle option
- Calendar ICS feed integration for upcoming events

## Engineering hygiene

- Run `npm run check` (typecheck + lint + prettier) and `npm run build`
  before committing.
- Honor `prefers-reduced-motion` on every new animation.
- Don't invent organization-specific content. Add labeled placeholders
  in `src/data/*` and update this file under "Blocked on chapter content."
