// Real Pi Delta Chapter content, sourced from the official site
// (https://www.thetatauuci.com/), provided by the user on 2026-06-01.
//
// NOTE ON PERSONAL DATA: the roster (officers + actives) and named testimonials
// below are published on the chapter's public website and are included here with the
// user's explicit confirmation (see CLAUDE.md personal-data rule). Full 49-member
// roster: 6 executive officers + 15 directors + 28 general actives.

// Real headshot keys + per-brother metadata (LinkedIn, company) imported from
// the live site by scripts/import-assets.mjs. Used to auto-resolve photos and
// links for the whole roster without hand-editing every entry.
import { brotherPhotoKeys, brotherMeta } from './brother-photos.generated';
import { researchedLinkedIn } from './brother-linkedin';

// Optional profile fields a brother can fill in to flesh out their detail card.
// All free-form arrays of short strings; the detail view hides any section that
// isn't populated and shows a placeholder when none are filled in.
export interface BrotherProfile {
  interests?: string[];
  experience?: string[];
  askMeAbout?: string[];
  memberClass?: string;
  // Academic year ("Freshman" / "Sophomore" / "Junior" / "Senior" / "Grad" / etc.).
  year?: string;
  // Path to a portrait photo under /public (e.g. "/images/brothers/jane-doe.jpg").
  photo?: string;
  // A favorite song the brother wants to share, displayed under their name.
  favoriteSong?: string;
  // Optional Spotify track ID, when set, the detail card renders an embedded
  // player so visitors can play the song. Get the ID from the share URL
  // (e.g. https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT → "4cOdK2wGLETKBW3PvgPWqT").
  spotifyTrackId?: string;
  // Company the brother is currently working / interning at. Surfaced as a
  // frosted-glass slide-up overlay on the brother card when hovered. Example
  // values: "Boeing", "SpaceX", "Northrop Grumman".
  currentlyAt?: string;

  // --- Fields carried over from the live site's brother_info.js during the
  // content integration (see docs/INTEGRATION_PLAN.md). All optional and
  // unrendered until a component opts in, so existing pages are unaffected. ---
  // LinkedIn profile URL (live site stored this per brother).
  linkedinUrl?: string;
  // Other socials a brother opts to show on their card. Instagram/GitHub are
  // stored as bare handles (no @, no URL); website is a full URL.
  instagram?: string;
  github?: string;
  website?: string;
  // Hometown, e.g. "San Jose, CA".
  hometown?: string;
  // A short fun fact about the brother.
  funFact?: string;
  // Reported gender ("M" | "F" | other), feeds the gender breakdown chart.
  gender?: string;
  // Pledge-class crossing term, e.g. crossingQuarter "Fall", crossingYear "2013".
  crossingQuarter?: string;
  crossingYear?: string;
}

export interface Active extends BrotherProfile {
  name: string;
  major: string;
}

export interface Officer extends BrotherProfile {
  name: string;
  role: string;
  major: string;
}

export interface Testimonial {
  name: string;
  role: string; // e.g. "Marshal 2024-2025"
  memberClass: string;
  quote: string;
  // Optional path to a headshot under /public (e.g. "/images/testimonials/jane-doe.jpg").
  // When omitted, the testimonial card falls back to initials in the portrait frame.
  photo?: string;
}

export interface RushEvent {
  date: string;
  dress: string;
  name: string;
  description: string;
  inviteOnly: boolean;
  // CRITICAL, prospective rushees need a time and a location to actually
  // show up. Fill these in for every rush event before the next rush period.
  // `time`/`location` are human-readable display strings.
  time?: string;
  location?: string;
  // Machine-readable start/end in 24h "HH:MM" (local). When BOTH are present,
  // the "Add to Google Calendar" links produce a timed event; otherwise the
  // event is added as all-day. Leave unset for TBD times.
  startTime?: string;
  endTime?: string;
}

// The calendar year the current `rushSchedule` dates fall in. The schedule
// stores dates as "M/D" (no year); this supplies it for calendar links and any
// other date math. Bump it when the schedule rolls to a new rush period.
export const rushYear = 2026;

export interface Faq {
  q: string;
  a: string;
}

export interface RegionalChapter {
  chapter: string;
  university: string;
  isThisChapter?: boolean;
}

// Executive board, the core elected leadership.
// Exec board (2025-2026). Photos auto-resolve from /images/brothers/<name-slug>.jpg
// via enrichBrother, so they're omitted here.
export const execBoard: Officer[] = [
  { name: 'Dalen Smith', role: 'Regent', major: 'Computer Science and Engineering' },
  { name: 'Katie Quach', role: 'Vice-Regent', major: 'Biomedical Engineering' },
  {
    name: 'Ivy Lee',
    role: 'Treasurer',
    major: 'Mechanical Engineering',
    year: 'Junior',
    memberClass: 'Eta Beta',
    currentlyAt: 'AECOM',
    linkedinUrl: 'https://www.linkedin.com/in/ivy-lee-3719422a0',
    interests: ['Drawing', 'Nail art', 'Updating my Beli', 'Exploring new places'],
    askMeAbout: ['Anime', 'Philosophy', 'Psychology'],
    funFact: 'My dad named me after a small English band.',
    favoriteSong: "When I'm Thinking About You, The Sundays",
    spotifyTrackId: '2RtOnuOdBiecnBoX8x9uoO',
  },
  {
    name: 'Victoria Sun',
    role: 'Scribe',
    major: 'Computer Science',
    year: 'Senior',
    memberClass: 'Theta Beta',
    linkedinUrl: 'https://www.linkedin.com/in/victoriasun1230/',
    interests: ['Jazz vocals', 'Philosophy', 'Reading', 'Hiking', 'Cooking'],
    askMeAbout: ['Classic literature', 'Food', "Countries I've been to"],
    funFact: 'My favorite country is Hungary.',
    favoriteSong: 'Lovers Rock, Sade',
    spotifyTrackId: '77lKjGkhvWuimTzQxA4STK',
  },
  { name: 'Elizabeth Yancey', role: 'Marshal', major: 'Biomedical Engineering' },
  // TODO(confirm): Hannah Kim's exact exec title, assumed "Corresponding Secretary"
  // (the standard sixth Theta Tau exec seat). Update if the board uses a different title.
  {
    name: 'Hannah Kim',
    role: 'Corresponding Secretary',
    major: 'Mechanical Engineering',
    year: 'Junior',
    memberClass: 'Zeta Beta',
    currentlyAt: 'Johnson & Johnson',
    linkedinUrl: 'https://www.linkedin.com/in/hannah-l-kim',
    website: 'https://saltannah.github.io/',
    interests: ['Cafe hopping', 'Crocheting', 'Baking', 'LinkedIn games'],
    askMeAbout: ['My favorite forms of caffeine'],
    funFact: 'I can lick my elbow.',
    favoriteSong: 'Backseat, Balu Brigada',
    spotifyTrackId: '7yT4NJt5rgmVoMJMGPULcj',
  },
];

// Officers, the directors and co-directors (distinct from the exec board).
export const directors: Officer[] = [
  {
    name: 'Natalie Dai',
    photo: '/images/brothers/nataliedai.jpg',
    role: 'Co-Dir. Media',
    major: 'Data Science',
    year: 'Sophomore',
    memberClass: 'Iota Beta',
  },
  {
    name: 'Ethan Kim',
    photo: '/images/brothers/ethankim.jpg',
    role: 'Co-Dir. Media',
    major: 'Civil Engineering',
    year: 'Sophomore',
    memberClass: 'Iota Beta',
    linkedinUrl: 'https://linkedin.com/in/ethankim12',
    interests: ['Basketball', 'Pickleball', 'Working out', 'Running', 'Music', 'Colognes'],
    askMeAbout: ['Music', 'Sports', 'Food'],
    funFact: 'I have dislocated, fractured, and broken a bone before.',
    favoriteSong: 'What Did I Miss, Drake',
    spotifyTrackId: '57GsLpRtEtrzcPGPop20rS',
  },
  {
    name: 'Truman Lindenthaler',
    role: 'Co-Dir. Recruitment',
    major: 'Aerospace Engineering',
    year: 'Junior',
    memberClass: 'Eta Beta',
    linkedinUrl: 'https://www.linkedin.com/in/trumanlindenthaler',
    askMeAbout: ['Music'],
    favoriteSong: 'Nettles, Ethel Cain',
    spotifyTrackId: '3xoM5gZ2RVQqLkjqEgrJ4x',
  },
  {
    name: 'Samantha Huang',
    role: 'Co-Dir. Recruitment',
    major: 'Civil Engineering',
    year: 'Junior',
    memberClass: 'Eta Beta',
    currentlyAt: 'Civil design team, UCI Transportation',
    linkedinUrl: 'https://www.linkedin.com/in/samantha-huang-706091365',
  },
  {
    name: 'Dao Doan',
    photo: '/images/brothers/daodoan.jpg',
    role: 'Dir. Website Development',
    major: 'Computer Engineering',
    memberClass: 'Iota Beta',
    spotifyTrackId: '3D9iV6cYkYJRAPFO6DRKIE',
  },
  {
    name: 'Andony Velasquez',
    photo: '/images/brothers/andonyvelasquez.jpg',
    role: 'Co-Dir. Fundraising',
    major: 'Computer Science',
    memberClass: 'Iota Beta',
  },
  {
    name: 'Jordan Chan',
    photo: '/images/brothers/jordanchan.jpg',
    role: 'Co-Dir. Fundraising',
    major: 'Mechanical Engineering',
    year: 'Junior',
    memberClass: 'Iota Beta',
    currentlyAt: 'Anteater Electric Racing',
    linkedinUrl: 'https://www.linkedin.com/in/jordanruichan',
    website: 'https://royaleapi.com/player/9RRQPYYRJ',
    interests: ['Clash Royale', 'Fortnite'],
    askMeAbout: ['Clash Royale', 'Fortnite'],
    funFact: 'I have a dog named Bagel.',
    favoriteSong: 'GGEZ, Kaien Nuen',
    spotifyTrackId: '6iwsWcvqCQcj025NqCeyFS',
  },
  { name: 'Allyson Lay', role: 'Co-Dir. Brotherhood', major: 'Computer Science and Engineering' },
  { name: 'Richard Tokiyeda', role: 'Co-Dir. Brotherhood', major: 'Biomedical Engineering' },
  {
    name: 'Daniel Grivennikov',
    photo: '/images/brothers/danielgrivennikov.jpg',
    role: 'Co-Dir. Engineering',
    major: 'Aerospace Engineering',
    year: 'Junior',
    memberClass: 'Iota Beta',
    currentlyAt: 'NASA',
    linkedinUrl: 'https://www.linkedin.com/in/danielgrivennikov',
    interests: ['Skiing', 'Violin', 'Competitive shrimp farming'],
    favoriteSong: 'Family Business, Kanye West',
    spotifyTrackId: '5DBmXF7QO43Cuy9yqva116',
  },
  {
    name: 'Akhil Nandhakumar',
    role: 'Co-Dir. Engineering',
    major: 'Aerospace Engineering',
    year: 'Senior',
    memberClass: 'Theta Beta',
    currentlyAt: 'Fabric8Labs',
    linkedinUrl: 'https://www.linkedin.com/in/akhilnandhakumar',
    instagram: 'akhil.nandhakumar',
    interests: [
      'Tennis',
      'Soccer',
      'Motorsport',
      'Cliff jumping',
      'Snorkeling',
      'Working with cars',
    ],
    askMeAbout: ['Sports', 'Spaceflight and space exploration'],
    funFact: 'I taught myself how to juggle.',
    favoriteSong: 'Slow Dancing in a Burning Room, John Mayer',
    spotifyTrackId: '3dz8pl1D5S8RkANEQPDWiC',
  },
  {
    name: 'Jasmine Dhaliwal',
    photo: '/images/brothers/jasminedhaliwal.jpg',
    role: 'Dir. Service',
    major: 'Computer Science',
    year: 'Sophomore',
    memberClass: 'Iota Beta',
    currentlyAt: 'Trenta',
    linkedinUrl: 'https://www.linkedin.com/in/jasmine-dhaliw/',
    instagram: 'jasmine.dhali',
    interests: ['Running', 'Hiking', 'Pickleball', 'Traveling'],
    askMeAbout: ['Traveling', 'Running', 'Hiking', 'Anything CS-related'],
    funFact: 'I was born and raised in the Czech Republic.',
    favoriteSong: 'Rendezvous, Don Toliver',
    spotifyTrackId: '2Ejyg4CavumEr7lFUkk9aF',
  },
  {
    name: 'James Kwon',
    photo: '/images/brothers/jameskwon.jpg',
    // Self-reported "Mechanical Engineering" on the profile form (was
    // "Materials Science and Engineering" from the old import), verify.
    role: 'Dir. Public Relations',
    major: 'Mechanical Engineering',
    year: 'Sophomore',
    memberClass: 'Iota Beta',
    linkedinUrl: 'https://www.linkedin.com/in/james-kwon1',
    instagram: 'jamesshkwon',
    interests: ['Soccer', 'Gym', 'Double matcha', 'Trying new food'],
    askMeAbout: ['Soccer', 'Food', 'Matcha', 'Music', 'Gym', 'Academics', 'R6'],
    funFact: 'Ex number-one console champion on R6.',
    favoriteSong: 'Nikes, Frank Ocean',
    spotifyTrackId: '19YKaevk2bce4odJkP5L22',
  },
  {
    name: 'Ethan Choi',
    role: 'Co-Dir. Professional Development',
    major: 'Mechanical Engineering',
    currentlyAt: 'Apple',
  },
  {
    name: 'Harmeet Singh',
    role: 'Co-Dir. Professional Development',
    major: 'Computer Science',
    year: 'Junior',
    memberClass: 'Theta Beta',
    currentlyAt: 'AbbVie',
    linkedinUrl: 'https://www.linkedin.com/in/harmeet-singh-uppal/',
    github: 'har-m33t',
    website: 'https://harmeet-singh.dev',
    interests: ['Drawing', 'Comics & manga', 'Basketball', 'Volleyball', 'Football', 'F1'],
    askMeAbout: ['Food', 'Coffee', 'Gojo Satoru'],
    funFact: 'One of my artworks was displayed in an art exhibit back home.',
    favoriteSong: 'House of Balloons, The Weeknd',
    spotifyTrackId: '2r7BPog74oaTG5shNYiUnV',
  },
];

// All leadership (exec board + directors).
export const officers: Officer[] = [...execBoard, ...directors];

// General actives (non-officers). Together with the 6 exec officers and 15
// directors this is the full 49-member active roster. Photos auto-resolve by
// name-slug via enrichBrother.
export const actives: Active[] = [
  { name: 'Wilson Nguyen', major: 'Computer Engineering', currentlyAt: 'Qualcomm & SpaceX' },
  { name: 'Elena Cheung', major: 'Mechanical Engineering' },
  { name: 'Luis Gama', major: 'Civil Engineering' },
  { name: 'Keiko Yamamuro', major: 'Mechanical Engineering' },
  { name: 'Sarah Qu', major: 'Mechanical Engineering' },
  {
    name: 'Shana Chao',
    major: 'Computer Engineering',
    year: 'Senior',
    memberClass: 'Epsilon Beta',
    currentlyAt: 'Advanced Spade Company',
    interests: [
      'Embedded systems',
      'Scrapbooking',
      'Learning new languages',
      'Finding good deals on Facebook Marketplace',
    ],
    askMeAbout: ['Studying abroad', 'K-dramas'],
    funFact: "I can't whistle.",
    favoriteSong: '小幸运 (A Little Happiness), Hebe Tien',
    spotifyTrackId: '2zapgrglLRISEUlspPtdep',
  },
  { name: 'Sydney Okazaki', major: 'Civil Engineering' },
  { name: 'David Culciar', major: 'Computer Science and Engineering', currentlyAt: 'SpaceX' },
  {
    name: 'Jason Nguyen',
    major: 'Civil Engineering',
    year: 'Senior',
    memberClass: 'Zeta Beta',
    currentlyAt: 'Coffman Engineers',
    interests: ['Volleyball'],
    askMeAbout: ['Sports'],
    funFact: "I'm injury prone like Anthony Davis.",
    favoriteSong: "I Ain't Comin' Back, Morgan Wallen & Post Malone",
    spotifyTrackId: '5mPdM1UDdAcnmJ41KjJb9H',
  },
  { name: 'Xamantha De Luna', major: 'Biomedical Engineering' },
  {
    name: 'Annie Tran',
    major: 'Civil Engineering',
    year: 'Senior',
    memberClass: 'Zeta Beta',
    currentlyAt: 'Langan',
    linkedinUrl: 'https://www.linkedin.com/in/annietran05',
    interests: ['Boba', 'Crochet', 'YouTube', 'Netflix'],
    askMeAbout: ['Boba'],
    funFact: "I can't swim.",
    favoriteSong: 'Forever Young, itsmurph',
    spotifyTrackId: '08loBhbezM9ypYP2nbJQQd',
  },
  { name: 'Piyawan Chaiprasit', major: 'Computer Science' },
  { name: 'Carol Wang', major: 'Computer Science' },
  {
    name: 'Andrew Nguyen',
    currentlyAt: 'Rivian',
    photo: '/images/brothers/andrewnguyen.jpg',
    major: 'Computer Engineering',
  },
  { name: 'Anna Coppola', major: 'Mechanical Engineering' },
  { name: 'Austin Fugate', major: 'Aerospace Engineering & Mechanical Engineering' },
  {
    name: 'Chloe Chow',
    major: 'Software Engineering',
    year: 'Junior',
    memberClass: 'Eta Beta',
    currentlyAt: 'LADWP',
    linkedinUrl: 'https://www.linkedin.com/in/chloechow28',
    interests: ['Snowboarding', 'Rock climbing', 'Traveling', 'Making matcha'],
    askMeAbout: ['Squishies', 'Trinkets', 'Doing nails', 'Outdoor climbing'],
    funFact: 'I can make a 5-minute buldak carbonara in 4 minutes.',
    favoriteSong: 'Thinking About You, Calvin Harris',
    spotifyTrackId: '1KtD0xaLAikgIt5tPbteZQ',
  },
  { name: 'Diane Yoon', major: 'Aerospace Engineering' },
  { name: 'Emma Shin', major: 'Engineering Undeclared' },
  { name: 'Ival Momoh', major: 'Computer Engineering' },
  { name: 'Jarrett Lim', major: 'Mechanical Engineering', currentlyAt: 'SpaceX' },
  { name: 'Jay Kim', major: 'Computer Engineering' },
  { name: 'Kaitlyn Takasawa', major: 'Civil Engineering' },
  {
    name: 'Kiara Peters',
    photo: '/images/brothers/kiarapeters.jpg',
    major: 'Aerospace Engineering',
    year: 'Sophomore',
    memberClass: 'Iota Beta',
    linkedinUrl: 'https://www.linkedin.com/in/kiara-peters',
    favoriteSong: 'Crying Lightning, Arctic Monkeys',
    spotifyTrackId: '1a7wQYSTdyNyvMSAuFxxCQ',
  },
  {
    name: 'Maxim Varakuta',
    photo: '/images/brothers/maximvarakuta.jpg',
    major: 'Civil Engineering',
    memberClass: 'Iota Beta',
  },
  {
    name: 'Norton Hoang',
    photo: '/images/brothers/nortonhoang.jpg',
    major: 'Electrical Engineering',
    year: 'Junior',
    memberClass: 'Iota Beta',
    linkedinUrl: 'https://www.linkedin.com/in/norton-hoang-',
    interests: ['Basketball', 'Valorant', 'Gym'],
    favoriteSong: 'My Love Mine All Mine, Mitski',
    spotifyTrackId: '3vkCueOmm7xQDoJ17W1Pm3',
  },
  { name: 'River Giffin', major: 'Mechanical Engineering' },
  { name: 'Zane Xing', major: 'Mechanical Engineering' },
];

// Everyone (exec board + directors + general actives), the full active roster,
// each tagged with a tier for the Brothers filter tabs.
export type RosterTier = 'exec' | 'officer' | 'active' | 'alumni';

// Auto-resolve a brother's real headshot + LinkedIn + company from the imported
// live-site data, keyed by a name slug ("Wilson Nguyen" -> "wilsonnguyen").
// Anything set explicitly on the entry wins; this only fills the gaps.
const _photoKeys = new Set(brotherPhotoKeys);
const brotherKey = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

// The imported live-site data stores some LinkedIn URLs schemeless
// ("www.linkedin.com/in/x", "LinkedIn.com/in/x") or as plain http://. A
// schemeless value renders as a relative href and 404s under /brothers/, and
// http:// sends the first hop in the clear, so normalize every value to
// https://www.linkedin.com/... here rather than hand-editing the generated file.
function normalizeLinkedIn(url?: string): string | undefined {
  if (!url) return undefined;
  const withScheme = /^https?:\/\//i.test(url)
    ? url.replace(/^http:\/\//i, 'https://')
    : `https://${url}`;
  return withScheme.replace(/^https:\/\/(?:www\.)?linkedin\.com/i, 'https://www.linkedin.com');
}

// The imported headshots, LinkedIn URLs and employers are keyed by name slug
// alone, and that import came from the CURRENT live roster. Two brothers in
// different classes can share a name (a Beta and a Pi Kevin Huynh, an Eta Beta
// and a Theta Samantha Huang), so a name-keyed lookup would publish the active
// brother's face, LinkedIn profile and employer on their alumni namesake's
// card: a real person misidentified under someone else's name. Auto-resolution
// is therefore suppressed for an alumnus whose slug is already claimed by an
// active; their card falls back to the monogram, which is the honest result.
// Anything set explicitly on the alumnus's own entry still wins.
// A slug is "contested" when more than one distinct brother answers to it. The
// live-site import describes the active, so the active claimant keeps the data
// and every other namesake falls back to the monogram. When no claimant is an
// active (the Beta and Pi Kevin Huynhs are both alumni) there is nothing to
// break the tie, so neither inherits it: two monograms beat one wrong face.
let _contested: Set<string> | undefined;
const contestedSlug = (k: string) => {
  if (!_contested) {
    const seen = new Map<string, Set<string>>();
    const note = (name: string, cls?: string) => {
      const s = seen.get(brotherKey(name)) ?? new Set();
      s.add(cls ?? 'unclassed');
      seen.set(brotherKey(name), s);
    };
    for (const b of allActives) note(b.name, b.memberClass ?? _nameToClass.get(b.name));
    for (const [cls, members] of Object.entries(memberClassRosters)) {
      for (const m of members) note(m.name, cls);
    }
    _contested = new Set([...seen].filter(([, cls]) => cls.size > 1).map(([k2]) => k2));
  }
  return _contested.has(k);
};

function enrichBrother<T extends Active & { role?: string; tier?: RosterTier }>(b: T): T {
  const k = brotherKey(b.name);
  // Only alumni can be shadowed by a namesake, so actives never pay this cost
  // (and never reach the lazy set before `allActives` is initialised).
  const shadowed = b.tier === 'alumni' && contestedSlug(k);
  const meta = shadowed ? undefined : brotherMeta[k];
  return {
    ...b,
    photo: b.photo ?? (!shadowed && _photoKeys.has(k) ? `/images/brothers/${k}.jpg` : undefined),
    linkedinUrl: normalizeLinkedIn(
      b.linkedinUrl ?? meta?.linkedinUrl ?? (shadowed ? undefined : researchedLinkedIn[k]),
    ),
    currentlyAt: b.currentlyAt ?? meta?.company,
  };
}

export const allActives: Array<Active & { role?: string; tier: RosterTier }> = [
  ...execBoard.map((m) => enrichBrother({ ...m, tier: 'exec' as const })),
  ...directors.map((m) => enrichBrother({ ...m, tier: 'officer' as const })),
  ...actives.map((m) => enrichBrother({ ...m, tier: 'active' as const })),
];

// Major breakdown across the full active roster (for the demographics chart).
const _majorCounts = new Map<string, number>();
for (const a of allActives) _majorCounts.set(a.major, (_majorCounts.get(a.major) ?? 0) + 1);
export const majorBreakdown = [..._majorCounts.entries()]
  .map(([major, count]) => ({ major, count }))
  .sort((a, b) => b.count - a.count);

// Gender breakdown across the active roster (sums to currentActives = 49).
// APPROXIMATE, refresh with verified counts when available (the split below is
// an estimate carried over as the roster changed; confirm the exact numbers).
export const genderBreakdown: Array<{ label: string; count: number }> = [
  { label: 'Female', count: 25 },
  { label: 'Male', count: 24 },
];

// Classes, in order. The lineage of Pi Delta Chapter.
export const memberClasses: string[] = [
  'Founding Class',
  'Alpha',
  'Beta',
  'Gamma',
  'Delta',
  'Epsilon',
  'Zeta',
  'Eta',
  'Theta',
  'Iota',
  'Kappa',
  'Lambda',
  'Mu',
  'Nu',
  'Xi',
  'Omicron',
  'Pi',
  'Rho',
  'Tau',
  'Upsilon',
  'Phi',
  'Chi',
  'Psi',
  'Gamma Beta',
  'Delta Beta',
  'Epsilon Beta',
  'Zeta Beta',
  'Eta Beta',
  'Theta Beta',
  'Iota Beta',
];
export const currentClass = 'Iota Beta';

// Verified chapter facts from the official site.
export const chapterFacts = {
  foundedAtUci: '2013',
  installed: 'April 14, 2021',
  // "Over 200 active members and alumni", combined figure (not actives alone).
  membersAndAlumni: 200,
  currentActives: 49,
  sizeStatLabel: 'Active members and alumni',
};

// National founding facts (Theta Tau).
export const nationalFacts = {
  yearFounded: 1904,
  birthplace: 'University of Minnesota, Minneapolis',
  // Original name before adopting the Greek letters.
  originalName: 'Society of Hammer and Tongs',
  numFounders: 4,
  // "More than 80 campuses across the US" per the chapter site.
  campusCount: '80+',
  tagline: 'The oldest and largest fraternity for engineers.',
};

// Historical class rosters. Each entry is a member that was part of
// that class, names + major (and officer title for the year they served, if
// applicable). Sourced from the chapter's own public roster at
// thetatauuci.com/brothers under the Classes tab. Major strings are
// normalized to UCI's actual major names (e.g. "Materials Science and
// Engineering" instead of the live site's "Material Science Engineering").
export interface ClassMember {
  name: string;
  major: string;
  role?: string;
}

export const memberClassRosters: Record<string, ClassMember[]> = {
  'Founding Class': [
    { name: 'Richard Staebler', major: 'Aerospace Engineering' },
    { name: 'Jonathan Wong', major: 'Mechanical Engineering' },
    { name: 'Sarah Leung', major: 'Civil Engineering' },
    { name: 'Jacqueline Kim', major: 'Civil Engineering' },
    { name: 'Terence Leung', major: 'Mechanical Engineering' },
    { name: 'Jonathan Turcios', major: 'Electrical Engineering' },
    { name: 'Jeffrey Go', major: 'Biomedical Engineering' },
    { name: 'Christopher Louie', major: 'Mechanical Engineering' },
  ],
  Alpha: [
    { name: 'Charles Chiang', major: 'Civil Engineering' },
    { name: 'Walter Hsieh', major: 'Aerospace Engineering' },
    { name: 'Elliot Huang', major: 'Civil Engineering' },
    { name: 'Bryan Le', major: 'Chemical Engineering' },
    { name: 'Michelle Mueller', major: 'Chemical Engineering' },
    { name: 'Nazneen Pashutanizadeh', major: 'Biomedical Engineering' },
    { name: 'Siddharthan Selvasekar', major: 'Chemical Engineering' },
    { name: 'Patrick Sy', major: 'Chemical Engineering' },
    { name: 'Chynna Velasco', major: 'Computer Science and Engineering' },
  ],
  Beta: [
    { name: 'Gabrielle Abdon', major: 'Civil Engineering' },
    { name: 'Evan Coombs', major: 'Mechanical Engineering' },
    { name: 'Benjamin Halbach', major: 'Civil Engineering' },
    { name: 'Kevin Huynh', major: 'Computer Engineering' },
    { name: 'Kelly Inciong', major: 'Computer Engineering' },
    { name: 'Shan Kim', major: 'Mechanical Engineering' },
    { name: 'Andrew Kin', major: 'Civil Engineering' },
    { name: 'Eddie Kwan', major: 'Mechanical Engineering' },
    { name: 'Allison Ramirez', major: 'Aerospace Engineering' },
  ],
  Gamma: [
    { name: 'Divya Bajaj', major: 'Electrical Engineering' },
    { name: 'Casey Carter', major: 'Aerospace Engineering' },
    { name: 'Jessica Kao', major: 'Mechanical Engineering' },
    { name: 'Nicolas Kurtz', major: 'Chemical Engineering' },
    { name: 'Amelia Meyer', major: 'Civil Engineering' },
    { name: 'Connie Phan', major: 'Civil Engineering' },
    { name: 'Ashley Robinson', major: 'Chemical Engineering' },
  ],
  Delta: [
    { name: 'Martin Boyd', major: 'Civil Engineering' },
    { name: 'Yonathan Esquivel', major: 'Civil Engineering' },
    { name: 'Brian Mugg', major: 'Mechanical Engineering' },
    { name: 'Adiseshu Peesapati', major: 'Mechanical Engineering' },
    { name: 'Chris Prijic', major: 'Mechanical Engineering' },
    { name: 'Irvin Vazquez', major: 'Mechanical Engineering' },
    { name: 'Telena Vo', major: 'Environmental Engineering' },
  ],
  Epsilon: [
    { name: 'Juan Contreras', major: 'Biomedical Engineering' },
    { name: 'Lynn Dannan', major: 'Electrical Engineering' },
    { name: 'Anthony Foley', major: 'Electrical Engineering' },
    { name: 'Daniel Klebe', major: 'Aerospace Engineering' },
    { name: 'Alex LaVelle', major: 'Mechanical Engineering' },
    { name: 'Bryce Loop', major: 'Chemical Engineering' },
    { name: 'Rio Menchaca', major: 'Mechanical Engineering' },
  ],
  Zeta: [
    { name: 'Brandon Chen', major: 'Civil Engineering' },
    { name: 'Xavier Chuck', major: 'Chemical Engineering' },
    { name: 'Itzetl Frausto', major: 'Mechanical Engineering' },
    { name: 'Ryan Hai', major: 'Mechanical Engineering' },
    { name: 'Winnie Hu', major: 'Civil Engineering' },
    { name: 'Ryan Kawahara', major: 'Computer Engineering' },
    { name: 'Christine Lao', major: 'Chemical Engineering' },
  ],
  Eta: [
    { name: 'Jayvee Aspa', major: 'Chemical Engineering' },
    { name: 'Sandy Dao', major: 'Electrical Engineering' },
    { name: 'Vivian Hang', major: 'Civil Engineering' },
    { name: 'William Hsueh', major: 'Materials Science and Engineering' },
    { name: 'Jevons Jiang', major: 'Mechanical Engineering' },
    { name: 'Jodie Loo', major: 'Mechanical Engineering' },
    { name: 'David Pham', major: 'Mechanical Engineering' },
  ],
  Theta: [
    { name: 'Rodney Buzon', major: 'Materials Science and Engineering' },
    { name: 'Baldwin Chang', major: 'Computer Science and Engineering' },
    { name: 'Samantha Huang', major: 'Biomedical Engineering' },
    { name: 'Jackie Li', major: 'Computer Science and Engineering' },
    { name: 'GuanYu Liu', major: 'Biomedical Engineering' },
    { name: 'Andrew Melendez', major: 'Aerospace Engineering' },
    { name: 'Eric Nguyen', major: 'Mechanical Engineering' },
  ],
  Iota: [
    { name: 'Michael Acasio', major: 'Civil Engineering' },
    { name: 'Bridget Ventura', major: 'Civil Engineering' },
    { name: 'Tina Chan', major: 'Materials Science and Engineering' },
    { name: 'Allen Chang', major: 'Mechanical Engineering' },
    { name: 'Daniel Duong', major: 'Mechanical Engineering' },
    { name: 'Dean Gonzales', major: 'Mechanical Engineering' },
    { name: 'Dale Lee', major: 'Mechanical Engineering' },
  ],
  Kappa: [
    { name: 'Santiago Barrera', major: 'Mechanical Engineering' },
    { name: 'Heejun Chough', major: 'Materials Science and Engineering' },
    { name: 'Jimmy Chung', major: 'Civil Engineering' },
    { name: 'Yun Jo (Kevin)', major: 'Mechanical Engineering' },
    { name: 'Henry Hoang', major: 'Biomedical Engineering' },
    { name: 'Joseph Hong', major: 'Mechanical Engineering' },
    { name: 'Kyle Krumrei', major: 'Aerospace Engineering' },
  ],
  Lambda: [
    { name: 'Lawrence Chong', major: 'Computer Science and Engineering' },
    { name: 'Alvin Kwong', major: 'Computer Science' },
    { name: 'Calvin Li', major: 'Materials Science and Engineering' },
    { name: 'Yu Wei Liu', major: 'Computer Science' },
    { name: 'John Luong', major: 'Biomedical Engineering' },
    { name: 'Jessica Ma', major: 'Electrical Engineering' },
    { name: 'Laura Marsh', major: 'Software Engineering' },
  ],
  Mu: [
    { name: 'Christopher Banh', major: 'Computer Science' },
    { name: 'Steven Campos', major: 'Aerospace Engineering' },
    { name: 'Jessica Chen', major: 'Computer Science' },
    { name: 'John Chua', major: 'Computer Science' },
    { name: 'Brian Dang', major: 'Electrical Engineering' },
    { name: 'Kevin Troy De Guzman', major: 'Electrical Engineering' },
    { name: 'Sebastian Gao', major: 'Mechanical Engineering' },
  ],
  Nu: [
    { name: 'Chloe Agape', major: 'Computer Science' },
    { name: 'Kevin Chen', major: 'Aerospace Engineering' },
    { name: 'Willis Lao', major: 'Biomedical Engineering' },
    { name: 'Dawn Malla', major: 'Civil Engineering' },
    { name: 'Shogo Nakamura', major: 'Computer Science' },
    { name: 'Hailey Noe', major: 'Chemical Engineering' },
    { name: 'Kyla Quilos', major: 'Electrical Engineering' },
  ],
  Xi: [
    { name: 'Karla Abad-Torrez', major: 'Computer Science' },
    { name: 'Maxine Apoderado', major: 'Mechanical Engineering' },
    { name: 'Eric Chen', major: 'Mechanical Engineering' },
    { name: 'Paul John Evangelista (PJ)', major: 'Computer Engineering' },
    { name: 'Sarah Huang', major: 'Computer Science' },
    { name: 'Justin Huynh', major: 'Computer Engineering' },
    { name: 'Jessica Lee', major: 'Mechanical Engineering' },
  ],
  Omicron: [
    { name: 'Kulraj Dhaliwal', major: 'Computer Science' },
    { name: 'Lawrence Hwang', major: 'Computer Science' },
    { name: 'Chandan Jain', major: 'Computer Science and Engineering' },
    { name: 'Christopher La', major: 'Mechanical Engineering' },
    { name: 'Angelou Lao', major: 'Biomedical Engineering' },
    { name: 'Gary Li', major: 'Computer Science' },
    { name: 'Louis Lin', major: 'Civil Engineering' },
  ],
  Pi: [
    { name: 'Micky Chettanapanich', major: 'Computer Science' },
    { name: 'Nicholas Chiu', major: 'Computer Engineering' },
    { name: 'Yoseph Ghazal', major: 'Computer Science' },
    { name: 'Justin Ho', major: 'Computer Science' },
    { name: 'Albert Hong', major: 'Biomedical Engineering' },
    { name: 'Kevin Huynh', major: 'Computer Science' },
    { name: 'Dylan Kao', major: 'Electrical Engineering' },
  ],
  Rho: [
    { name: 'Jonathan Chang', major: 'Mechanical Engineering' },
    { name: 'Maireen Espiritu', major: 'Software Engineering' },
    { name: 'Emily Hoang', major: 'Biomedical Engineering' },
    { name: 'Eric Hsueh', major: 'Computer Science' },
    { name: 'Benjamin Huynh', major: 'Computer Science' },
    { name: 'Claire Hyon', major: 'Computer Science and Engineering' },
    { name: 'Adrienne Lee', major: 'Biomedical Engineering & Mechanical Engineering' },
  ],
  Tau: [
    { name: 'Alyssa Harvey', major: 'Computer Science' },
    { name: 'Teryn Kum', major: 'Software Engineering' },
    { name: 'Hana Lee', major: 'Computer Science' },
    { name: 'Claire Lin', major: 'Mechanical Engineering' },
    { name: 'Lewis Lin', major: 'Civil Engineering' },
    { name: 'Crystal Grace David Militante', major: 'Mechanical Engineering' },
    { name: 'Thu Nguyen', major: 'Computer Science' },
  ],
  Upsilon: [
    { name: 'Lee Bahir', major: 'Computer Science' },
    { name: 'Shlok Bansal', major: 'Biomedical Engineering' },
    { name: 'Riya Goja', major: 'Computer Engineering' },
    { name: 'Kelly Huang', major: 'Computer Science' },
    { name: 'Long Lau', major: 'Mechanical Engineering' },
    { name: 'Sharon Le', major: 'Computer Engineering' },
    { name: 'Danson Ma', major: 'Mechanical Engineering' },
  ],
  Phi: [
    { name: 'Kameron Ahmed', major: 'Mechanical Engineering' },
    { name: 'Kayla Choi', major: 'Computer Science' },
    { name: 'Frederick Halo', major: 'Computer Science and Engineering' },
    { name: 'Jonathan Ho', major: 'Electrical Engineering' },
    { name: 'Derek Ortiz', major: 'Mechanical Engineering' },
    { name: 'Navya Sangam', major: 'Biomedical Engineering' },
  ],
  Chi: [
    { name: 'Tyler Buffa', major: 'Aerospace Engineering' },
    { name: 'Daniela Campuzano', major: 'Mechanical Engineering' },
    { name: 'Clara Chao', major: 'Biomedical Engineering' },
    { name: 'Ruijia (Ray) Hua', major: 'Software Engineering' },
    { name: 'Brandon Keung', major: 'Data Science' },
    { name: 'Yi Sien (Ian) Ku', major: 'Computer Engineering' },
    { name: 'Ruth Regi', major: 'Biomedical Engineering' },
  ],
  Psi: [
    { name: 'Andrea Tran', major: 'Aerospace Engineering' },
    { name: 'Andrew Eck', major: 'Biomedical Engineering' },
    { name: 'Jack Le', major: 'Computer Science' },
    { name: 'Nikolaj Kim', major: 'Data Science' },
    { name: 'Tiffany Gao', major: 'Mechanical Engineering' },
    { name: 'Tristan Zabala', major: 'Mechanical Engineering' },
  ],
  'Gamma Beta': [
    { name: 'Diego Solorzano', major: 'Electrical Engineering' },
    { name: 'Donovan Chen', major: 'Computer Science' },
    { name: 'Francisco (Tim) Oh', major: 'Computer Science and Engineering' },
    { name: 'Hyungcheol Kim', major: 'Biomedical Engineering' },
    { name: 'Jake Silverman', major: 'Data Science' },
    { name: 'Luke Vargas', major: 'Electrical Engineering' },
  ],
  'Delta Beta': [
    { name: 'Arim Song', major: 'Biomedical Engineering' },
    { name: 'Elise Ji', major: 'Computer Science' },
    { name: 'Ellen So', major: 'Biomedical Engineering', role: 'Marshal' },
    { name: 'Jamie Kuang', major: 'Computer Science' },
    { name: 'Miguel Murillo', major: 'Mechanical Engineering' },
    { name: 'Natalie Perrochon', major: 'Computer Science' },
    { name: 'Steven Lee', major: 'Computer Science', role: 'Corresponding Secretary' },
  ],
  'Epsilon Beta': [
    { name: 'Austin Fugate', major: 'Aerospace Engineering & Mechanical Engineering' },
    { name: 'Custo Yang', major: 'Computer Science' },
    { name: 'Diane Yoon', major: 'Aerospace Engineering' },
    { name: 'Shana Chao', major: 'Computer Engineering' },
    { name: 'Elena Cheung', major: 'Mechanical Engineering', role: 'Vice-Regent' },
    { name: 'Keiko Yamamuro', major: 'Mechanical Engineering', role: 'Scribe' },
    {
      name: 'Lance Vu',
      major: 'Software Engineering',
      role: 'Co-Director of Professional Development',
    },
    { name: 'Luis Gama', major: 'Civil Engineering', role: 'Treasurer' },
  ],
  'Zeta Beta': [
    {
      name: 'Annie Tran',
      major: 'Civil Engineering',
      role: 'Director of Public Relations',
    },
    {
      name: 'Joseph de Leon',
      major: 'Data Science',
      role: 'Co-Director of Recruitment',
    },
    {
      name: 'Carol Wang',
      major: 'Computer Science',
      role: 'Co-Director of Professional Development',
    },
    { name: 'Dalena Nguyen', major: 'Computer Engineering' },
    {
      name: 'David Culciar',
      major: 'Computer Science and Engineering',
      role: 'Co-Director of Engineering',
    },
    { name: 'Ethan Choi', major: 'Mechanical Engineering', role: 'Co-Director of Brotherhood' },
    { name: 'Hannah Kim', major: 'Mechanical Engineering', role: 'Co-Director of Engineering' },
    { name: 'Jason Nguyen', major: 'Civil Engineering', role: 'Co-Director of Brotherhood' },
  ],
  'Eta Beta': [
    { name: 'Andrew Nguyen', major: 'Computer Engineering' },
    { name: 'Anna Coppola', major: 'Mechanical Engineering' },
    { name: 'Chloe Chow', major: 'Software Engineering' },
    { name: 'Ivy Lee', major: 'Aerospace Engineering', role: 'Co-Director of Fundraising' },
    { name: 'Jarrett Lim', major: 'Mechanical Engineering' },
    { name: 'Kaitlyn Takasawa', major: 'Civil Engineering' },
    { name: 'Samantha Huang', major: 'Civil Engineering' },
    { name: 'Truman Lindenthaler', major: 'Aerospace Engineering' },
  ],
  'Theta Beta': [
    { name: 'Akhil Nandhakumar', major: 'Aerospace Engineering' },
    { name: 'Allyson Lay', major: 'Computer Science and Engineering' },
    { name: 'Dalen Smith', major: 'Computer Science and Engineering' },
    { name: 'Elizabeth Yancey', major: 'Biomedical Engineering' },
    { name: 'Emma Shin', major: 'Engineering Undeclared' },
    { name: 'Harmeet Singh', major: 'Computer Science' },
    { name: 'Ival Momoh', major: 'Computer Engineering' },
    { name: 'Victoria Sun', major: 'Computer Science' },
  ],
  'Iota Beta': [
    { name: 'Andony Velasquez', major: 'Computer Science' },
    { name: 'Daniel Grivennikov', major: 'Aerospace Engineering' },
    { name: 'Dao Doan', major: 'Computer Engineering' },
    { name: 'Ethan Kim', major: 'Civil Engineering' },
    { name: 'James Kwon', major: 'Materials Science and Engineering' },
    { name: 'Jasmine Dhaliwal', major: 'Computer Science' },
    { name: 'Jordan Chan', major: 'Mechanical Engineering' },
    { name: 'Kiara Peters', major: 'Aerospace Engineering' },
    { name: 'Maxim Varakuta', major: 'Civil Engineering' },
    { name: 'Natalie Dai', major: 'Data Science' },
    { name: 'Norton Hoang', major: 'Electrical Engineering' },
  ],
};

// allBrothersWithAlumni, the full unified roster: current execs + officers +
// actives, plus every historical brother from memberClassRosters who isn't
// currently active (added with tier: 'alumni'). Current actives get their
// memberClass backfilled from the rosters when missing (so they're filterable
// by class). The Brothers explorer hides alumni by default; they surface
// when the user adds a class filter or an explicit alumni tier filter.
const _nameToClass = new Map<string, string>();
for (const [cls, members] of Object.entries(memberClassRosters)) {
  for (const m of members) {
    if (!_nameToClass.has(m.name)) _nameToClass.set(m.name, cls);
  }
}
// Two brothers in different classes can share a name (there is a Beta and a Pi
// Kevin Huynh, and an Eta Beta and a Theta Samantha Huang), so the "already an
// active" test and the per-brother identity are both keyed on name + class.
// Keying on name alone dropped the older namesake from the roster entirely.
const _memberId = (name: string, cls?: string) => `${cls ?? 'unclassed'}-${brotherKey(name)}`;
const _activeIds = new Set(
  allActives.map((b) => _memberId(b.name, b.memberClass ?? _nameToClass.get(b.name))),
);
export const allBrothersWithAlumni: Array<
  Active & { role?: string; tier: RosterTier; id: string }
> = [
  ...allActives.map((b) => {
    const memberClass = b.memberClass ?? _nameToClass.get(b.name);
    return { ...b, memberClass, id: _memberId(b.name, memberClass) };
  }),
  ...Object.entries(memberClassRosters).flatMap(([cls, members]) =>
    members
      .filter((m) => !_activeIds.has(_memberId(m.name, cls)))
      .map((m) => ({
        ...enrichBrother({
          name: m.name,
          major: m.major,
          role: m.role,
          memberClass: cls,
          tier: 'alumni' as const,
        }),
        id: _memberId(m.name, cls),
      })),
  ),
];

// Pi Delta founding fathers, the 2013 cohort that started the chapter at UCI.
// Order preserves the original three initiators followed by the nine who joined.
export const foundingFathers = [
  // Original three initiators.
  'Richard Staebler',
  'Arshitha Vaidhyanathan',
  'Jonathan Wong',
  // Nine who joined to round out the founding class.
  'Clever Tan',
  'Jacqueline Kim',
  'Sarah Leung',
  'Terence Leung',
  'Amy Nguyen',
  'Christopher Louie',
  'Dhivya Sridhar',
  'Jeffrey Go',
  'Jonathan Turcios',
];

// Pillar descriptions. Brotherhood is accurate general copy (chapter-specific text
// for it was not in the provided content); Professionalism and Service use the real
// chapter/official copy from the site.
export const pillars = [
  {
    title: 'Brotherhood',
    icon: 'brotherhood' as const,
    body: 'A close, supportive network of engineers who push each other to grow academically, professionally, and personally.',
  },
  {
    title: 'Professionalism',
    icon: 'professionalism' as const,
    body: 'We help our brothers develop strong communication, problem-solving, and leadership skills. Whether building professional basics or guiding each other through the job hunt, we prepare each other for the professional world.',
  },
  {
    title: 'Service',
    icon: 'service' as const,
    body: 'We are known for our service to our college, university, and the larger community. Our service projects create a unifying environment for learning and personal growth for our members.',
  },
];

export const testimonials: Testimonial[] = [
  {
    name: 'Jake Silverman',
    role: 'Marshal 2024-2025',
    memberClass: 'Gamma Beta Class',
    photo: '/images/testimonials/jake-silverman.jpg',
    quote:
      "Becoming a part of Theta Tau was the single best decision I've made throughout my time in college. Not only have I been able to grow immensely professionally and personally, but more importantly, I've made many lifelong friends and gone on countless adventures along the way. Everyone in Theta Tau is so hardworking, driven, and talented in their own unique ways, and being surrounded by these amazing people each and every day has inspired me to better myself and chase my own goals. There's truly no other community like ours at UC Irvine, and I'm grateful to be a part of it every single day.",
  },
  {
    name: 'Luke Vargas',
    role: 'Regent 2024-2025',
    memberClass: 'Gamma Beta Class',
    photo: '/images/testimonials/luke-vargas.jpg',
    quote:
      "Theta Tau is an amazing place, and is so much more than an organization. I have made many genuine, lifelong friends in this community. It can be easy to go through college just focusing on school and getting past our next assignment or exam, but the time I spend studying, working, eating, and having fun with the brothers of Theta Tau grounds me in the moment, and reminds me to appreciate my time in college. I'd spend an extra year in college just to be with these people longer if I could. We push each other, we mess around, and we get business done, and I am so thankful to lead these amazing people.",
  },
];

// Companies where Pi Delta alumni have worked. The live site only tracked
// employers for current brothers, so this stays empty for now (the marquee
// hides any strip with no real entries). Populate when alumni data is gathered.
export const alumniEmployers: string[] = [];

// Companies where Pi Delta actives currently work / intern, real employers
// pulled from the live site's roster (brother_info.js `company` field). Student
// project teams (Formula Racing, Rocket Project, etc.) are intentionally left
// off so this reads as a professional-placement showcase.
export const internEmployers: string[] = [
  'Qualcomm',
  'Medtronic',
  'General Atomics',
  'Morgan Stanley',
  'Johnson & Johnson',
  'Kaiser Permanente',
  'Optum',
  'Kiewit',
  'RailPros',
  'Tevora',
  'Tower Semiconductor',
  'Fabric8Labs',
];

// Fall 2026 Rush schedule. Dates below are carried over from the previous
// cycle as placeholders, update with the actual Fall 2026 schedule once
// it's set.
export const rushSchedule: RushEvent[] = [
  {
    date: '9/28',
    dress: 'Business Casual',
    name: 'Info Night',
    description: 'Meet the brothers and learn what Theta Tau is all about.',
    inviteOnly: false,
    time: '7–9 PM',
    location: 'ELH 100',
    startTime: '19:00',
    endTime: '21:00',
  },
  {
    date: '9/29',
    dress: 'Casual',
    name: 'E-Challenge',
    description:
      'Compete and work with other rushees in teams to build a small engineering project.',
    inviteOnly: false,
    time: '7–9 PM',
    location: 'ICS 259',
    startTime: '19:00',
    endTime: '21:00',
  },
  {
    date: '9/30',
    dress: 'Professional',
    name: 'Pro-Dev Night',
    description: 'Resume and career-building tips from alumni.',
    inviteOnly: false,
    time: '7–9 PM',
    location: 'ICS 259',
    startTime: '19:00',
    endTime: '21:00',
  },
  {
    date: '10/1',
    dress: 'Casual',
    name: 'BBQ Night',
    description: 'A casual night to hang out and get to know members.',
    inviteOnly: true,
    // Location invite-only; not published on the flyer.
    time: '7–9 PM',
    startTime: '19:00',
    endTime: '21:00',
  },
  {
    date: '10/2',
    dress: 'Formal',
    name: 'Interview Day',
    description: 'Formal interviews for prospective members.',
    inviteOnly: true,
    // Time TBD on the flyer, left unset so the schedule omits the time row and
    // the calendar entry stays all-day.
  },
];

export const recruitmentFaqs: Faq[] = [
  {
    q: 'What is Rush?',
    a: "Rush is a week-long event where you get to see what the fraternity is about and what it can offer you. It's a chance to get to know Theta Tau and its members and figure out if it's the right fit for you.",
  },
  {
    q: 'Why should I rush? What does Theta Tau offer?',
    a: 'Theta Tau gives engineering students a supportive place to grow, with professional development, academic support, and a community working toward the same goals. As a brother you get peers and alumni who are there for mentorship and for the ups and downs during and after college. If you want to grow as a leader, make real connections, and find your people, come out to rush.',
  },
  {
    q: 'Who is eligible to Rush?',
    a: 'Anyone can come out to Rush, but you must be an engineering, computer science, or data science major to join. Requirements include a cumulative 2.0 GPA minimum and roughly $200 in dues every two quarters (biannual).',
  },
  {
    q: 'How do I prepare for Rush?',
    a: 'Come with an open mind and be ready to meet lots of people, not just actives but fellow rushees too. It is recommended to prepare your resume and update your LinkedIn before Pro-Dev Night to get the best experience possible. It might get cold since rush can last a while, so bring a jacket.',
  },
  {
    q: "I don't have professional clothes, is that okay?",
    a: "Dress code is encouraged but not required. Wear what you can and don't feel pressured.",
  },
  {
    q: 'What is After Hours?',
    a: 'After Hours is the time period from when the event ends (around 9 PM) until midnight. After Hours is not required but encouraged so you can spend more time getting to know the brothers, their experience in Theta Tau, and building an overall stronger connection.',
  },
  {
    q: "What happens if I can't attend all the events or am not on time?",
    a: "While attending all events is often encouraged to fully engage with the fraternity and its members, it's understood that conflicts can occur. It's okay if you can't attend a specific event, but coming out, even if late, ultimately benefits you in building those connections and helps in potentially receiving an invite to join Theta Tau. It is not required to attend every open event to receive an invite.",
  },
  {
    q: 'What if I have more questions?',
    a: 'That is the perfect reason to come out to the Rush events. Ask the brothers of Theta Tau any and all questions, or contact one of the Rush Directors by email at rushthetatauuci@gmail.com or on Instagram @thetatauuci.',
  },
];

// Southwestern Region of Theta Tau.
export const regionalChapters: RegionalChapter[] = [
  { chapter: 'Chi Chapter', university: 'University of Arizona' },
  { chapter: 'Delta Gamma Chapter', university: 'Arizona State University' },
  { chapter: 'Epsilon Chapter', university: 'University of California, Berkeley' },
  { chapter: 'Epsilon Delta Chapter', university: 'University of California, San Diego' },
  { chapter: 'Kappa Epsilon Chapter', university: 'University of Southern California' },
  { chapter: 'Lambda Delta Chapter', university: 'University of the Pacific' },
  { chapter: 'Lambda Epsilon Chapter', university: 'University of San Diego' },
  { chapter: 'Mu Delta Chapter', university: 'University of California, Merced' },
  { chapter: 'Omicron Epsilon Chapter', university: 'Northern Arizona University' },
  { chapter: 'Omicron Gamma Chapter', university: 'University of California, Davis' },
  { chapter: 'Phi Epsilon', university: 'California State University, Fullerton' },
  {
    chapter: 'Pi Delta Chapter',
    university: 'University of California, Irvine',
    isThisChapter: true,
  },
  { chapter: 'Rho Delta Chapter', university: 'University of Nevada, Reno' },
  { chapter: 'Sigma Delta Chapter', university: 'University of California, Riverside' },
  { chapter: 'Sigma Epsilon Chapter', university: 'University of California, Santa Barbara' },
  { chapter: 'Upsilon Delta Chapter', university: 'University of California, Los Angeles' },
  { chapter: 'Upsilon Epsilon', university: 'Santa Clara University' },
  { chapter: 'Xi Epsilon Chapter', university: 'California State University, Long Beach' },
];

export const colonies: string[] = [
  'University of Nevada, Las Vegas Colony of Theta Tau',
  'University of Washington Colony',
];

export const contact = {
  email: 'ucithetatau@gmail.com',
  // Recruitment-specific inbox, rush questions and interest-form submissions
  // go here (monitored by the Rush chairs), not the general chapter email.
  rushEmail: 'rushthetatauuci@gmail.com',
  // The chapter's rush interest form on Google Forms, offered alongside the
  // on-page form for prospects who prefer it.
  rushInterestForm:
    'https://docs.google.com/forms/d/e/1FAIpQLSeHijziR_T7jiXalwmeIc525D6KcOGs9qCTTclNYqWC-iVFZw/viewform',
  instagram: 'https://www.instagram.com/thetatauuci/',
  facebook: 'https://www.facebook.com/thetatauuci/',
  website: 'https://www.thetatauuci.com/',
  national: 'https://thetatau.org/',
};
