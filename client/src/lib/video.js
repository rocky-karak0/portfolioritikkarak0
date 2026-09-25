/** Detects the kind of video URL so the player can pick the right embed. */
export function parseVideo(url = '') {
  if (!url) return { type: 'none' };
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i);
  if (yt) return { type: 'youtube', id: yt[1] };
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vm) return { type: 'vimeo', id: vm[1] };
  return { type: 'file', src: url };
}

export function embedSrc(video) {
  if (video.type === 'youtube')
    return `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  if (video.type === 'vimeo') return `https://player.vimeo.com/video/${video.id}?autoplay=1&title=0&byline=0&portrait=0`;
  return '';
}

export const posterGradient = (g = ['#ff3d2e', '#2a1b6e']) =>
  `radial-gradient(120% 90% at 20% 15%, ${g[0]}cc 0%, transparent 55%), radial-gradient(110% 100% at 90% 90%, ${g[1]} 0%, #0a0a10 70%)`;
