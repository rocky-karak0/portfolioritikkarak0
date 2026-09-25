import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { nav, site } from '../data/siteConfig.js';
import { Magnetic } from './motion.jsx';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      setHidden(y > last && y > 240);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    return () => document.documentElement.classList.remove('menu-open');
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${hidden && !open ? 'is-hidden' : ''}`}>
        <Link to="/" className="nav__logo" aria-label={`${site.name} — home`}>
          <span className="nav__mark">{site.shortName}</span>
          <span className="nav__name">{site.name}</span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {nav.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__right">
          <span className={`status status--nav ${site.availability.open ? 'is-open' : ''}`}>
            <i /> {site.availability.open ? 'Available' : 'Booked'}
          </span>
          <Magnetic>
            <Link to="/contact" className="btn btn--sm btn--solid">
              Hire me
            </Link>
          </Magnetic>
          <button
            type="button"
            className={`burger ${open ? 'is-open' : ''}`}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 42px) 38px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 42px) 38px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 42px) 38px)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="menu__nav" aria-label="Mobile">
              {[{ label: 'Home', to: '/' }, ...nav].map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: [0.2, 0.7, 0.1, 1] }}
                >
                  <NavLink to={l.to} className="menu__link" end={l.to === '/'}>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="menu__foot">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={`tel:+${site.phoneRaw}`}>{site.phone}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
