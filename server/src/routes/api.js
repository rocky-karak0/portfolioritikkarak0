import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { listProjects, getProject } from '../controllers/projectController.js';
import { createInquiry } from '../controllers/contactController.js';
import { isDbReady } from '../config/db.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Too many messages — please try again in a few minutes.' },
});

router.get('/health', (req, res) =>
  res.json({ ok: true, uptime: process.uptime(), db: isDbReady() ? 'connected' : 'file-data mode' })
);
router.get('/projects', listProjects);
router.get('/projects/:slug', getProject);
router.post('/contact', contactLimiter, createInquiry);

export default router;
