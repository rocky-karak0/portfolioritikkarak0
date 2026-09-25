import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PageHero from '../components/PageHero.jsx';
import { Magnetic, Reveal } from '../components/motion.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { sendContact } from '../lib/api.js';
import { budgets, projectTypes, site } from '../data/siteConfig.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const empty = { name: '', email: '', phone: '', projectType: '', budget: '', message: '', website: '' };

export default function Contact() {
  usePageMeta('Contact', 'Start a project with Ritik Karak — video editing, colour grading, motion graphics, websites and Meta Ads.');
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [serverMsg, setServerMsg] = useState('');

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (form.name.trim().length < 2) er.name = 'Please enter your name';
    if (!EMAIL_RE.test(form.email.trim())) er.email = 'Please enter a valid email';
    if (form.message.trim().length < 10) er.message = 'Tell me a bit more (at least 10 characters)';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    try {
      const res = await sendContact(form);
      setServerMsg(res.message);
      setStatus('sent');
      setForm(empty);
    } catch (err) {
      if (err.errors) setErrors(err.errors);
      setServerMsg(err.name === 'AbortError' ? 'The request timed out.' : err.message);
      setStatus('error');
    }
  };

  const socials = site.socials.filter((s) => s.url);

  return (
    <main>
      <PageHero eyebrow="Contact" title="Let's talk." orbColor="#ff3d8e">
        <p>Tell me about your project — I usually reply within a day.</p>
      </PageHero>

      <section className="section section--flush">
        <div className="container contact">
          <aside className="contact__info">
            <Reveal className="contact__block">
              <h3 className="h-sm">Availability</h3>
              <p className={`status ${site.availability.open ? 'is-open' : ''}`}>
                <i /> {site.availability.text}
              </p>
              <p className="muted">{site.availability.note}</p>
            </Reveal>

            <Reveal className="contact__block" delay={0.05}>
              <h3 className="h-sm">Direct</h3>
              <a className="contact__link" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <a className="contact__link" href={`tel:+${site.phoneRaw}`}>
                {site.phone}
              </a>
              <p className="muted">{site.location} · Remote-friendly</p>
              <Magnetic>
                <a className="btn btn--ghost" href={`https://wa.me/${site.phoneRaw}?text=${encodeURIComponent('Hi Ritik, I saw your portfolio and would like to discuss a project.')}`} target="_blank" rel="noreferrer">
                  Chat on WhatsApp
                </a>
              </Magnetic>
            </Reveal>

            <Reveal className="contact__block" delay={0.1}>
              <h3 className="h-sm">Representation</h3>
              <p className="muted">{site.representation}</p>
            </Reveal>

            {socials.length > 0 && (
              <Reveal className="contact__block" delay={0.15}>
                <h3 className="h-sm">Follow</h3>
                <div className="chips">
                  {socials.map((s) => (
                    <a key={s.label} href={s.url} target="_blank" rel="noreferrer noopener">
                      {s.label}
                    </a>
                  ))}
                </div>
              </Reveal>
            )}
          </aside>

          <Reveal className="contact__form-wrap" delay={0.1}>
            <AnimatePresence mode="wait">
              {status === 'sent' ? (
                <motion.div key="ok" className="form-success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} role="status">
                  <svg viewBox="0 0 52 52" className="form-success__tick" aria-hidden="true">
                    <circle cx="26" cy="26" r="24" />
                    <path d="M14 27l8 8 16-17" />
                  </svg>
                  <h3 className="h-lg">Message received</h3>
                  <p>{serverMsg}</p>
                  <button type="button" className="btn btn--ghost" onClick={() => setStatus('idle')}>
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" className="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="h-lg">Project inquiry</h2>

                  <div className="form__row">
                    <label className={`field ${errors.name ? 'has-error' : ''}`}>
                      <span>Name *</span>
                      <input value={form.name} onChange={set('name')} autoComplete="name" placeholder="Your name" />
                      {errors.name && <em>{errors.name}</em>}
                    </label>
                    <label className={`field ${errors.email ? 'has-error' : ''}`}>
                      <span>Email *</span>
                      <input type="email" value={form.email} onChange={set('email')} autoComplete="email" placeholder="you@company.com" />
                      {errors.email && <em>{errors.email}</em>}
                    </label>
                  </div>

                  <label className="field">
                    <span>Phone / WhatsApp</span>
                    <input type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" placeholder="Optional" />
                  </label>

                  <fieldset className="field">
                    <span>What do you need?</span>
                    <div className="chips chips--select">
                      {projectTypes.map((t) => (
                        <button
                          type="button"
                          key={t}
                          className={form.projectType === t ? 'is-active' : ''}
                          aria-pressed={form.projectType === t}
                          onClick={() => setForm((f) => ({ ...f, projectType: f.projectType === t ? '' : t }))}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <label className="field">
                    <span>Budget</span>
                    <select value={form.budget} onChange={set('budget')}>
                      <option value="">Select a range (optional)</option>
                      {budgets.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </label>

                  <label className={`field ${errors.message ? 'has-error' : ''}`}>
                    <span>Project details *</span>
                    <textarea rows={5} value={form.message} onChange={set('message')} placeholder="Goals, length, deadline, references…" />
                    {errors.message && <em>{errors.message}</em>}
                  </label>

                  {/* honeypot — hidden from humans, bots fill it */}
                  <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={form.website} onChange={set('website')} />

                  {status === 'error' && (
                    <p className="form__error" role="alert">
                      {serverMsg || 'Something went wrong.'} You can also email me at {site.email}.
                    </p>
                  )}

                  <Magnetic>
                    <button type="submit" className="btn btn--solid btn--lg" disabled={status === 'sending'} data-cursor="hover">
                      {status === 'sending' ? 'Sending…' : 'Send inquiry'}
                    </button>
                  </Magnetic>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
