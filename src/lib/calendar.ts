// Google Calendar "add event" link builder for the rush schedule.
//
// Google Calendar's only public "add event" entry point is the render URL
// (calendar.google.com/calendar/render?action=TEMPLATE&...), which creates a
// SINGLE event and lets the user review it before saving. There is no official
// multi-event URL, so "add the whole week" is modeled as ONE all-day event
// that spans the rush period rather than a batch of separate events.
//
// Times: when an event carries machine-readable `startTime`/`endTime` (24h
// "HH:MM"), the link produces a timed event; otherwise it falls back to an
// all-day entry. No times are invented here, an event without them is all-day.

// Decoupled input shape: this helper only needs these fields, so it does not
// depend on the full RushEvent type. Any object with these properties works.
export interface CalendarEventInput {
  date: string; // "M/D", e.g. "9/28"
  name: string;
  description?: string;
  dress?: string;
  inviteOnly?: boolean;
  location?: string;
  time?: string; // human-readable, e.g. "7–9 PM" (used in the week summary)
  startTime?: string; // "HH:MM" 24h
  endTime?: string; // "HH:MM" 24h
}

const RENDER_BASE = 'https://calendar.google.com/calendar/render?action=TEMPLATE';

interface YMD {
  y: number;
  m: number;
  d: number;
}

// Parse "9/28" + year → { y, m, d }. Returns null if the date isn't "M/D".
function parseMonthDay(date: string, year: number): YMD | null {
  const match = date.match(/^(\d{1,2})\/(\d{1,2})/);
  if (!match || !match[1] || !match[2]) return null;
  const m = Number(match[1]);
  const d = Number(match[2]);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return { y: year, m, d };
}

const pad = (n: number) => String(n).padStart(2, '0');

// YYYYMMDD, Google's all-day date format.
function toYmd({ y, m, d }: YMD): string {
  return `${y}${pad(m)}${pad(d)}`;
}

// Add one calendar day. All-day Google ranges are end-EXCLUSIVE, so a
// single-day event ends on the following day.
function addDay({ y, m, d }: YMD): YMD {
  const dt = new Date(Date.UTC(y, m - 1, d + 1));
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}

// YYYYMMDDTHHMMSS with no trailing "Z": Google treats this as floating local
// time, which is what we want for a template the user confirms in their own
// timezone. Returns null if `time` isn't "HH:MM".
function toYmdHms(day: YMD, time: string): string | null {
  const t = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!t || !t[1] || !t[2]) return null;
  return `${toYmd(day)}T${pad(Number(t[1]))}${t[2]}00`;
}

// Compose the `dates=` value for one event: timed when both start and end
// parse, all-day (single day) otherwise.
function eventDatesParam(day: YMD, event: CalendarEventInput): string {
  if (event.startTime && event.endTime) {
    const start = toYmdHms(day, event.startTime);
    const end = toYmdHms(day, event.endTime);
    if (start && end) return `${start}/${end}`;
  }
  return `${toYmd(day)}/${toYmd(addDay(day))}`;
}

function buildDetails(event: CalendarEventInput): string {
  const lines: string[] = [];
  if (event.description) lines.push(event.description);
  const meta: string[] = [];
  if (event.dress) meta.push(`Dress: ${event.dress}`);
  if (event.inviteOnly) meta.push('Invite only');
  if (meta.length) lines.push(meta.join(' · '));
  return lines.join('\n\n');
}

/**
 * Google Calendar link for a single rush event. Timed when the event has
 * `startTime`/`endTime`, otherwise all-day. Returns null if the date can't be
 * parsed (so callers can hide the button rather than link to a broken event).
 */
export function googleCalendarUrlForEvent(event: CalendarEventInput, year: number): string | null {
  const day = parseMonthDay(event.date, year);
  if (!day) return null;

  const params = new URLSearchParams();
  params.set('text', `Theta Tau Rush · ${event.name}`);
  params.set('dates', eventDatesParam(day, event));
  const details = buildDetails(event);
  if (details) params.set('details', details);
  if (event.location) params.set('location', event.location);
  return `${RENDER_BASE}&${params.toString()}`;
}

/* -------------------------------------------------------------------------- */
/*                          ICS (iCalendar) generation                        */
/* -------------------------------------------------------------------------- */
//
// Google's render URL only ever creates ONE event, so "add the whole week at
// the right times" cannot be a Google link. An .ics file can: one VEVENT per
// night, TIMED when the event has start/end and all-day otherwise, so each
// night lands at its actual time. Imports into Google, Apple, and Outlook.

// Escape a text value for an ICS property (RFC 5545): backslash, semicolon,
// comma, and newlines are escaped.
function icsEscape(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

// One VEVENT block. Timed when start/end parse; single all-day otherwise.
function icsEvent(day: YMD, event: CalendarEventInput, stamp: string): string {
  const lines: string[] = ['BEGIN:VEVENT'];
  // Stable UID (date + name) so a re-import updates rather than duplicates.
  const uid = `${toYmd(day)}-${event.name.replace(/\s+/g, '-').toLowerCase()}@thetatauuci`;
  lines.push(`UID:${icsEscape(uid)}`);
  lines.push(`DTSTAMP:${stamp}`);
  lines.push(`SUMMARY:${icsEscape(`Theta Tau Rush · ${event.name}`)}`);

  const start = event.startTime ? toYmdHms(day, event.startTime) : null;
  const end = event.endTime ? toYmdHms(day, event.endTime) : null;
  if (start && end) {
    // Floating local time (no Z / TZID), same convention as the render links,
    // so the event shows at 7 PM in whatever timezone the importer is in.
    lines.push(`DTSTART:${start}`);
    lines.push(`DTEND:${end}`);
  } else {
    // All-day is end-EXCLUSIVE: run through the following day.
    lines.push(`DTSTART;VALUE=DATE:${toYmd(day)}`);
    lines.push(`DTEND;VALUE=DATE:${toYmd(addDay(day))}`);
  }

  const details = buildDetails(event);
  if (details) lines.push(`DESCRIPTION:${icsEscape(details)}`);
  if (event.location) lines.push(`LOCATION:${icsEscape(event.location)}`);
  lines.push('END:VEVENT');
  return lines.join('\r\n');
}

/**
 * A full VCALENDAR string with one correctly-timed event per parseable night
 * (timed events use their start/end; nights without times are all-day). Returns
 * null if no dates parse, so callers can hide the download.
 */
export function icsForRushWeek(events: CalendarEventInput[], year: number): string | null {
  // DTSTAMP must be DETERMINISTIC: this string is embedded in a data: URI that
  // is rendered on the server (build) and again on the client (hydration). A
  // `new Date()` here would differ between the two and cause a hydration
  // mismatch. Jan 1 of the rush year is a stable, valid creation stamp.
  const stamp = `${year}0101T000000Z`;
  const blocks = events
    .map((e) => {
      const day = parseMonthDay(e.date, year);
      return day ? icsEvent(day, e, stamp) : null;
    })
    .filter((b): b is string => b !== null);
  if (blocks.length === 0) return null;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Theta Tau UCI//Rush Schedule//EN',
    'CALSCALE:GREGORIAN',
    ...blocks,
    'END:VCALENDAR',
  ].join('\r\n');
}
