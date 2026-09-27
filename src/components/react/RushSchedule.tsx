// RushSchedule, renders the rush week timeline plus a per-event modal.
//
// Visually: the timeline rows look like the previous Astro version (compact
// thumbnail + date badge + dress + status + title + description) so the
// section reads the same at a glance. Functionally: each row is now a
// button, clicking opens a modal that pops the event out at full size.
//
// The modal layout is deliberately different from BrotherDetail:
//   - Brothers detail = portrait + bio, with left/right peek cards.
//   - Rush detail    = horizontal layout with a big calendar-day chip on
//                      the left, event title + status pills + time/location
//                      strip on the right, description below, and a
//                      prev/next chip strip at the bottom (not side peeks).
//   - A "Day N of total" stepper sits at the top so the user always knows
//                      where they are in the rush week.
import { useCallback, useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Clock, ShirtIcon, CalendarPlus } from 'lucide-react';
import { googleCalendarUrlForEvent, icsForRushWeek } from '@lib/calendar';

export interface RushEvent {
  date: string;
  name: string;
  dress: string;
  description: string;
  inviteOnly?: boolean;
  time?: string; // human-readable, e.g. "7–9 PM"
  location?: string;
  // Machine-readable 24h "HH:MM" (local). When BOTH are present, the per-event
  // "Add to Google Calendar" link produces a timed event; otherwise all-day.
  startTime?: string;
  endTime?: string;
}

interface Props {
  events: RushEvent[];
  // Calendar year the "M/D" dates fall in, supplied by the page from
  // `rushYear` so the "Add to Google Calendar" links have a full date.
  year: number;
}

/* -------------------------------------------------------------------------- */
/*                              Helper functions                              */
/* -------------------------------------------------------------------------- */

// Parse "9/29" → { month: "Sep", day: "29" }. Falls back to the raw string
// split if the date isn't in M/D format (so the chip always shows something).
function splitDate(raw: string): { month: string; day: string } {
  const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const m = raw.match(/^(\d{1,2})\/(\d{1,2})/);
  if (m && m[1] && m[2]) {
    const monthIdx = parseInt(m[1], 10) - 1;
    if (monthIdx >= 0 && monthIdx < 12) {
      return { month: MONTHS[monthIdx] ?? raw, day: m[2] };
    }
  }
  return { month: raw, day: '' };
}

/* -------------------------------------------------------------------------- */
/*                                    Modal                                   */
/* -------------------------------------------------------------------------- */

function RushDetail({
  events,
  index,
  year,
  onClose,
  onNavigate,
}: {
  events: RushEvent[];
  index: number;
  year: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const total = events.length;
  const event = events[index];
  const prevIdx = index > 0 ? index - 1 : null;
  const nextIdx = index < total - 1 ? index + 1 : null;

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const goPrev = useCallback(() => {
    if (prevIdx !== null) onNavigate(prevIdx);
  }, [prevIdx, onNavigate]);
  const goNext = useCallback(() => {
    if (nextIdx !== null) onNavigate(nextIdx);
  }, [nextIdx, onNavigate]);

  // Scroll lock + focus handling, kept in its own mount-only effect. The
  // keydown effect below depends on the navigation callbacks, which the parent
  // re-creates on every render, so folding these in would re-run (and refocus
  // the row behind the modal) each time the user steps to another night.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Pause global Lenis smooth-scroll while the modal is open, otherwise the
    // page keeps scrolling behind it (Lenis scrolls the window, not body).
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();
    // Remember the row that opened us and restore focus on close.
    const trigger = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => closeBtnRef.current?.focus());
    return () => {
      document.body.style.overflow = prevOverflow;
      lenis?.start();
      trigger?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goPrev();
      } else if (e.key === 'ArrowRight') {
        goNext();
      } else if (e.key === 'Tab' && dialogRef.current) {
        // Focus trap, keep Tab cycling inside the dialog.
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea',
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

  if (!event) return null;

  const { month, day } = splitDate(event.date);
  const prevEvent = prevIdx !== null ? events[prevIdx] : null;
  const nextEvent = nextIdx !== null ? events[nextIdx] : null;
  const calUrl = googleCalendarUrlForEvent(event, year);

  return (
    <div
      ref={dialogRef}
      className="rush-detail"
      role="dialog"
      aria-modal="true"
      aria-label={`${event.name}, ${event.date}`}
    >
      <div
        className="rush-detail__backdrop"
        aria-hidden="true"
        onClick={onClose}
        role="presentation"
      />

      <article className="rush-detail__card" key={index}>
        {/* Stepper + close ------------------------------------------------- */}
        <header className="rush-detail__top">
          <span className="rush-detail__stepper" aria-hidden="true">
            <span className="rush-detail__stepper-label">Day</span>
            <span className="font-display rush-detail__stepper-now">{index + 1}</span>
            <span className="rush-detail__stepper-sep">of</span>
            <span className="font-display rush-detail__stepper-total">{total}</span>
          </span>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close event details"
            className="rush-detail__close"
          >
            <X className="size-4" />
          </button>
        </header>

        {/* Hero: big calendar-day chip + title + pills --------------------- */}
        <section className="rush-detail__hero">
          <figure className="rush-detail__date-chip" aria-hidden="true">
            <span className="font-display rush-detail__date-month">{month}</span>
            <span className="font-display rush-detail__date-day">{day}</span>
          </figure>

          <div className="rush-detail__intro">
            <p className="rush-detail__eyebrow">Fall 2026 rush</p>
            <h2 className="font-display rush-detail__title">{event.name}</h2>
            <div className="rush-detail__pills">
              <span
                className={
                  event.inviteOnly
                    ? 'rush-detail__status rush-detail__status--invite'
                    : 'rush-detail__status rush-detail__status--open'
                }
              >
                {event.inviteOnly ? 'Invite only' : 'Open to all rushees'}
              </span>
              <span className="rush-detail__chip">
                <ShirtIcon className="size-3.5" aria-hidden="true" />
                {event.dress}
              </span>
            </div>
          </div>
        </section>

        {/* Practical info strip ------------------------------------------- */}
        {(event.time || event.location) && (
          <section className="rush-detail__strip">
            {event.time && (
              <span className="rush-detail__strip-item">
                <Clock className="size-4" aria-hidden="true" />
                <span>
                  <span className="rush-detail__strip-label">Time</span>
                  <span className="font-display rush-detail__strip-value">{event.time}</span>
                </span>
              </span>
            )}
            {event.location && (
              <span className="rush-detail__strip-item">
                <MapPin className="size-4" aria-hidden="true" />
                <span>
                  <span className="rush-detail__strip-label">Where</span>
                  <span className="font-display rush-detail__strip-value">{event.location}</span>
                </span>
              </span>
            )}
          </section>
        )}

        {/* Description --------------------------------------------------- */}
        <section className="rush-detail__body">
          <p className="rush-detail__eyebrow">About this event</p>
          <p className="rush-detail__description">{event.description}</p>
          {calUrl && (
            <a
              href={calUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rush-cal-btn rush-detail__cal"
              aria-label={`Add ${event.name} to Google Calendar (opens in a new tab)`}
            >
              <CalendarPlus className="size-4" aria-hidden="true" />
              Add to Google Calendar
            </a>
          )}
        </section>

        {/* Prev/Next strip ----------------------------------------------- */}
        <nav className="rush-detail__nav" aria-label="Other events this week">
          {prevEvent ? (
            <button
              type="button"
              onClick={goPrev}
              className="rush-detail__nav-chip rush-detail__nav-chip--prev"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              <span className="rush-detail__nav-chip-text">
                <span className="rush-detail__nav-chip-label">Previous</span>
                <span className="font-display rush-detail__nav-chip-name">
                  {prevEvent.date} · {prevEvent.name}
                </span>
              </span>
            </button>
          ) : (
            <span
              className="rush-detail__nav-chip rush-detail__nav-chip--placeholder"
              aria-hidden="true"
            >
              <span className="rush-detail__nav-chip-text">
                <span className="rush-detail__nav-chip-label">Start of the week</span>
              </span>
            </span>
          )}
          {nextEvent ? (
            <button
              type="button"
              onClick={goNext}
              className="rush-detail__nav-chip rush-detail__nav-chip--next"
            >
              <span className="rush-detail__nav-chip-text">
                <span className="rush-detail__nav-chip-label">Next up</span>
                <span className="font-display rush-detail__nav-chip-name">
                  {nextEvent.date} · {nextEvent.name}
                </span>
              </span>
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          ) : (
            <span
              className="rush-detail__nav-chip rush-detail__nav-chip--placeholder"
              aria-hidden="true"
            >
              <span className="rush-detail__nav-chip-text">
                <span className="rush-detail__nav-chip-label">End of the week</span>
              </span>
            </span>
          )}
        </nav>
      </article>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Timeline                                  */
/* -------------------------------------------------------------------------- */

export default function RushSchedule({ events, year }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  // Whole-week download: an .ics with one correctly-timed event per night
  // (Google's URL can only ever add ONE event, so it can't carry each night's
  // real time). Rendered as a deterministic data: URI so the server (build) and
  // client (hydration) produce identical markup, a client-only Blob URL here
  // caused a hydration mismatch that blanked the whole schedule.
  const ics = icsForRushWeek(events, year);
  const icsHref = ics ? `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}` : null;

  // Human-readable span for the button note, derived from the first/last
  // events so it never drifts from the actual schedule (e.g. "Sep 28 – Oct 2").
  const first = events[0];
  const last = events[events.length - 1];
  const weekRange =
    first && last
      ? (() => {
          const a = splitDate(first.date);
          const b = splitDate(last.date);
          return `${a.month} ${a.day} – ${b.month} ${b.day}`;
        })()
      : '';

  return (
    <>
      {icsHref && (
        <div className="rush-cal-week">
          <a
            href={icsHref}
            download={`thetatau-rush-${year}.ics`}
            className="rush-cal-btn rush-cal-week__btn"
            aria-label="Download all rush nights as a calendar file (.ics)"
          >
            <CalendarPlus className="size-4" aria-hidden="true" />
            Add all nights to calendar
          </a>
          <span className="rush-cal-week__note">
            All {events.length} nights{weekRange ? ` · ${weekRange}` : ''}
          </span>
        </div>
      )}

      <div className="timeline max-w-3xl" data-stream-in>
        {events.map((e, i) => {
          const { month, day } = splitDate(e.date);
          return (
            <button
              key={`${e.date}-${e.name}`}
              type="button"
              className="timeline-item rush-row"
              onClick={() => setSelectedIndex(i)}
              aria-label={`Open details for ${e.name} on ${e.date}`}
            >
              <span className="rush-row__date" aria-hidden="true">
                <span className="font-display rush-row__date-month">{month}</span>
                <span className="font-display rush-row__date-day">{day}</span>
              </span>
              <span className="rush-row__body">
                <span className="rush-row__head">
                  <span className="font-display rush-row__name">{e.name}</span>
                  <span
                    className={
                      e.inviteOnly
                        ? 'rush-row__status rush-row__status--invite'
                        : 'rush-row__status rush-row__status--open'
                    }
                  >
                    {e.inviteOnly ? 'Invite only' : 'Open'}
                  </span>
                </span>
                <span className="rush-row__meta">
                  <span className="rush-row__dress">{e.dress}</span>
                  {(e.time || e.location) && (
                    <span className="rush-row__sub">
                      {e.time && <span>{e.time}</span>}
                      {e.time && e.location && <span aria-hidden="true"> · </span>}
                      {e.location && <span>{e.location}</span>}
                    </span>
                  )}
                </span>
                <span className="rush-row__desc">{e.description}</span>
              </span>
            </button>
          );
        })}
      </div>

      {selectedIndex !== null && events[selectedIndex] && (
        <RushDetail
          events={events}
          index={selectedIndex}
          year={year}
          onClose={() => setSelectedIndex(null)}
          onNavigate={setSelectedIndex}
        />
      )}
    </>
  );
}
