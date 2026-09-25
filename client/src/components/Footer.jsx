import { Link } from 'react-router-dom';
import { nav, site } from '../data/siteConfig.js';
import { Marquee, Magnetic } from './motion.jsx';
import { useLenis } from '../hooks/useLenis.jsx';

export default function Footer() {
  const lenis = useLenis();
  const socials = site.socials.filter((s) => s.url);
  const toTop = () => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: 'smooth' }));

  return (
    <footer className="footer">
      <Marquee className="footer__marquee" items={["Let's work together", 'Edits that hit', 'Websites that convert', 'Stories in motion']} speed={45} outline />
      <div className="footer__inner">
        <div className="footer__cta">
          <p className="eyebrow">
            <span className="eyebrow__line" /> Have a project in mind?
          </p>
          <Magnetic strength={0.25}>
            <a className="footer__mail" href={`mailto:${site.email}`} data-cursor="view">
              {site.email}
            </a>
          </Magnetic>
        </div>

        <div className="footer__cols">
          <div>
            <h4>Navigate</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              {nav.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Connect</h4>
            <ul>
              <li>
                <a href={`mailto:${site.email}`}>Email</a>
              </li>
              <li>
                <a href={`https://wa.me/${site.phoneRaw}`} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`tel:+${site.phoneRaw}`}>{site.phone}</a>
              </li>
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.url} target="_blank" rel="noreferrer noopener">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Status</h4>
            <p className={`status ${site.availability.open ? 'is-open' : ''}`}>
              <i /> {site.availability.text}
            </p>
            <p className="footer__small">{site.location} · Remote-friendly</p>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </span>
          <button type="button" className="footer__top" onClick={toTop} data-cursor="hover">
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
