import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroScene3D } from '../components/Scene3D.jsx';
import { Counter, Magnetic, Marquee, Reveal, SectionHeading, SplitText } from '../components/motion.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import FilterTabs from '../components/FilterTabs.jsx';
import VideoPlayer from '../components/VideoPlayer.jsx';
import Portrait from '../components/Portrait.jsx';
import useProjects from '../hooks/useProjects.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { useIsMobile } from '../hooks/useMedia.js';
import { useReel } from '../context.js';
import { categories } from '../data/projects.js';
import { about, services, site, stats, techStack } from '../data/siteConfig.js';

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------- HERO */

function useTimecode() {
  const [tc, setTc] = useState('00:00:00:00');
  useEffect(() => {
    const t0 = performance.now();
    const id = setInterval(() => {
      const ms = performance.now() - t0;
      const f = Math.floor((ms / 1000) * 24) % 24;
      const s = Math.floor(ms / 1000) % 60;
      const m = Math.floor(ms / 60000) % 60;
      const h = Math.floor(ms / 3600000);
      const p = (n) => String(n).padStart(2, '0');
      setTc(`${p(h)}:${p(m)}:${p(s)}:${p(f)}`);
    }, 80);
    return () => clearInterval(id);
  }, []);
  return tc;
}

function Hero() {
  const reel = useReel();
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const [active, setActive] = useState(true);
  const tc = useTimecode();

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.02 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section className="hero" ref={ref}>
      <div className="hero__bg">
        {site.heroVideo && (
          <video className="hero__video" src={site.heroVideo} autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
        )}
        <div className="hero__scrim" />
        <div className="hero__scene">
          <HeroScene3D active={active} isWide={!isMobile} eventSource={ref} />
        </div>
        <div className="hero__vignette" />
      </div>

      <div className="hero__hud" aria-hidden="true">
        <span>
          <i className="rec-dot" /> REC
        </span>
        <span className="hero__tc">{tc}</span>
        <span className="hide-sm">4K · 24 FPS</span>
        <span className="hide-sm">{site.location.toUpperCase()}</span>
      </div>

      <motion.div className="hero__content" style={{ y: contentY, opacity: contentOpacity }}>
        <Reveal as="p" className="hero__role" y={16} delay={0.2}>
          {site.role}
        </Reveal>
        <h1 className="hero__title" aria-label={site.name}>
          <SplitText as="span" className="hero__line" text="RITIK" delay={0.35} stagger={0.05} />
          <SplitText as="span" className="hero__line hero__line--outline" text="KARAK" delay={0.6} stagger={0.05} />
        </h1>
        <Reveal as="p" className="hero__tagline" y={20} delay={1.0}>
          {site.tagline}
        </Reveal>
        <Reveal className="hero__cta" y={20} delay={1.15}>
          <Magnetic>
            <button type="button" className="btn btn--solid btn--lg" onClick={() => reel.open()} data-cursor="play">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.9-6.86a1 1 0 0 0 0-1.7L9.53 4.3A1 1 0 0 0 8 5.14z" />
              </svg>
              Watch Reel
            </button>
          </Magnetic>
          <Link to="/work" className="btn btn--ghost btn--lg">
            View my work
          </Link>
        </Reveal>
      </motion.div>

      <div className="hero__scroll" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>

      <div className={`status hero__status ${site.availability.open ? 'is-open' : ''}`}>
        <i /> {site.availability.text}
      </div>
    </section>
  );
}

/* -------------------------------------------------- SELECTED WORK */

function SelectedWork() {
  const projects = useProjects();
  const [cat, setCat] = useState('All');

  const list = useMemo(() => {
    const filtered = cat === 'All' ? [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)) : projects.filter((p) => p.category === cat);
    return filtered.slice(0, 6);
  }, [projects, cat]);

  const counts = useMemo(() => {
    const c = { All: projects.length };
    projects.forEach((p) => {
      c[p.category] = (c[p.category] || 0) + 1;
    });
    return c;
  }, [projects]);

  return (
    <section className="section" id="work">
      <div className="container">
        <SectionHeading eyebrow="Selected work" title="Frames I'm proud of">
          Hover a thumbnail to preview it, click to watch the full cut.
        </SectionHeading>
        <Reveal>
          <FilterTabs id="home" tabs={categories} value={cat} onChange={setCat} counts={counts} />
        </Reveal>
        <motion.div layout className="grid grid--work">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
        {list.length === 0 && <p className="empty">Nothing here yet — check back soon.</p>}
        <Reveal className="section__cta">
          <Magnetic>
            <Link to="/work" className="btn btn--ghost btn--lg" data-cursor="view">
              View all projects <span aria-hidden="true">→</span>
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------- SHOWREEL TEASER (scroll-scrubbed) */

function ReelTeaser() {
  const wrap = useRef(null);
  const frame = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        frame.current,
        { scale: 0.7, borderRadius: 40, y: 60 },
        {
          scale: 1,
          borderRadius: 10,
          y: 0,
          ease: 'none',
          scrollTrigger: { trigger: wrap.current, start: 'top 90%', end: 'top 20%', scrub: 0.6 },
        }
      );
      gsap.to('.reel-teaser__ghost--a', {
        xPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: wrap.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      gsap.to('.reel-teaser__ghost--b', {
        xPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: wrap.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section className="reel-teaser" ref={wrap}>
      <div className="reel-teaser__ghosts" aria-hidden="true">
        <span className="reel-teaser__ghost reel-teaser__ghost--a">SHOWREEL — SHOWREEL — SHOWREEL</span>
        <span className="reel-teaser__ghost reel-teaser__ghost--b">2026 — 2026 — 2026 — 2026 — 2026</span>
      </div>
      <div className="container reel-teaser__inner">
        <div ref={frame} className="reel-teaser__frame">
          <VideoPlayer
            url={site.showreelUrl}
            title="Watch the full showreel"
            poster={site.showreelPoster}
            previewUrl={site.showreelPreview}
            gradient={['#ff3d2e', '#2a1b6e']}
          />
        </div>
        <div className="reel-teaser__foot">
          <Link to="/showreel" className="link-arrow" data-cursor="view">
            All reels by category <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------- SERVICES */

function ServicesTeaser() {
  const [hover, setHover] = useState(null);
  return (
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow="What I do" title="One creative, many crafts" />
        <ul className="svc-list">
          {services.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 0.05} className={`svc-row ${hover === s.id ? 'is-hover' : ''}`} onMouseEnter={() => setHover(s.id)} onMouseLeave={() => setHover(null)}>
              <Link to="/services" className="svc-row__link" data-cursor="view">
                <span className="svc-row__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="svc-row__title">{s.title}</span>
                <span className="svc-row__desc">{s.desc}</span>
                <span className="svc-row__arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------- ABOUT TEASER */

function AboutTeaser() {
  return (
    <section className="section section--tint">
      <div className="container about-teaser">
        <div className="about-teaser__media">
          <Portrait />
        </div>
        <div className="about-teaser__copy">
          <SectionHeading eyebrow="About" title={about.headline} />
          <Reveal as="p" className="lead" delay={0.1}>
            {about.bio[0]}
          </Reveal>
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
          <Reveal>
            <Link to="/about" className="link-arrow" data-cursor="view">
              More about me <span>→</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------- CTA */

function BigCTA() {
  return (
    <section className="section cta">
      <div className="container">
        <SplitText as="h2" className="display display--xl" text="Let's make something unforgettable." by="word" inView stagger={0.08} />
        <Reveal className="cta__row" delay={0.2}>
          <Magnetic strength={0.4}>
            <Link to="/contact" className="btn btn--solid btn--xl" data-cursor="view">
              Start a project
            </Link>
          </Magnetic>
          <a className="cta__mail" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  usePageMeta('', 'Ritik Karak — Delhi-based video editor, motion designer and full-stack web developer. Cinematic edits, colour grading, Meta Ads creatives and fast React websites.');
  return (
    <main>
      <Hero />
      <Marquee className="tools-marquee" items={techStack} speed={40} />
      <SelectedWork />
      <ReelTeaser />
      <ServicesTeaser />
      <AboutTeaser />
      <BigCTA />
    </main>
  );
}
