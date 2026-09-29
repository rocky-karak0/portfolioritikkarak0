import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { embedSrc, parseVideo, posterGradient } from '../lib/video.js';
import LoopVideo from './LoopVideo.jsx';

/**
 * Click-to-load player (a "facade"): the heavy iframe / video only loads when the visitor
 * presses play — this keeps the page fast. Supports YouTube, Vimeo and direct .mp4 files.
 * Falls back to a tap-to-play overlay when the browser blocks sound-on autoplay, and to a
 * poster + message if the file itself cannot be decoded, so a broken file never shows a
 * black box.
 */
export default function VideoPlayer({ url, title = 'Video', gradient, poster, previewUrl, autoPlay = false, className = '' }) {
  const video = useMemo(() => parseVideo(url), [url]);
  const [playing, setPlaying] = useState(autoPlay);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);
  const vid = useRef(null);

  useEffect(() => {
    setPlaying(autoPlay);
    setBlocked(false);
    setFailed(false);
  }, [url, autoPlay]);

  // autoPlay is ignored with sound on iOS / strict autoplay policies — ask the element to
  // play and, if the browser refuses, offer a real-gesture tap overlay instead.
  useEffect(() => {
    if (!playing || video.type !== 'file' || failed) return undefined;
    const el = vid.current;
    if (!el) return undefined;
    let cancelled = false;
    const attempt = el.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(() => {
        if (!cancelled) setBlocked(true);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [playing, video.type, failed]);

  const unlock = useCallback(() => {
    const el = vid.current;
    if (!el) return;
    el.muted = false;
    el.play()
      .then(() => setBlocked(false))
      .catch(() => {
        el.muted = true;
        el.play().then(() => setBlocked(false)).catch(() => setFailed(true));
      });
  }, []);

  const artStyle = { backgroundImage: poster ? `url(${poster})` : posterGradient(gradient) };

  return (
    <div className={`player ${className}`} data-cursor={playing && !failed ? undefined : 'play'}>
      {playing && video.type === 'file' && !failed && (
        <video
          ref={vid}
          className="player__media"
          poster={poster || undefined}
          controls
          autoPlay
          playsInline
          preload="auto"
          onError={() => setFailed(true)}
        >
          <source src={video.src} type="video/mp4" />
        </video>
      )}

      {playing && failed && (
        <div className="player__fallback" style={artStyle}>
          <span className="player__fallback-msg">
            This video can't play in your browser.
            <button type="button" onClick={() => window.open(video.src, '_blank', 'noopener')}>
              Open the file
            </button>
          </span>
        </div>
      )}

      {playing && blocked && !failed && (
        <button type="button" className="player__unlock" onClick={unlock} aria-label={`Play ${title}`}>
          <span className="player__ring" />
          <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true">
            <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.9-6.86a1 1 0 0 0 0-1.7L9.53 4.3A1 1 0 0 0 8 5.14z" />
          </svg>
        </button>
      )}

      {playing && (video.type === 'youtube' || video.type === 'vimeo') && (
        <iframe
          className="player__media"
          src={embedSrc(video)}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          loading="lazy"
        />
      )}

      {!playing && (
        <button type="button" className="player__facade" onClick={() => setPlaying(true)} aria-label={`Play ${title}`}>
          <span className="player__art" style={artStyle} />
          {previewUrl && <LoopVideo src={previewUrl} className="player__preview" />}
          <span className="player__shade" />
          <span className="player__play">
            <span className="player__ring" />
            <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true">
              <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.9-6.86a1 1 0 0 0 0-1.7L9.53 4.3A1 1 0 0 0 8 5.14z" />
            </svg>
          </span>
          <motion.span className="player__label" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <i className="rec-dot" /> {title}
          </motion.span>
        </button>
      )}
    </div>
  );
}
