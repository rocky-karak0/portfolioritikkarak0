import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Reveal, SplitText } from '../components/motion.jsx';
import VideoPlayer from '../components/VideoPlayer.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { fetchProject } from '../lib/api.js';

const dash = (v) => (v && v !== '—' ? v : null);

export default function Project() {
  const { slug } = useParams();
  const [data, setData] = useState({ loading: true, project: null, related: [] });

  useEffect(() => {
    let alive = true;
    setData({ loading: true, project: null, related: [] });
    fetchProject(slug).then((res) => alive && setData({ loading: false, ...res }));
    return () => {
      alive = false;
    };
  }, [slug]);

  const { project, related, loading } = data;
  usePageMeta(project?.title || 'Project', project?.description);

  if (loading) return <main className="project"><div className="container page-loading-inline">Loading project…</div></main>;

  if (!project)
    return (
      <main className="notfound">
        <div className="container">
          <p className="eyebrow">Project not found</p>
          <h1 className="display display--lg">That cut isn't on the timeline.</h1>
          <Link to="/work" className="btn btn--solid btn--lg">
            Back to all work
          </Link>
        </div>
      </main>
    );

  const details = [
    ['Client / Artist', dash(project.client)],
    ['Agency', dash(project.agency)],
    ['Director', dash(project.director)],
    ['My role', dash(project.role)],
    ['Year', project.year],
  ].filter(([, v]) => v);

  return (
    <main className="project">
      <section className="project__head container">
        <Reveal as="p" className="eyebrow" y={12}>
          <span className="eyebrow__line" />
          <Link to="/work">Work</Link> / {project.category}
        </Reveal>
        <SplitText as="h1" className="display display--lg" text={project.title} by="word" delay={0.1} stagger={0.07} />
      </section>

      <Reveal className="project__player" y={40} delay={0.15}>
        <VideoPlayer
          url={project.videoUrl}
          title={project.title}
          gradient={project.gradient}
          poster={project.poster}
          previewUrl={project.previewUrl}
        />
      </Reveal>

      <section className="container project__body">
        <div className="project__info">
          <dl className="details">
            {details.map(([k, v]) => (
              <Reveal className="details__row" key={k} y={16}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </Reveal>
            ))}
          </dl>
          {project.tools?.length > 0 && (
            <Reveal className="tool-tags">
              {project.tools.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </Reveal>
          )}
        </div>

        <div className="project__story">
          <Reveal as="h2" className="h-sm">
            About this project
          </Reveal>
          <Reveal as="p" className="lead" delay={0.05}>
            {project.description}
          </Reveal>

          {project.behindTheScenes?.length > 0 && (
            <>
              <Reveal as="h3" className="h-sm">
                Behind the scenes
              </Reveal>
              <ul className="bullets">
                {project.behindTheScenes.map((b) => (
                  <Reveal as="li" key={b} y={12}>
                    {b}
                  </Reveal>
                ))}
              </ul>
            </>
          )}

          {project.press?.length > 0 && (
            <>
              <Reveal as="h3" className="h-sm">
                Press & awards
              </Reveal>
              <ul className="bullets">
                {project.press.map((b) => (
                  <Reveal as="li" key={b} y={12}>
                    {b}
                  </Reveal>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {related?.length > 0 && (
        <section className="section">
          <div className="container">
            <Reveal as="h2" className="display display--md">
              Related projects
            </Reveal>
            <div className="grid grid--work">
              {related.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
