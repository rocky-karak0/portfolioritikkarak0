import Project from '../models/Project.js';
import { isDbReady } from '../config/db.js';
import seedProjects from '../data/projects.js';

/** Returns DB projects when available, otherwise the bundled data file. */
async function loadAll() {
  if (isDbReady()) {
    const docs = await Project.find().sort({ order: 1, year: -1 }).lean();
    if (docs.length) return docs;
  }
  return seedProjects;
}

export async function listProjects(req, res, next) {
  try {
    const { category, featured } = req.query;
    let projects = await loadAll();
    if (category && category !== 'All') projects = projects.filter((p) => p.category === category);
    if (featured === 'true') projects = projects.filter((p) => p.featured);
    res.json({ ok: true, count: projects.length, projects });
  } catch (err) {
    next(err);
  }
}

export async function getProject(req, res, next) {
  try {
    const projects = await loadAll();
    const project = projects.find((p) => p.slug === req.params.slug);
    if (!project) return res.status(404).json({ ok: false, message: 'Project not found' });
    const related = projects
      .filter((p) => p.slug !== project.slug)
      .sort((a, b) => Number(b.category === project.category) - Number(a.category === project.category))
      .slice(0, 3);
    res.json({ ok: true, project, related });
  } catch (err) {
    next(err);
  }
}
