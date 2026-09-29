import { useEffect, useRef } from 'react';

/**
 * Muted looping <video> that only downloads/plays while on screen (lazy) and
 * pauses off-screen to save battery — safe for mobile autoplay (muted + playsInline).
 */
export default function LoopVideo({ src, className = '', poster, threshold = 0.25 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!el.getAttribute('src')) el.setAttribute('src', src);
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src, threshold]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-hidden="true"
      tabIndex={-1}
      onError={(e) => {
        // Undecodable file: hide it so the poster/art underneath stays visible.
        e.currentTarget.style.visibility = 'hidden';
      }}
    />
  );
}
