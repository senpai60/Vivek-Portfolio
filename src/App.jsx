import { useEffect } from 'react';
import Lenis from 'lenis';
import Intro from './components/Intro';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import TypographySection from './components/TypographySection';
import Manifesto from './components/Manifesto';
import HorizontalGallery from './components/HorizontalGallery';
import FlowingCards from './components/FlowingCards';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import './index.css';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // CSS power3.out
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Cursor />
      <Intro />
      <NavBar />
      <div className="main-content">
        <div id="hero"><Hero /></div>
        <Manifesto />
        <TypographySection />
        <div id="gallery"><HorizontalGallery /></div>
        <FlowingCards />
        <div id="about"><About /></div>
        <div id="projects"><Projects /></div>
        <Contact />
        <Footer />
      </div>
    </>
  );
}

export default App;
