// Chapter events archive. Categorize each event so the explorer can filter
// by type. Every entry below is a real chapter event; any entry added before
// its details are confirmed should carry `placeholder: true`, which the
// rendering layer uses to dim the card.
//
// Categories follow the natural shape of chapter programming:
//   • mixer       , relaxed social events with other orgs
//   • brotherhood , internal bonding (retreats, game nights, dinners)
//   • prodev      , professional development (resume workshops, panels)
//   • service     , community service projects
//   • formal      , pinning ceremonies, formal nights
//   • regional    , Southwestern Region gatherings, conclaves
//   • rush        , recruitment events (kept distinct from /recruitment)

export type EventCategory =
  | 'mixer'
  | 'brotherhood'
  | 'prodev'
  | 'service'
  | 'formal'
  | 'regional'
  | 'rush';

export interface ChapterEvent {
  name: string;
  /** Display date, e.g. "Oct 12, 2024" or "Spring 2024" if the exact date is lost. */
  date: string;
  /** Sortable ISO date, used to order the archive (YYYY-MM-DD). */
  isoDate?: string;
  category: EventCategory;
  description: string;
  /** Optional photo path under /public. */
  photo?: string;
  /** Optional location string. */
  location?: string;
  /** Flag this entry as a placeholder so the rendering layer can dim or
   *  watermark it until a real event replaces it. */
  placeholder?: boolean;
}

export const EVENT_CATEGORIES: Array<{
  key: EventCategory;
  label: string;
  blurb: string;
}> = [
  {
    key: 'brotherhood',
    label: 'Brotherhood',
    blurb:
      'Game nights, retreats, and family dinners: the moments that make this chapter feel like home.',
  },
  {
    key: 'prodev',
    label: 'Professional Development',
    blurb: 'Resume workshops, alumni panels, mock interviews, company tours.',
  },
  {
    key: 'service',
    label: 'Service',
    blurb: 'Community projects, STEM outreach, beach cleanups.',
  },
  {
    key: 'mixer',
    label: 'Mixers',
    blurb: 'Joint events with other orgs around UCI and the Southwestern Region.',
  },
  {
    key: 'formal',
    label: 'Formals',
    blurb: 'Spring Formal, pinning ceremonies, big-little reveals.',
  },
  {
    key: 'regional',
    label: 'Regionals',
    blurb: 'Southwestern Region conclaves and inter-chapter events.',
  },
  {
    key: 'rush',
    label: 'Rush',
    blurb: 'Open rush events from past recruitment cycles.',
  },
];

// Chapter event archive, sourced from the chapter's 2026 Info Night deck.
// Exact calendar dates were not recorded, so display dates use the season/term
// (supported by the model); isoDate is a coarse season marker used only to
// order the archive, newest first. Photos are stills pulled from the deck.
export const events: ChapterEvent[] = [
  // --- Brotherhood ---
  {
    name: 'Summer Retreat',
    date: 'Summer 2025',
    isoDate: '2025-07-12',
    category: 'brotherhood',
    description:
      'A weekend away in Palm Springs to reconnect, set goals for the year, and just hang out.',
    photo: '/images/events/palm-springs-retreat.jpg',
    location: 'Palm Springs, CA',
  },
  {
    name: 'IM Sports: Basketball, Volleyball & Soccer',
    date: 'Spring 2025',
    isoDate: '2025-04-05',
    category: 'brotherhood',
    description: 'Chapter intramural teams competing across basketball, volleyball, and soccer.',
    photo: '/images/events/im-volleyball.jpg',
    location: 'UC Irvine',
  },
  {
    name: 'Chapter Photoshoot',
    date: 'Winter 2025',
    isoDate: '2025-02-08',
    category: 'brotherhood',
    description: 'The whole chapter out on the lawn in letters for the winter photoshoot.',
    photo: '/images/events/chapter-winter-photoshoot.jpg',
  },
  {
    name: 'Snowboarding & Ski Trip',
    date: 'Winter 2025',
    isoDate: '2025-01-18',
    category: 'brotherhood',
    description:
      'Brothers hit the slopes at Big Bear for a weekend of snowboarding, skiing, and cabin nights.',
    photo: '/images/events/big-bear-retreat.jpg',
    location: 'Big Bear, CA',
  },
  {
    name: 'Disneyland Day',
    date: 'Winter 2024',
    isoDate: '2024-12-14',
    category: 'brotherhood',
    description: 'A full day at the park with the chapter, from rope drop to fireworks.',
    photo: '/images/events/disneyland.jpg',
    location: 'Anaheim, CA',
  },
  // --- Service ---
  {
    name: 'Service Night',
    date: 'Fall 2025',
    isoDate: '2025-11-08',
    category: 'service',
    description:
      'A chapter service night put on with other orgs on campus, making cards and blankets to donate.',
    photo: '/images/events/service-night.jpg',
    location: 'UC Irvine',
  },
  {
    name: 'High School STEM Outreach',
    date: 'Spring 2025',
    isoDate: '2025-05-10',
    category: 'service',
    description:
      'Brothers visit local high schools to share what studying engineering and CS is really like and give college advice.',
    photo: '/images/events/high-school-outreach.jpg',
  },
  {
    name: 'Beach Cleanup',
    date: 'Spring 2025',
    isoDate: '2025-04-19',
    category: 'service',
    description: 'A morning clearing trash off the sand and out of the tide line.',
    photo: '/images/events/beach-cleanup.jpg',
    location: 'Orange County coast',
  },
  // --- Formals ---
  {
    name: 'Senior Send-Off',
    date: 'Spring 2025',
    isoDate: '2025-06-14',
    category: 'formal',
    description: 'Stoles, speeches, and a proper goodbye to the graduating brothers.',
    photo: '/images/events/grad-photos.jpg',
  },
  {
    name: 'Chapter Banquet',
    date: 'Spring 2025',
    isoDate: '2025-06-07',
    category: 'formal',
    description:
      'The chapter dresses up to celebrate the year, honor the class, and send off graduates.',
    photo: '/images/events/banquet-table.jpg',
  },
  // --- Regional ---
  {
    name: 'Southwest Regionals',
    date: 'Winter 2025',
    isoDate: '2025-03-01',
    category: 'regional',
    description:
      'A regional weekend with the other Southwestern chapters: workshops, a community garden service project, and a lot of new faces.',
    photo: '/images/events/southwest-regionals.jpg',
  },
  {
    name: 'Interchapter Socials',
    date: 'Winter 2025',
    isoDate: '2025-02-22',
    category: 'regional',
    description:
      'Getting together with other Southwestern Region chapters and colonies across California and Arizona.',
    photo: '/images/events/interchapter.jpg',
  },
  // --- Rush ---
  {
    name: 'Rush Boothing',
    date: 'Fall 2025',
    isoDate: '2025-09-28',
    category: 'rush',
    description:
      'Meeting prospective members at the Engineering Quad booth, giant letters and all, during the involvement fair and rush week.',
    photo: '/images/events/rush-boothing.jpg',
    location: 'UC Irvine',
  },
  {
    name: 'Fall Rush Photoshoot',
    date: 'Fall 2025',
    isoDate: '2025-09-20',
    category: 'rush',
    description:
      'The chapter heads to the coast in matching rush tees for the Fall Rush photo and video shoot.',
    photo: '/images/events/fall-rush-beach-group.jpg',
    location: 'Laguna Beach, CA',
  },
];
