import { Component, lazy, Suspense, useEffect, useState } from 'react';
import { hasWebGL } from '../lib/webgl.js';
import { useCoarsePointer, usePrefersReducedMotion } from '../hooks/useMedia.js';

const HeroScene = lazy(() => import('./three/HeroScene.jsx'));
const OrbScene = lazy(() => import('./three/OrbScene.jsx'));

class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.warn('[3D] disabled:', err?.message);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Mounts a lazy-loaded 3D scene only when WebGL works & user hasn't asked for reduced motion. */
function useSceneEnabled() {
  const reduced = usePrefersReducedMotion();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(hasWebGL());
  }, []);
  return ok && !reduced;
}

export function HeroScene3D(props) {
  const enabled = useSceneEnabled();
  const coarse = useCoarsePointer();
  if (!enabled) return null;
  return (
    <Boundary>
      <Suspense fallback={null}>
        <HeroScene {...props} lite={coarse} />
      </Suspense>
    </Boundary>
  );
}

export function OrbScene3D(props) {
  const enabled = useSceneEnabled();
  const coarse = useCoarsePointer();
  if (!enabled) return null;
  return (
    <Boundary>
      <Suspense fallback={null}>
        <OrbScene {...props} lite={coarse || props.lite} />
      </Suspense>
    </Boundary>
  );
}
