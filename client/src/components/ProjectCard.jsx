import { forwardRef, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { posterGradient } from '../lib/video.js';
import { useCoarsePointer } from '../hooks/useMedia.js';
import { useReel } from '../context.js';

/** Thumbnail card: muted preview on hover (desktop) / in-view (touch); click opens the lightbox. */
const ProjectCard = forwardRef(function ProjectCard({ project, index = 0, variant = 'default' }, ref) {
  const { title, category, client, role, year, poster, previewUrl, videoUrl, gradient } = project;
  const reel = useReel();
  const vid = useRef(null);
  const card = useRef(null);
  const coarse = useCoarsePointer();

  // 3D tilt
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 180, damping: 18 });
  const glowX = useTransform(mx, (v) => `${v * 100}%`);
  const glowY = useTransform(my, (v) => `${v * 100}%`);

  const play = () => {
    const el = vid.current;
    if (!el || !previewUrl) return;
    if (!el.getAttribute('src')) el.setAttribute('src', previewUrl);
    el.play().catch(() => {});
  };
  const stop = () => {
    const el = vid.current;
    if (!el) return;
    el.pause();
    if (!coarse) el.currentTime = 0;
  };

  // Touch devices: no hover, so play while the card is mostly on screen.
  useEffect(() => {
    if (!coarse || !card.current || !previewUrl) return undefined;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : stop()), { threshold: 0.65 });
    io.observe(card.current);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coarse, previewUrl]);

  const onMove = (e) => {
    if (coarse) return;
    const r = card.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    stop();
  };

  const openLightbox = (e) => {
    e.preventDefault();
    stop();
    reel.open({ url: videoUrl, title, gradient, poster, previewUrl });
  };

  return (
    <motion.article
      ref={ref}
      layout
      className={`card card--${variant}`}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.22, delay: 0 } }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.2, 0.7, 0.1, 1] }}
    >
      <button type="button" className="card__link" data-cursor="play" aria-label={`${title} — ${category}`} onClick={openLightbox}>
        <motion.div
          ref={card}
          className="card__thumb"
          style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
          onMouseEnter={play}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <span className="card__art" style={{ backgroundImage: poster ? `url(${poster})` : posterGradient(gradient) }} />
          {poster && <img className="card__poster" src={poster} alt="" loading="lazy" decoding="async" />}
          <video ref={vid} className="card__video" muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />
          <motion.span className="card__glow" style={{ left: glowX, top: glowY }} />
          <span className="card__shade" />
          <span className="card__chip">{category}</span>
          <span className="card__play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.9-6.86a1 1 0 0 0 0-1.7L9.53 4.3A1 1 0 0 0 8 5.14z" />
            </svg>
          </span>
          <span className="card__index">{String(index + 1).padStart(2, '0')}</span>
        </motion.div>
        <div className="card__meta">
          <h3 className="card__title">{title}</h3>
          <p className="card__sub">
            {client} <i>·</i> {role}
          </p>
          <span className="card__year">{year}</span>
        </div>
      </button>
    </motion.article>
  );
});

export default ProjectCard;
