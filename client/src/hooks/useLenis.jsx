import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from './useMedia.js';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext(null);
export const useLenis = () => useContext(LenisContext);

/** Buttery smooth scrolling wired into GSAP ScrollTrigger. Disabled for reduced-motion users. */
export function LenisProvider({ children }) {
  const [lenis, setLenis] = useState(null);
  const reduced = usePrefersReducedMotion();
  const rafRef = useRef(null);

  useEffect(() => {
    if (reduced) return undefined;
    const instance = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 1 });
    setLenis(instance);
    instance.on('scroll', ScrollTrigger.update);
    rafRef.current = (time) => instance.raf(time * 1000);
    gsap.ticker.add(rafRef.current);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
