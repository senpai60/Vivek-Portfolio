import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Intro = () => {
  const introRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    gsap.set(textRef.current, { opacity: 0, y: 20 });
    
    tl.to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out",
      delay: 0.5
    })
    .to(textRef.current, {
      opacity: 0,
      y: -20,
      duration: 1,
      ease: "power3.inOut",
      delay: 0.5
    })
    .to(introRef.current, {
      yPercent: -100,
      duration: 1.5,
      ease: "power4.inOut"
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div 
      ref={introRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: 'var(--text-color)',
        color: 'var(--bg-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div 
        ref={textRef}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.5rem',
          textTransform: 'uppercase',
          letterSpacing: '0.4em'
        }}
      >
        Welcome
      </div>
    </div>
  );
};

export default Intro;
