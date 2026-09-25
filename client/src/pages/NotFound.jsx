import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';
import { SplitText } from '../components/motion.jsx';

export default function NotFound() {
  usePageMeta('404');
  return (
    <main className="notfound">
      <div className="container">
        <p className="eyebrow">Error 404 · Scene missing</p>
        <SplitText as="h1" className="display display--xl" text="Cut!" delay={0.1} stagger={0.07} />
        <p className="lead">This page ended up on the cutting-room floor.</p>
        <Link to="/" className="btn btn--solid btn--lg">
          Back to home
        </Link>
      </div>
    </main>
  );
}
