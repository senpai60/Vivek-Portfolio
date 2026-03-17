import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TypographySection = () => {
  const sectionRef = useRef(null);
  const wordsRef = useRef([]);
  const linesRef = useRef([]);

  const words = ['Frontend', 'Motion', 'Interaction', 'Creative Code'];

  useEffect(() => {
    // Setup ScrollTriggers for lines scaling
    linesRef.current.forEach((line) => {
      if (!line) return;
      gsap.fromTo(line, 
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: line,
            start: "top 95%",
            end: "bottom 50%",
            scrub: 1
          }
        }
      );
    });

    // Setup ScrollTriggers for words sliding independently
    wordsRef.current.forEach((word, i) => {
      if (!word) return;
      const direction = i % 2 === 0 ? -100 : 100;
      
      gsap.fromTo(word,
        { x: direction, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: word,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: '8rem 0', overflow: 'hidden' }}>
      {words.map((word, i) => (
        <div key={i} style={{ width: '100%' }}>
          <div 
            ref={el => linesRef.current[i] = el}
            className="divider" 
            style={{ margin: '0' }}
          />
          <div style={{ padding: 'clamp(2rem, 5vw, 6rem) 4rem', display: 'flex', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end' }}>
            <h2 
              ref={el => wordsRef.current[i] = el}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(3rem, 10vw, 12rem)',
                textTransform: 'uppercase',
                margin: 0,
                lineHeight: 0.9,
                cursor: 'none'
              }}
              className="hover-target"
            >
              {word}
            </h2>
          </div>
        </div>
      ))}
      <div 
        ref={el => linesRef.current[words.length] = el}
        className="divider" 
        style={{ margin: '0' }}
      />
    </section>
  );
};

export default TypographySection;
