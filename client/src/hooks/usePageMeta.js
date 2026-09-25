import { useEffect } from 'react';

/** Sets the document title + meta description per page (good for SEO & tab titles). */
export default function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — Ritik Karak` : 'Ritik Karak — Video Editor & Web Developer';
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = 'description';
        document.head.appendChild(tag);
      }
      tag.content = description;
    }
  }, [title, description]);
}
