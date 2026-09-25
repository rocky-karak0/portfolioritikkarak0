import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { embedSrc, parseVideo, posterGradient } from '../lib/video.js';
import LoopVideo from './LoopVideo.jsx';

/**
 * Click-to-load player (a "facade"): the heavy iframe / video only loads when the visitor
 * presses play — this keeps the page fast. Supports YouTube, Vimeo and direct .mp4 files.
 */
export default function VideoPlayer({ url, title = 'Video', gradient, poster, previewUrl, autoPlay = false, className = '' }) {
  const video = useMemo(() => parseVideo(url), [url]);
  const [playing, setPlaying] = useState(autoPlay);

  useEffect(() => {
    setPlaying(autoPlay);
  }, [url, autoPlay]);

  return (
    <div className={`player ${className}`} data-cursor={playing ? undefined : 'play'}>
      {playing && video.type === 'file' && (
        <video className="player__media" src={video.src} poster={poster || undefined} controls autoPlay playsInline preload="auto" />
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
          <span className="player__art" style={{ backgroundImage: poster ? `url(${poster})` : posterGradient(gradient) }} />
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
