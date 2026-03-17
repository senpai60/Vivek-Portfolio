import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const Manifesto = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    if (!textRef.current || !headingRef.current || !containerRef.current) return;

    let textSplit;
    let headingSplit;

    let ctx = gsap.context(() => {
      // Split text into lines for cinematic reveal
      textSplit = new SplitType(textRef.current, { types: 'lines, words' });
      headingSplit = new SplitType(headingRef.current, { types: 'chars' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "bottom 80%",
          scrub: 1, // Tie it to scroll for fashion-magazine pacing
        }
      });

      // Character stagger on heading
      tl.fromTo(headingSplit.chars, 
        { y: 50, opacity: 0, rotateX: -90 },
        { 
          y: 0, 
          opacity: 1, 
          rotateX: 0, 
          stagger: 0.05, 
          duration: 1, 
          ease: "power3.out" 
        }
      );

      // Line stagger on body text
      tl.fromTo(textSplit.lines,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1.5,
          ease: "power3.out"
        },
        "-=0.5"
      );
    }, containerRef);

    return () => {
      ctx.revert();
      if (textSplit) textSplit.revert();
      if (headingSplit) headingSplit.revert();
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="section-padding"
      style={{
        backgroundColor: 'var(--text-color)',
        color: 'var(--bg-color)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative' }}>
        <h2 
          ref={headingRef}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(4rem, 12vw, 15rem)',
            gridColumn: '1 / -1',
            margin: '0 0 4rem 0',
            lineHeight: 0.85,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            borderBottom: '1px solid currentColor',
            paddingBottom: '2rem',
            overflow: 'hidden' // for the reveal
          }}
        >
          Philosophy
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem',
          alignItems: 'start'
        }}>
          <div>
            <span style={{
              float: 'left',
              fontFamily: 'var(--font-heading)',
              fontSize: '8rem',
              lineHeight: '6rem',
              paddingTop: '0.5rem',
              paddingRight: '1rem',
              color: 'transparent',
              WebkitTextStroke: '1px var(--bg-color)',
              fontStyle: 'italic'
            }}>
              W
            </span>
            <p 
              ref={textRef}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.2rem',
                lineHeight: 1.8,
                textTransform: 'none',
                opacity: 0.9,
                fontWeight: 300
              }}
            >
              e believe that the web is a canvas for visceral storytelling. 
              By merging editorial design principles with modern motion graphics, 
              we build digital spaces that don't just convey information, but evoke emotion. 
              A premium experience demands flawless execution, fluid timing, and absolute attention to the negative space surrounding every focal point.
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}>
            <p style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              lineHeight: 1.2,
              fontStyle: 'italic',
              opacity: 0.8
            }}>
              "The space between the elements is as important as the elements themselves."
            </p>
            <div style={{ height: '1px', width: '100%', backgroundColor: 'currentColor', opacity: 0.2 }} />
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 500
            }}>
              — Design Manifesto
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
