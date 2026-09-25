import PageHero from '../components/PageHero.jsx';
import Portrait from '../components/Portrait.jsx';
import { Counter, Marquee, Reveal, SectionHeading } from '../components/motion.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { about, awards, clients, education, equipment, stats, techStack } from '../data/siteConfig.js';

export default function About() {
  usePageMeta('About', 'Ritik Karak — BCA graduate from Delhi who edits videos, builds React websites and runs Meta Ads.');
  return (
    <main>
      <PageHero eyebrow="About" title="Editor. Developer. Storyteller." orbColor="#00d4c8" />

      <section className="section section--flush">
        <div className="container about-grid">
          <div className="about-grid__media">
            <Portrait />
          </div>
          <div className="about-grid__copy">
            <h2 className="h-lg">{about.headline}</h2>
            {about.bio.map((p, i) => (
              <Reveal as="p" className="lead" delay={i * 0.06} key={i}>
                {p}
              </Reveal>
            ))}
            <div className="stats">
              {stats.map((s) => (
                <Reveal className="stat" key={s.label}>
                  <strong>
                    <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                  </strong>
                  <span>{s.label}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Marquee className="tools-marquee" items={techStack} speed={42} reverse />

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Toolkit" title="Gear & software" />
          <div className="equip">
            {equipment.map((g, i) => (
              <Reveal className="equip__card" key={g.group} delay={i * 0.07}>
                <h3>{g.group}</h3>
                <ul>
                  {g.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container split">
          <div>
            <SectionHeading eyebrow="Education" title="Where I learned the craft" />
            <Reveal className="edu">
              <p className="edu__date">{education.date}</p>
              <h3>{education.degree}</h3>
              <p className="edu__school">{education.school}</p>
              <ul className="bullets">
                {education.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div>
            <SectionHeading eyebrow="Recognition" title="Awards & certifications" />
            <ul className="awards">
              {awards.map((a, i) => (
                <Reveal as="li" key={a.title} delay={i * 0.06} y={20}>
                  <span className="awards__tag">{a.year}</span>
                  <span className="awards__title">{a.title}</span>
                  <span className="awards__detail">{a.detail}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {clients.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Trusted by" title="Clients I've worked with" />
            <div className="clients">
              {clients.map((c) => (
                <img key={c.name} src={c.logo} alt={c.name} loading="lazy" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container split split--center">
          <div>
            <SectionHeading eyebrow="Beyond the timeline" title="Personal projects & passions" />
            <Reveal as="p" className="lead">
              {about.passion}
            </Reveal>
          </div>
          <Reveal className="langs">
            <h3 className="h-sm">Languages</h3>
            <div className="chips">
              {about.languages.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
