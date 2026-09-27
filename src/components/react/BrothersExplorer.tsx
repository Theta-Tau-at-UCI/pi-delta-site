// BrothersExplorer, a card grid of every active (filterable by tier / major /
// search). Clicking a card opens a fullscreen detail view with the selected
// brother centered and the previous/next brothers shown as faded peek cards
// on either side. Click a peek card (or use arrow keys) to navigate. SSR
// renders the grid so it works (and is indexable) without JS.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { BrothersFilterBar, applyBrotherFilters, type BrotherFilter } from './BrothersFilters';
import GlowCard from './GlowCard';
import SpotifyTrackStrip from './SpotifyTrackStrip';

// Inline LinkedIn glyph (lucide-react v1 doesn't ship a brand icon).
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.73v20.54C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .78 23.2 0 22.22 0z" />
    </svg>
  );
}

export interface Brother {
  name: string;
  role?: string;
  major: string;
  tier: 'exec' | 'officer' | 'active' | 'alumni';
  // Optional profile fields surfaced in the detail card.
  memberClass?: string;
  year?: string;
  photo?: string;
  favoriteSong?: string;
  spotifyTrackId?: string;
  /** A short fun fact, shown as its own section in the detail card. */
  funFact?: string;
  interests?: string[];
  experience?: string[];
  askMeAbout?: string[];
  /** Company the brother is currently working or interning at. Surfaced as
   *  a frosted slide-up overlay on the card on hover/focus. */
  currentlyAt?: string;
  /** LinkedIn profile URL, rendered as a pressable icon on the card + detail. */
  linkedinUrl?: string;
  /** Other socials, Instagram/GitHub as bare handles, website as a full URL. */
  instagram?: string;
  github?: string;
  website?: string;
}

const tierLabel: Record<Brother['tier'], string> = {
  exec: 'Executive Board',
  officer: 'Cabinet',
  active: 'General member',
  alumni: 'Alumni',
};

// Map a UCI major string to the school that houses it. Used as a fallback
// for the card's "Currently at" overlay until the chapter populates real
// currentlyAt (company) values per brother. Most engineering degrees live
// in Samueli; pure-CS / Data Science / Software Engineering / CSE sit
// under the Donald Bren School of ICS.
function schoolFor(major: string): string {
  if (/computer science|data science|software engineering/i.test(major)) {
    return 'Donald Bren School of ICS';
  }
  return 'Samueli School of Engineering';
}

// Stable identity for a brother row. Names are NOT unique in the dataset
// (two alumni share the name "Kevin Huynh" in different classes/majors), so
// keying or selecting by name alone collapses them into one card and opens
// the wrong detail panel. Class + major disambiguates them.
function brotherKey(b: Brother): string {
  return `${b.name}|${b.memberClass ?? ''}|${b.major}`;
}

// LinkedIn values come from a generated data file and are not uniformly
// formed: some are schemeless ("linkedin.com/in/…", which the browser
// resolves against /brothers/ and 404s) and some are plaintext http://.
// Normalize at render so the href is always an absolute https URL.
function linkedinHref(raw: string): string {
  const url = /^https?:\/\//i.test(raw) ? raw.replace(/^http:\/\//i, 'https://') : `https://${raw}`;
  return url.replace(/^https:\/\/(www\.)?linkedin\.com/i, 'https://www.linkedin.com');
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// Transparent company logos parsed out of the chapter's slide decks, stored as
// /images/logos/<slug>.png. Preferred over the older opaque set below.
const TRANSPARENT_LOGOS = new Set([
  'adobe',
  'aecom',
  'abbvie',
  'allstate',
  'amazon',
  'anduril',
  'apple',
  'appliedmedical',
  'beyondlimits',
  'blueorigin',
  'boeing',
  'caltrans',
  'capitalone',
  'dictumhealth',
  'disney',
  'ducommun',
  'edwards',
  'edyza',
  'errg',
  'ford',
  'fuscoe',
  'generalatomics',
  'gknaerospace',
  'glaukos',
  'google',
  'homedepot',
  'hp',
  'hyundai',
  'ibm',
  'inari',
  'intel',
  'johnsonandjohnson',
  'jpl',
  'jpmorgan',
  'jpmorganchase',
  'kaiserpermanente',
  'kia',
  'l3harris',
  'langan',
  'ladwp',
  'linkedin',
  'lockheedmartin',
  'masimo',
  'medtronic',
  'mercedes',
  'meta',
  'microsoft',
  'nasa',
  'navwar',
  'nextsemiconductor',
  'nike',
  'northropgrumman',
  'nvidia',
  'orbee',
  'pacificscientific',
  'playstation',
  'qualcomm',
  'railpros',
  'raytheon',
  'reddit',
  'rivian',
  'roche',
  'salesforce',
  'sendgrid',
  'siemens',
  'skyworks',
  'socalgas',
  'spacex',
  'syntiant',
  'tesla',
  'tower',
  'turionspace',
  'twilio',
  'tyco',
  'unisys',
  'viasat',
  'walmart',
  'workday',
]);

// Slug spellings that don't land directly on a file name.
const LOGO_ALIASES: Record<string, string> = {
  jj: 'johnsonandjohnson',
  johnsonjohnson: 'johnsonandjohnson',
  jpmorganchaseco: 'jpmorganchase',
  jpmorganchasebank: 'jpmorganchase',
  towersemiconductor: 'tower',
  jetpropulsionlaboratory: 'jpl',
  nasajpl: 'jpl',
  homedepotthe: 'homedepot',
};

// Older opaque logos kept as a fallback for companies with no transparent art.
const LEGACY_LOGOS: Record<string, string> = {
  morganstanley: 'morgan-stanley.png',
  optum: 'optum.png',
  kiewit: 'kiewit.png',
  tevora: 'tevora.png',
  fabric8labs: 'fabric8labs.png',
  carl: 'carl.png',
  daplab: 'daplab.png',
  legacyrobotics: 'legacy-robotics.png',
  anteaterformularacing: 'afr.png',
  ucirocketprojectsolids: 'uci-rockets.jpeg',
  zotbins: 'zotbins.png',
  skyryse: 'skyryse.png',
  terumoneuro: 'terumo-neuro-logo.png',
};

/**
 * Resolve a brother's `currentlyAt` string to a logo. Values are free-form
 * ("R&D Co-Op at Johnson & Johnson", "Qualcomm & SpaceX"), so after an exact
 * match we fall back to finding the longest known company name inside it.
 */
function companyLogo(name?: string): string | undefined {
  if (!name) return undefined;
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!slug) return undefined;

  const aliased = LOGO_ALIASES[slug] ?? slug;
  if (TRANSPARENT_LOGOS.has(aliased)) return `/images/logos/${aliased}.png`;
  if (LEGACY_LOGOS[aliased]) return `/logos/${LEGACY_LOGOS[aliased]}`;

  // Substring match, longest first so "qualcommspacex" prefers "qualcomm".
  let best: string | undefined;
  for (const candidate of TRANSPARENT_LOGOS) {
    if (candidate.length >= 4 && slug.includes(candidate)) {
      if (!best || candidate.length > best.length) best = candidate;
    }
  }
  if (best) return `/images/logos/${best}.png`;

  for (const [candidate, file] of Object.entries(LEGACY_LOGOS)) {
    if (candidate.length >= 4 && slug.includes(candidate)) return `/logos/${file}`;
  }
  return undefined;
}

function BrotherDetail({
  brothers,
  index,
  onClose,
  onNavigate,
}: {
  brothers: Brother[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}) {
  const total = brothers.length;
  const brother = brothers[index];
  const prev = index > 0 ? (brothers[index - 1] ?? null) : null;
  const next = index < total - 1 ? (brothers[index + 1] ?? null) : null;
  // Tracks last navigation direction so the new card animates in from the
  // correct side. Starts at "right" so the initial open mounts cleanly.
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const goPrev = useCallback(() => {
    if (prev) {
      setDirection('left');
      onNavigate(index - 1);
    }
  }, [prev, index, onNavigate]);
  const goNext = useCallback(() => {
    if (next) {
      setDirection('right');
      onNavigate(index + 1);
    }
  }, [next, index, onNavigate]);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Scroll lock + focus handoff. Deliberately runs once per open: it must NOT
  // depend on the key handlers below, or navigating with the arrow keys tears
  // it down mid-modal and the cleanup throws focus back to the card behind
  // the dialog (which also scrolls that card into view).
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Pause global Lenis smooth-scroll while the modal is open, otherwise the
    // page keeps scrolling behind it (Lenis scrolls the window, not body).
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();
    // Remember the element that triggered the open and restore focus on close.
    triggerRef.current = document.activeElement as HTMLElement | null;
    // Move focus into the dialog so SR/keyboard users start inside the modal.
    requestAnimationFrame(() => closeBtnRef.current?.focus());
    return () => {
      document.body.style.overflow = prevOverflow;
      lenis?.start();
      triggerRef.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // The brother portrait is itself a lightbox trigger, so a lightbox can
      // sit on top of this dialog. Only the topmost dialog handles keys,
      // otherwise one Escape dismisses both and arrows desync them.
      if (document.querySelector('.lightbox')) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      // Focus trap, keep Tab cycling inside the dialog.
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea, iframe',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, goPrev, goNext]);

  if (!brother) return null;

  return (
    <div
      ref={dialogRef}
      className="brother-detail"
      role="dialog"
      aria-modal="true"
      aria-label={`${brother.name} details`}
    >
      {/* Decorative backdrop, clicking dismisses, but it's not a real button
          in the a11y tree (the visible X already covers that affordance). */}
      <div
        className="brother-detail__backdrop"
        aria-hidden="true"
        onClick={onClose}
        role="presentation"
      />

      <button
        ref={closeBtnRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="brother-detail__close focus-visible:outline-accent-400 focus-visible:outline-2"
      >
        <X className="size-5" />
      </button>

      {/* Favorite-track strip, pinned to the top of the modal. Renders via
          the Spotify Embed Iframe API so we can call play() in the callback
          and have the track auto-start with the brother card's click as the
          gesture (raw iframe URL params don't reliably autoplay). */}
      {brother.spotifyTrackId && (
        <SpotifyTrackStrip name={brother.name} trackId={brother.spotifyTrackId} />
      )}

      <div className="brother-detail__stage" key={index} data-enter={direction}>
        {/* Previous peek card, faded, clickable, with pointer-tracking glow. */}
        {prev ? (
          <GlowCard className="brother-detail__peek-glow">
            <button
              type="button"
              onClick={goPrev}
              aria-label={`Previous: ${prev.name}`}
              className="brother-detail__peek brother-detail__peek--prev focus-visible:outline-accent-400 focus-visible:outline-2"
            >
              <span className="brother-detail__peek-arrow" aria-hidden="true">
                <ChevronLeft className="size-5" />
              </span>
              <span className="brother-detail__peek-inner">
                <span className="brother-detail__peek-avatar" aria-hidden="true">
                  <span className="font-display">{initials(prev.name)}</span>
                </span>
                <span className="brother-detail__peek-eyebrow">{tierLabel[prev.tier]}</span>
                <span className="font-display brother-detail__peek-name">{prev.name}</span>
                <span className="brother-detail__peek-major">{prev.major}</span>
              </span>
            </button>
          </GlowCard>
        ) : (
          <span
            className="brother-detail__peek brother-detail__peek--placeholder"
            aria-hidden="true"
          />
        )}

        {/* Center brother card, wrapped in GlowCard so the warm spotlight
            tracks the pointer over the selected brother. */}
        <GlowCard className="brother-detail__card-glow">
          <article className="brother-detail__card">
            <header className="brother-detail__card-header">
              {brother.photo ? (
                <button
                  type="button"
                  className="brother-detail__portrait brother-detail__portrait--clickable"
                  aria-label={`Enlarge ${brother.name}'s portrait`}
                  data-lightbox={brother.photo}
                  data-lightbox-alt={`${brother.name}, chapter portrait`}
                  data-lightbox-caption={`${brother.name} · ${tierLabel[brother.tier]}`}
                >
                  <img src={brother.photo} alt="" className="brother-detail__portrait-img" />
                </button>
              ) : (
                <figure className="brother-detail__portrait" aria-hidden="true">
                  <span className="font-display brother-detail__portrait-initials">
                    {initials(brother.name)}
                  </span>
                  <span className="brother-detail__portrait-hint">Portrait</span>
                </figure>
              )}
              <div className="brother-detail__intro">
                <p className="brother-detail__eyebrow">{tierLabel[brother.tier]}</p>
                <h2 className="font-display brother-detail__name">{brother.name}</h2>
                {brother.role && <p className="brother-detail__role">{brother.role}</p>}
                {(brother.linkedinUrl ||
                  brother.instagram ||
                  brother.github ||
                  brother.website) && (
                  <div className="brother-detail__socials">
                    {brother.linkedinUrl && (
                      <a
                        className="brother-detail__linkedin"
                        href={linkedinHref(brother.linkedinUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkedInIcon className="size-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {brother.instagram && (
                      <a
                        className="brother-detail__linkedin"
                        href={`https://instagram.com/${brother.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>Instagram</span>
                      </a>
                    )}
                    {brother.github && (
                      <a
                        className="brother-detail__linkedin"
                        href={`https://github.com/${brother.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>GitHub</span>
                      </a>
                    )}
                    {brother.website && (
                      <a
                        className="brother-detail__linkedin"
                        href={brother.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Quick facts strip, fills the whitespace next to the
                    portrait with the brother's stat line at a glance. */}
                <dl className="brother-detail__quick-facts">
                  <div className="brother-detail__quick-fact">
                    <dt>Major</dt>
                    <dd>{brother.major}</dd>
                  </div>
                  <div className="brother-detail__quick-fact">
                    <dt>Class</dt>
                    <dd>{brother.memberClass ?? 'Not listed yet'}</dd>
                  </div>
                  {brother.year && (
                    <div className="brother-detail__quick-fact">
                      <dt>Year</dt>
                      <dd>{brother.year}</dd>
                    </div>
                  )}
                  <div className="brother-detail__quick-fact brother-detail__quick-fact--wide">
                    <dt>{brother.currentlyAt ? 'Currently at' : 'School'}</dt>
                    <dd>{brother.currentlyAt ?? schoolFor(brother.major)}</dd>
                  </div>
                </dl>
              </div>
            </header>

            <div className="brother-detail__scroll">
              <section className="brother-detail__section">
                <h3 className="brother-detail__section-title">Interests</h3>
                {brother.interests && brother.interests.length > 0 ? (
                  <ul className="brother-detail__tag-list">
                    {brother.interests.map((it) => (
                      <li key={it} className="brother-detail__tag">
                        {it}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="brother-detail__empty">Not listed yet.</p>
                )}
              </section>

              <section className="brother-detail__section">
                <h3 className="brother-detail__section-title">Experience</h3>
                {brother.experience && brother.experience.length > 0 ? (
                  <ul className="brother-detail__list">
                    {brother.experience.map((ex) => (
                      <li key={ex}>{ex}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="brother-detail__empty">Not listed yet.</p>
                )}
              </section>

              <section className="brother-detail__section">
                <h3 className="brother-detail__section-title">Ask me about</h3>
                {brother.askMeAbout && brother.askMeAbout.length > 0 ? (
                  <ul className="brother-detail__tag-list">
                    {brother.askMeAbout.map((a) => (
                      <li key={a} className="brother-detail__tag brother-detail__tag--accent">
                        {a}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="brother-detail__empty">Not listed yet.</p>
                )}
              </section>

              {brother.funFact && (
                <section className="brother-detail__section">
                  <h3 className="brother-detail__section-title">Fun fact</h3>
                  <p className="brother-detail__prose">{brother.funFact}</p>
                </section>
              )}

              {brother.favoriteSong && (
                <section className="brother-detail__section">
                  <h3 className="brother-detail__section-title">Favorite song</h3>
                  <p className="brother-detail__prose">{brother.favoriteSong}</p>
                </section>
              )}
            </div>

            <footer className="brother-detail__footer">
              <span className="brother-detail__position">
                {index + 1} of {total} in the roster
              </span>
              <span className="brother-detail__nav-hint">← → to navigate</span>
            </footer>
          </article>
        </GlowCard>

        {/* Next peek card, faded, clickable, with pointer-tracking glow. */}
        {next ? (
          <GlowCard className="brother-detail__peek-glow">
            <button
              type="button"
              onClick={goNext}
              aria-label={`Next: ${next.name}`}
              className="brother-detail__peek brother-detail__peek--next focus-visible:outline-accent-400 focus-visible:outline-2"
            >
              <span className="brother-detail__peek-inner">
                <span className="brother-detail__peek-avatar" aria-hidden="true">
                  <span className="font-display">{initials(next.name)}</span>
                </span>
                <span className="brother-detail__peek-eyebrow">{tierLabel[next.tier]}</span>
                <span className="font-display brother-detail__peek-name">{next.name}</span>
                <span className="brother-detail__peek-major">{next.major}</span>
              </span>
              <span className="brother-detail__peek-arrow" aria-hidden="true">
                <ChevronRight className="size-5" />
              </span>
            </button>
          </GlowCard>
        ) : (
          <span
            className="brother-detail__peek brother-detail__peek--placeholder"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

export default function BrothersExplorer({ brothers }: { brothers: Brother[] }) {
  const [filters, setFilters] = useState<BrotherFilter[]>([]);
  const [q, setQ] = useState('');
  // Track the selected brother by IDENTITY (see brotherKey), not by index.
  // Filter changes shift the `filtered` array; using an index causes the
  // modal to silently jump to a different brother (or vanish). Names alone
  // aren't unique, so the key folds in class + major.
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Filter option pools derive from whichever brothers have those fields set.
  const filterOptions = useMemo(
    () => ({
      majors: [...new Set(brothers.map((b) => b.major))].sort(),
      years: [
        ...new Set(brothers.map((b) => b.year).filter((y): y is string => Boolean(y))),
      ].sort(),
      memberClasses: [
        ...new Set(brothers.map((b) => b.memberClass).filter((c): c is string => Boolean(c))),
      ].sort(),
    }),
    [brothers],
  );

  // Brothers matching the current category filters but BEFORE search. This
  // is what we hand back to the filter-tile components so their counts can
  // narrow as the user composes filters (e.g. a Major tile shows how many
  // CS brothers are also officers once you've added a Tier=Officer filter).
  const byCategories = useMemo(() => {
    const hasClassFilter = filters.some((f) => f.type === 'memberClass' && f.values.length > 0);
    const hasAlumniTierFilter = filters.some(
      (f) => f.type === 'tier' && f.values.includes('alumni'),
    );
    const allowAlumni = hasClassFilter || hasAlumniTierFilter;
    const visible = allowAlumni ? brothers : brothers.filter((b) => b.tier !== 'alumni');
    return applyBrotherFilters(visible, filters);
  }, [brothers, filters]);

  // Broadcast the narrowed roster so the filter tiles (TierBands,
  // MajorMosaic, ClassLineage, YearChips) outside this island can refresh
  // their counts to reflect the current filter composition.
  useEffect(() => {
    document.dispatchEvent(
      new CustomEvent('brothers:filtered', { detail: { brothers: byCategories } }),
    );
  }, [byCategories]);

  // Broadcast the ACTIVE filter values (type → values) so the visual tiles
  // outside this island can highlight which of them are currently selected,
  // essential now that multiple tiles compose and the drawer stays open.
  useEffect(() => {
    const active = filters.map((f) => ({ type: f.type, values: f.values }));
    document.dispatchEvent(new CustomEvent('brothers:active-filters', { detail: { active } }));
  }, [filters]);

  const filtered = useMemo(() => {
    // Hide alumni by default, they only appear when the user explicitly
    // narrows by class OR includes alumni in a tier filter (or types
    // their name into search). This keeps the default roster focused on
    // current brothers for rushees while still making the full historical
    // dataset reachable a click away from the filter drawer.
    const hasClassFilter = filters.some((f) => f.type === 'memberClass' && f.values.length > 0);
    const hasAlumniTierFilter = filters.some(
      (f) => f.type === 'tier' && f.values.includes('alumni'),
    );
    const allowAlumni = hasClassFilter || hasAlumniTierFilter || q.trim().length > 0;
    const visible = allowAlumni ? brothers : brothers.filter((b) => b.tier !== 'alumni');
    const byFilters = applyBrotherFilters(visible, filters);
    if (!q.trim()) return byFilters;
    const needle = q.toLowerCase();
    return byFilters.filter((b) => `${b.name} ${b.major}`.toLowerCase().includes(needle));
  }, [brothers, filters, q]);

  // Stable handlers, so the detail modal's keydown effect doesn't tear down
  // and re-run on every parent render.
  const closeDetail = useCallback(() => setSelectedKey(null), []);
  const navigateDetail = useCallback(
    (i: number) => {
      const next = filtered[i];
      if (next) setSelectedKey(brotherKey(next));
    },
    [filtered],
  );

  // Listen for clicks on visual filter tiles (class lineage, major
  // mosaic, tier bands) that live OUTSIDE this React island. Each tile
  // dispatches a `brothers:filter` CustomEvent with the filter type and
  // value. Clicking TOGGLES that value into the filter of its type, so
  // multiple tiles compose: picking Mechanical then CS shows brothers in
  // either major (union within a category), and picking two classes shows
  // both. Clicking an already-active value removes it. The drawer stays
  // open so the user can keep composing selections.
  useEffect(() => {
    type FilterDetail = {
      type: BrotherFilter['type'];
      value: string;
    };
    const onSet = (e: Event) => {
      const detail = (e as CustomEvent<FilterDetail>).detail;
      if (!detail || !detail.type || !detail.value) return;
      setFilters((prev) => {
        const existing = prev.find((f) => f.type === detail.type);
        // No filter of this type yet → start one with the clicked value.
        if (!existing) {
          const next: BrotherFilter = {
            id: `${detail.type}-${Date.now()}`,
            type: detail.type,
            operator: 'is',
            values: [detail.value],
          };
          return [...prev, next];
        }
        // Toggle the value within the existing same-type filter.
        const has = existing.values.includes(detail.value);
        const values = has
          ? existing.values.filter((v) => v !== detail.value)
          : [...existing.values, detail.value];
        // Removed the last value → drop the filter entirely.
        if (values.length === 0) {
          return prev.filter((f) => f.id !== existing.id);
        }
        // Keep the operator sensible: "is not" is preserved; otherwise a
        // multi-value selection reads as "is any of", a single one as "is".
        const operator: BrotherFilter['operator'] =
          existing.operator === 'is not' ? 'is not' : values.length > 1 ? 'is any of' : 'is';
        return prev.map((f) => (f.id === existing.id ? { ...f, values, operator } : f));
      });
    };
    document.addEventListener('brothers:filter', onSet);
    return () => document.removeEventListener('brothers:filter', onSet);
  }, []);

  return (
    <div id="roster-results">
      {/* Search + filter pills row. */}
      <div className="mb-6 flex flex-col gap-3">
        <label className="brothers-search">
          <span className="sr-only">Search brothers</span>
          <span className="brothers-search__icon" aria-hidden="true">
            <Search className="size-4" />
          </span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or major…"
            className="brothers-search__input font-display"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              className="brothers-search__clear"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </label>
        <BrothersFilterBar
          filters={filters}
          setFilters={setFilters}
          options={filterOptions}
          hideAddFilter
        />
        <p
          className="text-brand-700/80 dark:text-brand-100/70 text-sm"
          role="status"
          aria-live="polite"
        >
          Showing <strong>{filtered.length}</strong> of {brothers.length} brothers
        </p>
      </div>

      {/* Card grid, vertical-rectangle cards with the portrait on top and the
          brother's info below. 3 per row on lg, 2 from 420px up, 1 on the
          narrowest phones (two columns there leave ~100px of text, which
          truncates most names and nearly every major).
          Each card is wrapped in GlowCard so the pointer spotlight tracks it. */}
      <ul className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10">
        {filtered.map((b) => (
          <li key={brotherKey(b)} className="brother-card-wrap">
            <GlowCard className="brother-card-glow">
              <button
                type="button"
                onClick={() => setSelectedKey(brotherKey(b))}
                aria-haspopup="dialog"
                className="brother-card dark:bg-brand-800/40 focus-visible:outline-accent-400 flex w-full flex-col gap-3 overflow-hidden rounded-2xl border border-(--color-border) bg-white p-3 text-left shadow-sm focus-visible:outline-2 sm:p-4 dark:shadow-none"
              >
                <span className="brother-card__portrait" aria-hidden="true">
                  {b.photo ? (
                    <img
                      src={b.photo}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="brother-card__portrait-img"
                    />
                  ) : (
                    <span className="brother-card__portrait-initials font-display">
                      {initials(b.name)}
                    </span>
                  )}
                  {(() => {
                    const logo = companyLogo(b.currentlyAt);
                    // With a real company logo, hovering fills the card with the
                    // logo over the portrait (translucent backdrop, no caption).
                    if (logo) {
                      return (
                        <span className="brother-card__company brother-card__company--logo">
                          <img
                            src={logo}
                            alt={`${b.currentlyAt} logo`}
                            loading="lazy"
                            className="brother-card__company-cover"
                          />
                        </span>
                      );
                    }
                    // Text fallback. Alumni graduated, never say "studying";
                    // show where they work, else their class / alumni status.
                    const isAlumni = b.tier === 'alumni';
                    let eyebrow: string;
                    let value: string;
                    if (b.currentlyAt) {
                      eyebrow = isAlumni ? 'Works at' : 'Currently at';
                      value = b.currentlyAt;
                    } else if (isAlumni) {
                      eyebrow = 'Alumni';
                      value = b.memberClass ? `${b.memberClass} Class` : 'Theta Tau alumni';
                    } else {
                      eyebrow = 'Studying at';
                      value = schoolFor(b.major);
                    }
                    return (
                      <span className="brother-card__company">
                        <span className="brother-card__company-eyebrow">{eyebrow}</span>
                        <span className="font-display brother-card__company-name">{value}</span>
                      </span>
                    );
                  })()}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-display text-brand-900 block truncate text-base font-semibold sm:text-lg dark:text-white">
                    {b.name}
                  </span>
                  <span className="text-brand-700/80 dark:text-brand-100/70 mt-1 block text-sm">
                    {b.major}
                  </span>
                  {b.role && (
                    <span className="bg-accent-500/15 dark:text-accent-400 mt-2 inline-block self-start rounded-full px-2 py-0.5 text-[11px] font-semibold text-(--color-gold)">
                      {b.role}
                    </span>
                  )}
                  <span className="text-brand-700 dark:text-brand-100/75 mt-2 inline-block text-[10px] tracking-wide uppercase">
                    {tierLabel[b.tier]}
                  </span>
                </span>
              </button>
            </GlowCard>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <div className="mt-6 flex flex-col items-start gap-3" role="status">
          <p className="dark:text-brand-100/70 text-sm text-(--color-text-muted)">
            No brothers match those filters.
          </p>
          {(filters.length > 0 || q.length > 0) && (
            <button
              type="button"
              onClick={() => {
                setFilters([]);
                setQ('');
              }}
              className="text-accent-600 dark:text-accent-400 text-sm font-semibold underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {(() => {
        if (selectedKey === null) return null;
        // Resolve identity to a live position in the current filtered list.
        // If filters narrowed the selected brother out, close the modal.
        const liveIndex = filtered.findIndex((b) => brotherKey(b) === selectedKey);
        if (liveIndex === -1) {
          // Best-effort: close on next tick to avoid setState during render.
          queueMicrotask(() => setSelectedKey(null));
          return null;
        }
        return (
          <BrotherDetail
            brothers={filtered}
            index={liveIndex}
            onClose={closeDetail}
            onNavigate={navigateDetail}
          />
        );
      })()}
    </div>
  );
}
