import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const textContainerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(textRef.current,
      { yPercent: 100 },
      {
        yPercent: 0, ease: 'none',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true
        }
      }
    );
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <footer
      ref={footerRef}
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'clamp(2rem, 4vw, 4rem) var(--padding-x) 2rem var(--padding-x)',
        backgroundColor: 'var(--text-color)',
        color: 'var(--bg-color)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        ref={textContainerRef}
        className="hover-target"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          width: '100%',
          flex: 1,
        }}
      >
        <h1
          ref={textRef}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 10vw, 15rem)',
            textTransform: 'uppercase',
            lineHeight: 0.9,
            margin: 0,
            textAlign: 'center',
            cursor: 'none',
          }}
        >
          Let's Create<br />Something<br />Beautiful
        </h1>
      </div>

      <div className="footer-meta">
        <span>© {new Date().getFullYear()} Vivek Satloniya</span>
        <span>Crafted with Passion</span>
      </div>
    </footer>
  );
};

export default Footer;
