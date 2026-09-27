// Chapter projects archive. The chapter runs a yearly engineering project
// in addition to one-off builds; both are surfaced on /projects. Populate
// with the chapter's real work. `currentProject` is still flagged
// `placeholder: true` until a real project lands; its copy is written as
// visitor-facing text (not editor instructions) because /projects renders
// it verbatim.

export interface ChapterProject {
  name: string;
  /** Academic year string, e.g. "2024–2025". */
  year: string;
  /** Sortable ISO date for ordering, pick a reasonable anchor like the
   *  start of the academic year (YYYY-09-01). */
  isoYear?: string;
  /** Short tagline rendered in the card. */
  tagline: string;
  /** Long description of what the project did, what was built, what was
   *  learned. Renders inside the detail panel. */
  description: string;
  /** Tag-style tech / discipline labels (e.g. "Arduino", "CAD", "Service"). */
  tags?: string[];
  /** Optional team size or list of contributors. */
  team?: string;
  /** Optional photo path under /public. */
  photo?: string;
  /** Optional external link, write-up, video, GitHub repo, etc. */
  link?: string;
  /** Optional outcomes (e.g. award won, recipients served, presentation). */
  outcomes?: string[];
  /** Flag this entry as a placeholder so the rendering layer can dim it
   *  until a real entry replaces it. */
  placeholder?: boolean;
}

// Featured project, the current yearly engineering project. Surfaced at
// the top of /projects as a hero card. Set placeholder: true until a real
// project name + description lands.
export const currentProject: ChapterProject = {
  name: "This year's chapter engineering project",
  year: '2025–2026',
  tagline: "Details go up once this year's project is underway.",
  description:
    'The chapter picks one engineering project each year and builds it together. What gets built, who leads it, and how it turns out lands here once the project is underway.',
  placeholder: true,
};

// Past projects archive, sorted newest to oldest by isoYear when rendered.
// Add one entry per academic year as the chapter completes its yearly
// engineering project (plus any notable one-off builds).
// Empty until a real write-up exists: /projects renders an honest "archive
// is loading" empty state for an empty array, which beats shipping a sample
// entry as visible copy.
export const pastProjects: ChapterProject[] = [];
