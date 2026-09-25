import nodemailer from 'nodemailer';
import Inquiry from '../models/Inquiry.js';
import { isDbReady } from '../config/db.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function createInquiry(req, res, next) {
  try {
    const { name, email, phone = '', projectType = '', budget = '', message, website } = req.body || {};

    // Honeypot: real users never fill the hidden "website" field.
    if (website) return res.status(201).json({ ok: true, message: 'Thanks!' });

    const errors = {};
    if (!name || String(name).trim().length < 2) errors.name = 'Please enter your name';
    if (!email || !EMAIL_RE.test(String(email).trim())) errors.email = 'Please enter a valid email';
    if (!message || String(message).trim().length < 10) errors.message = 'Tell me a bit more (min 10 characters)';
    if (Object.keys(errors).length) return res.status(422).json({ ok: false, message: 'Validation failed', errors });

    const payload = {
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      projectType: String(projectType).trim(),
      budget: String(budget).trim(),
      message: String(message).trim(),
      ip: req.ip,
    };

    if (isDbReady()) await Inquiry.create(payload);
    else console.log('[contact] (no db) inquiry received:', { ...payload, message: payload.message.slice(0, 80) });

    const transport = getTransport();
    if (transport) {
      try {
        await transport.sendMail({
          from: `"Portfolio" <${process.env.SMTP_USER}>`,
          to: process.env.CONTACT_TO || process.env.SMTP_USER,
          replyTo: payload.email,
          subject: `New project inquiry from ${payload.name}`,
          html: `<h3>New inquiry</h3>
            <p><b>Name:</b> ${esc(payload.name)}<br/><b>Email:</b> ${esc(payload.email)}<br/>
            <b>Phone:</b> ${esc(payload.phone)}<br/><b>Type:</b> ${esc(payload.projectType)}<br/>
            <b>Budget:</b> ${esc(payload.budget)}</p><p>${esc(payload.message).replace(/\n/g, '<br/>')}</p>`,
        });
      } catch (mailErr) {
        // Inquiry is already stored — don't fail the request because email failed.
        console.error('[contact] email failed:', mailErr.message);
      }
    }

    res.status(201).json({ ok: true, message: "Thanks! Your message is in — I'll reply within 24 hours." });
  } catch (err) {
    next(err);
  }
}
