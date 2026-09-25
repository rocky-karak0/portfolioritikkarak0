import { useEffect, useRef, useState } from 'react';
import { useCoarsePointer } from '../hooks/useMedia.js';

/** Desktop-only follower cursor. Elements opt in with data-cursor="play|view|close|hover". */
export default function CustomCursor() {
  const coarse = useCoarsePointer();
  const dot = useRef(null);
  const ring = useRef(null);
  const [mode, setMode] = useState('');

  useEffect(() => {
    if (coarse) return undefined;
    document.documentElement.classList.add('has-cursor');
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf;

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const over = (e) => {
      const el = e.target.closest?.('[data-cursor], a, button, input, textarea, select, label');
      if (!el) return setMode('');
      setMode(el.dataset?.cursor || 'hover');
    };
    const leave = () => setMode('hidden');
    const enter = () => setMode('');

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', over, { passive: true });
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
      cancelAnimationFrame(raf);
    };
  }, [coarse]);

  if (coarse) return null;
  const label = { play: 'PLAY', view: 'VIEW', close: 'CLOSE' }[mode];
  return (
    <>
      <div ref={ring} className={`cursor cursor--ring ${mode ? `is-${mode}` : ''}`} aria-hidden="true">
        <span className="cursor__label">{label}</span>
      </div>
      <div ref={dot} className={`cursor cursor--dot ${mode === 'hidden' ? 'is-hidden' : ''}`} aria-hidden="true" />
    </>
  );
}
