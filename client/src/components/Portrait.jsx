import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { site } from '../data/siteConfig.js';

/**
 * Portrait with 3D tilt. Shows /images/ritik.jpg when present,
 * otherwise an animated monogram so the layout never looks broken.
 */
export default function Portrait({ className = '' }) {
  const [failed, setFailed] = useState(false);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 160, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 160, damping: 18 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.figure
      className={`portrait ${className}`}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      <div className="portrait__frame">
        {!failed ? (
          <img src={site.portrait} alt={`${site.name} portrait`} loading="lazy" onError={() => setFailed(true)} />
        ) : (
          <div className="portrait__mono" aria-label={`${site.name} monogram`}>
            <span>{site.shortName}</span>
            <small>Add your photo → client/public/images/ritik.jpg</small>
          </div>
        )}
        <span className="portrait__corner portrait__corner--tl" />
        <span className="portrait__corner portrait__corner--tr" />
        <span className="portrait__corner portrait__corner--bl" />
        <span className="portrait__corner portrait__corner--br" />
      </div>
      <figcaption className="portrait__cap">
        <i className="rec-dot" /> {site.name} · {site.location}
      </figcaption>
    </motion.figure>
  );
}
