import { useRef } from 'react';
import { OrbScene3D } from './Scene3D.jsx';
import { Reveal, SplitText } from './motion.jsx';

/** Shared inner-page header with optional 3D orb. */
export default function PageHero({ eyebrow, title, children, orbColor, orb = true }) {
  const ref = useRef(null);
  return (
    <header className="page-hero" ref={ref}>
      {orb && (
        <div className="page-hero__orb" aria-hidden="true">
          <OrbScene3D color={orbColor} eventSource={ref} />
        </div>
      )}
      <div className="container page-hero__inner">
        {eyebrow && (
          <Reveal as="p" className="eyebrow" y={12}>
            <span className="eyebrow__line" />
            {eyebrow}
          </Reveal>
        )}
        <SplitText as="h1" className="display display--lg" text={title} by="word" delay={0.15} stagger={0.07} />
        {children && (
          <Reveal as="div" className="page-hero__lead" delay={0.5}>
            {children}
          </Reveal>
        )}
      </div>
    </header>
  );
}
