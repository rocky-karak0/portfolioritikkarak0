import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useReady } from '../context.js';

const EASE = [0.2, 0.7, 0.1, 1];

/** Headline that reveals word-by-word / char-by-char with a masked slide-up. */
export function SplitText({ text, as: Tag = 'span', className = '', delay = 0, stagger = 0.028, by = 'char', inView = false }) {
  const MotionTag = motion[Tag];
  const ready = useReady();
  const words = text.split(' ');
  const trigger = inView
    ? { whileInView: 'show', viewport: { once: true, margin: '0px 0px -12% 0px' } }
    : { animate: ready ? 'show' : 'hidden' };
  const item = {
    hidden: { y: '115%', rotate: 5, opacity: 0 },
    show: { y: 0, rotate: 0, opacity: 1, transition: { duration: 0.85, ease: EASE } },
  };
  return (
    <MotionTag
      className={className}
      aria-label={text}
      initial="hidden"
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...trigger}
    >
      {words.map((w, wi) => (
        <span className="word" aria-hidden="true" key={`${w}-${wi}`}>
          {by === 'char' ? (
            [...w].map((ch, ci) => (
              <motion.span className="char" variants={item} key={ci}>
                {ch}
              </motion.span>
            ))
          ) : (
            <motion.span className="char" variants={item}>
              {w}
            </motion.span>
          )}
          {wi < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </MotionTag>
  );
}

/** Fade + rise on scroll. */
export function Reveal({ children, delay = 0, y = 32, className = '', as = 'div', ...rest }) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

/** Element gently pulls toward the cursor. */
export function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.span ref={ref} className={`magnetic ${className}`} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={reset}>
      {children}
    </motion.span>
  );
}

/** Number that counts up when scrolled into view. */
export function Counter({ value, prefix = '', suffix = '', duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, value, { duration, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {n}
      {suffix}
    </span>
  );
}

/** Infinite horizontal ticker. */
export function Marquee({ items, speed = 38, reverse = false, className = '', outline = false }) {
  const row = (
    <div className="marquee__row" aria-hidden="true">
      {items.map((t, i) => (
        <span className={`marquee__item ${outline && i % 2 ? 'is-outline' : ''}`} key={`${t}-${i}`}>
          {t}
          <i className="marquee__dot" />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee ${className}`} style={{ '--speed': `${speed}s`, '--dir': reverse ? 'reverse' : 'normal' }}>
      <div className="marquee__track">
        {row}
        {row}
      </div>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, children, align = 'left' }) {
  return (
    <header className={`section-heading section-heading--${align}`}>
      {eyebrow && (
        <Reveal as="p" className="eyebrow" y={14}>
          <span className="eyebrow__line" />
          {eyebrow}
        </Reveal>
      )}
      <SplitText as="h2" className="display display--md" text={title} by="word" inView stagger={0.06} />
      {children && (
        <Reveal as="p" className="section-heading__lead" delay={0.15}>
          {children}
        </Reveal>
      )}
    </header>
  );
}
