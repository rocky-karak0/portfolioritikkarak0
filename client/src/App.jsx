import { lazy, Suspense, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LenisProvider, useLenis } from './hooks/useLenis.jsx';
import { ReadyContext } from './context.js';
import { ReelProvider } from './components/ReelModal.jsx';
import Preloader from './components/Preloader.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import Home from './pages/Home.jsx';

const Work = lazy(() => import('./pages/Work.jsx'));
const Project = lazy(() => import('./pages/Project.jsx'));
const Showreel = lazy(() => import('./pages/Showreel.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

const seen = () => {
  try {
    return sessionStorage.getItem('rk-intro') === '1';
  } catch {
    return false;
  }
};

function Shell() {
  const location = useLocation();
  const lenis = useLenis();
  const [ready, setReady] = useState(seen);

  const finishIntro = () => {
    try {
      sessionStorage.setItem('rk-intro', '1');
    } catch {
      /* private mode — ignore */
    }
    setReady(true);
  };

  const resetScroll = () => (lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0));

  return (
    <ReadyContext.Provider value={ready}>
      <ReelProvider>
        {!ready && <Preloader onDone={finishIntro} />}
        <ScrollProgress />
        <CustomCursor />
        <Navbar />

        <AnimatePresence mode="wait" onExitComplete={resetScroll}>
          <motion.div
            key={location.pathname}
            className="page"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.1, 1] }}
          >
            <Suspense fallback={<div className="page-loading" />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/work" element={<Work />} />
                <Route path="/work/:slug" element={<Project />} />
                <Route path="/showreel" element={<Showreel />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Footer />
          </motion.div>
        </AnimatePresence>

        {/* curtain wipe on every route change */}
        <motion.div
          key={`curtain-${location.pathname}`}
          className="curtain"
          initial={{ scaleY: location.key === 'default' ? 0 : 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
          aria-hidden="true"
        />
      </ReelProvider>
    </ReadyContext.Provider>
  );
}

export default function App() {
  return (
    <LenisProvider>
      <Shell />
    </LenisProvider>
  );
}
