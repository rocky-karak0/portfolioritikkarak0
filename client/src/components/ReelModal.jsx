import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ReelContext } from '../context.js';
import { useLenis } from '../hooks/useLenis.jsx';
import VideoPlayer from './VideoPlayer.jsx';
import { site } from '../data/siteConfig.js';

/** Full-screen cinema-mode modal: <button onClick={() => reel.open()}>Watch reel</button> */
export function ReelProvider({ children }) {
  const [state, setState] = useState(null); // { url, title } | null
  const lenis = useLenis();

  const open = useCallback((opts = {}) => {
    setState({
      url: opts.url || site.showreelUrl,
      title: opts.title || 'Showreel',
      gradient: opts.gradient,
      poster: opts.poster || site.showreelPoster,
      previewUrl: opts.previewUrl || site.showreelPreview,
    });
  }, []);
  const close = useCallback(() => setState(null), []);

  useEffect(() => {
    if (!state) return undefined;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [state, lenis, close]);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <ReelContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {state && (
          <motion.div
            className="reel-modal"
            role="dialog"
            aria-modal="true"
            aria-label={state.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={close}
          >
            <button type="button" className="reel-modal__close" onClick={close} aria-label="Close video" data-cursor="close">
              <span /> <span />
            </button>
            <motion.div
              className="reel-modal__frame"
              initial={{ scale: 0.86, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.2, 0.7, 0.1, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <VideoPlayer
                url={state.url}
                title={state.title}
                gradient={state.gradient}
                poster={state.poster}
                previewUrl={state.previewUrl}
                autoPlay
              />
            </motion.div>
            <p className="reel-modal__hint">Press ESC or click outside to close</p>
          </motion.div>
        )}
      </AnimatePresence>
    </ReelContext.Provider>
  );
}
