import staticProjects from '../data/projects.js';

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(`${BASE}/api${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.message || `Request failed (${res.status})`);
      err.errors = data.errors;
      err.status = res.status;
      throw err;
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

/** Projects: API first, bundled data as fallback (site keeps working without a backend). */
export async function fetchProjects() {
  try {
    const data = await request('/projects');
    return data.projects?.length ? data.projects : staticProjects;
  } catch {
    return staticProjects;
  }
}

export async function fetchProject(slug) {
  try {
    const data = await request(`/projects/${slug}`);
    return { project: data.project, related: data.related };
  } catch {
    const project = staticProjects.find((p) => p.slug === slug) || null;
    const related = staticProjects
      .filter((p) => p.slug !== slug)
      .sort((a, b) => Number(b.category === project?.category) - Number(a.category === project?.category))
      .slice(0, 3);
    return { project, related };
  }
}

export function sendContact(payload) {
  return request('/contact', { method: 'POST', body: JSON.stringify(payload) }, 12000);
}
