import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { site } from '../data/siteConfig.js';

/** Film-leader style intro: counter 000 → 100, then a curtain lift. */
export default function Preloader({ onDone }) {
  const [n, setN] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const dur = 1700;
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setLeaving(true), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      className="preloader"
      initial={{ y: 0 }}
      animate={leaving ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => leaving && onDone()}
    >
      <div className="preloader__top">
        <span>
          <i className="rec-dot" /> REC
        </span>
        <span>{site.location.toUpperCase()}</span>
      </div>
      <div className="preloader__center">
        <div className="preloader__ring">
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="92" className="preloader__track" />
            <circle
              cx="100"
              cy="100"
              r="92"
              className="preloader__bar"
              style={{ strokeDasharray: 578, strokeDashoffset: 578 - (578 * n) / 100 }}
            />
          </svg>
          <span className="preloader__num">{String(n).padStart(3, '0')}</span>
        </div>
        <p className="preloader__name">{site.name}</p>
        <p className="preloader__role">Loading the reel…</p>
      </div>
      <div className="preloader__bottom">
        <span>Video Editor</span>
        <span>Web Developer</span>
        <span>Meta Ads</span>
      </div>
    </motion.div>
  );
}
