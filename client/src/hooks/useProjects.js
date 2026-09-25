import { useEffect, useState } from 'react';
import staticProjects from '../data/projects.js';
import { fetchProjects } from '../lib/api.js';

/** Renders instantly from bundled data, then upgrades to live API data when it arrives. */
export default function useProjects() {
  const [projects, setProjects] = useState(staticProjects);
  useEffect(() => {
    let alive = true;
    fetchProjects().then((data) => alive && setProjects(data));
    return () => {
      alive = false;
    };
  }, []);
  return projects;
}
