import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { Magnetic, Reveal, SectionHeading } from '../components/motion.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { services, workflow } from '../data/siteConfig.js';

function Spotlight({ children, className = '', delay = 0 }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <Reveal className={`spot ${className}`} delay={delay} onMouseMove={onMove}>
      {children}
    </Reveal>
  );
}

export default function Services() {
  usePageMeta('Services', 'Video editing, colour grading, motion graphics, sound design, web development and Meta Ads by Ritik Karak. Contact for a quote.');
  return (
    <main>
      <PageHero eyebrow="Services" title="How I can help" orbColor="#ffb347">
        <p>Freelance editing, motion, colour and web — pick one craft or bundle them for a single, consistent creative partner.</p>
      </PageHero>

      <section className="section section--flush">
        <div className="container svc-grid">
          {services.map((s, i) => (
            <Spotlight key={s.id} delay={(i % 3) * 0.07} className="svc-card">
              <span className="svc-card__num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <ul>
                {s.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              <span className="svc-card__price">Contact for quote</span>
            </Spotlight>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Process" title="From brief to final export" />
          <ol className="steps">
            {workflow.map((p, i) => (
              <Reveal as="li" key={p.step} delay={i * 0.08} className="steps__item">
                <span className="steps__num">{p.step}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section cta cta--compact">
        <div className="container">
          <Reveal as="h2" className="display display--md">
            Rates depend on scope, length and turnaround.
          </Reveal>
          <Reveal className="cta__row" delay={0.1}>
            <Magnetic strength={0.4}>
              <Link to="/contact" className="btn btn--solid btn--xl" data-cursor="view">
                Get a quote
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
