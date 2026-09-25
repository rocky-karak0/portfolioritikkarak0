import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PageHero from '../components/PageHero.jsx';
import FilterTabs from '../components/FilterTabs.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import useProjects from '../hooks/useProjects.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { categories } from '../data/projects.js';

export default function Work() {
  usePageMeta('Work', 'Commercials, music videos, documentaries, narrative films, corporate and social content edited by Ritik Karak.');
  const projects = useProjects();
  const [cat, setCat] = useState('All');

  const list = useMemo(() => (cat === 'All' ? projects : projects.filter((p) => p.category === cat)), [projects, cat]);
  const counts = useMemo(() => {
    const c = { All: projects.length };
    projects.forEach((p) => {
      c[p.category] = (c[p.category] || 0) + 1;
    });
    return c;
  }, [projects]);

  return (
    <main>
      <PageHero eyebrow="Portfolio" title="Selected work" orbColor="#ff3d2e">
        <p>Commercials, music videos, documentaries, narrative and social — hover to preview, click to watch in the lightbox.</p>
      </PageHero>

      <section className="section section--flush">
        <div className="container">
          <FilterTabs id="work" tabs={categories} value={cat} onChange={setCat} counts={counts} />
          <motion.div layout className="grid grid--work">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
          {list.length === 0 && <p className="empty">No projects in this category yet.</p>}
        </div>
      </section>
    </main>
  );
}
