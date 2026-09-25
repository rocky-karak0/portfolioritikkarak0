import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PageHero from '../components/PageHero.jsx';
import VideoPlayer from '../components/VideoPlayer.jsx';
import { Reveal } from '../components/motion.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { showreels } from '../data/siteConfig.js';

export default function Showreel() {
  usePageMeta('Showreel', 'The full editing reel by Ritik Karak, with breakdowns by category: commercial, documentary, music video and narrative.');
  const [active, setActive] = useState(showreels[0]);

  return (
    <main>
      <PageHero eyebrow="Reel" title="The showreel" orbColor="#b14bff">
        <p>Press play on the full reel, or jump straight to a category breakdown.</p>
      </PageHero>

      <section className="section section--flush">
        <div className="container">
          <Reveal className="showreel__stage" y={40}>
            <VideoPlayer
              key={active.id}
              url={active.url}
              title={`${active.label} reel`}
              gradient={active.gradient}
              poster={active.poster}
              previewUrl={active.previewUrl}
              className="player--cinema"
            />
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              className="showreel__caption"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="h-sm">{active.label} reel</h2>
              <p>{active.blurb}</p>
            </motion.div>
          </AnimatePresence>

          <div className="reel-tabs" role="tablist" aria-label="Reel categories">
            {showreels.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.05} y={20}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={active.id === r.id}
                  className={`reel-tab ${active.id === r.id ? 'is-active' : ''}`}
                  onClick={() => setActive(r)}
                  style={{ '--c1': r.gradient[0], '--c2': r.gradient[1] }}
                  data-cursor="hover"
                >
                  <span className="reel-tab__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="reel-tab__label">{r.label}</span>
                  <span className="reel-tab__blurb">{r.blurb}</span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
