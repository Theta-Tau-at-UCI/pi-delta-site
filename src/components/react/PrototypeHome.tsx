// PrototypeHome, a restrained, scale.com-style proof of concept for the revamp
// (see docs/REVAMP-BRIEF.md). One React island so the whole page shares one
// motion system (ScaleMotion) and one spring feel. Deliberately stripped back:
// near-black canvas, one accent, big type, lots of air, and motion that is tied
// to scroll rather than a pile of one-off effects.
import { Rise, Parallax, PinnedRow } from './ScaleMotion';

const PILLARS = [
  {
    n: '01',
    title: 'Brotherhood',
    body: 'A network of engineers who push each other to grow, in the lab, on the job, and long after graduation.',
  },
  {
    n: '02',
    title: 'Professionalism',
    body: 'Resume nights, mock interviews, and alumni in industry. We show up ready and help each other get there.',
  },
  {
    n: '03',
    title: 'Service',
    body: 'Engineering pointed outward, projects and volunteering that put our skills to work for the community.',
  },
];

const STATS = [
  { value: '49', label: 'Active brothers' },
  { value: '30', label: 'Classes of lineage' },
  { value: '2013', label: 'Founded at UC Irvine' },
];

export default function PrototypeHome() {
  return (
    <main className="pt-page">
      {/* HERO, restraint: one line, one accent, enormous type, air. */}
      <section className="pt-hero">
        <Parallax speed={0.4} className="pt-hero__glow">
          <span aria-hidden="true" />
        </Parallax>
        <div className="pt-hero__inner">
          <p className="pt-eyebrow">Theta Tau · Pi Delta · UC Irvine</p>
          <h1 className="pt-h1">
            The professional
            <br />
            engineering fraternity.
          </h1>
          <p className="pt-lead">
            Brotherhood, professionalism, and service, built by engineers, at UC Irvine since 2013.
          </p>
          <div className="pt-hero__cue" aria-hidden="true">
            Scroll
          </div>
        </div>
      </section>

      {/* STATEMENT, big lines that rise with scroll, one idea at a time. */}
      <section className="pt-section pt-statement">
        <Rise as="span" className="pt-statement__line">
          We&rsquo;re not a study group.
        </Rise>
        <Rise as="span" className="pt-statement__line pt-statement__line--muted">
          We&rsquo;re the people you build with.
        </Rise>
      </section>

      {/* PILLARS, signature horizontal pinned sequence. */}
      <PinnedRow className="pt-pinned">
        <div className="pt-pinned__intro">
          <p className="pt-eyebrow">What we&rsquo;re built on</p>
          <p className="pt-pinned__lead">Three pillars, one chapter.</p>
        </div>
        {PILLARS.map((p) => (
          <article className="pt-panel" key={p.n}>
            <span className="pt-panel__num">{p.n}</span>
            <h2 className="pt-panel__title">{p.title}</h2>
            <p className="pt-panel__body">{p.body}</p>
          </article>
        ))}
      </PinnedRow>

      {/* STATS, quiet numbers, same rise system. */}
      <section className="pt-section pt-stats">
        {STATS.map((s) => (
          <Rise className="pt-stat" key={s.label}>
            <span className="pt-stat__value">{s.value}</span>
            <span className="pt-stat__label">{s.label}</span>
          </Rise>
        ))}
      </section>

      {/* CTA, restrained close. */}
      <section className="pt-section pt-cta">
        <Rise>
          <h2 className="pt-cta__title">Considering Theta Tau?</h2>
          <p className="pt-cta__body">
            Rush happens every fall and spring. Come meet the brothers and see if it&rsquo;s the
            right fit.
          </p>
          <a className="pt-cta__btn" href="/recruitment">
            Rush Theta Tau →
          </a>
        </Rise>
      </section>

      <footer className="pt-foot">
        <span>Prototype · scale.com-style motion direction</span>
        <a href="/">← Current site</a>
      </footer>
    </main>
  );
}
