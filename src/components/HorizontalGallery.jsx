import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HorizontalGallery = () => {
  const containerRef = useRef(null);
  const scrollWrapperRef = useRef(null);

  const galleryItems = [
    { text: 'Aesthetics', description: 'Visual precision', italic: true },
    { text: 'Motion', description: 'Cinematic timing', italic: false },
    { text: 'Structure', description: 'Architectural layout', italic: true },
    { text: 'Identity', description: 'Brand essence', italic: false }
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Calculate total scroll distance based on container width
      const getScrollAmount = () => {
        let scrollWidth = scrollWrapperRef.current.scrollWidth;
        return -(scrollWidth - window.innerWidth);
      };

      // Create empty tween first to pass as animation reference, or just string 'tween' but simpler to do:
      gsap.to(scrollWrapperRef.current, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${getScrollAmount() * -1}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          // Removed recursive animation: tween param as it wasn't strictly necessary for a simple to-tween
        }
      });
      
      // Image skew effect while scrolling
      const items = document.querySelectorAll('.gallery-card');
      items.forEach((item) => {
        gsap.to(item, {
          skewX: -5,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${getScrollAmount() * -1}`,
            scrub: 1,
          }
        });
      });

    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      style={{
        height: '100vh', 
        overflow: 'hidden',
        backgroundColor: 'var(--bg-color)',
        display: 'flex',
        alignItems: 'center',
        borderTop: '1px solid var(--accent-color)',
        borderBottom: '1px solid var(--accent-color)'
      }}
    >
      <div 
        ref={scrollWrapperRef}
        style={{
          display: 'flex',
          gap: '10vw',
          padding: '0 10vw',
          willChange: 'transform'
        }}
      >
        {galleryItems.map((item, index) => (
          <div 
            key={index} 
            className="gallery-card"
            style={{
              flexShrink: 0,
              width: '45vw',
              minWidth: '400px',
              height: '60vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '2rem',
              border: '1px solid var(--accent-color)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Subtle background grain or pattern placeholder for image */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'radial-gradient(circle at center, rgba(42,42,42,0.5) 0%, transparent 70%)',
              opacity: 0.3,
              zIndex: 0
            }} />
            
            <span style={{
              fontFamily: 'var(--font-body)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '0.8rem',
              position: 'relative',
              zIndex: 1
            }}>
              0{index + 1}
            </span>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(3rem, 6vw, 6rem)',
                margin: 0,
                lineHeight: 1,
                textTransform: 'uppercase',
                fontStyle: item.italic ? 'italic' : 'normal',
                color: item.italic ? 'transparent' : 'var(--text-color)',
                WebkitTextStroke: item.italic ? '1px var(--text-color)' : 'none'
              }}>
                {item.text}
              </h3>
              <div className="divider" style={{ margin: '1rem 0' }} />
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                textTransform: 'uppercase',
                opacity: 0.7
              }}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HorizontalGallery;
