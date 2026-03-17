import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  { label: 'React',     sub: 'UI Architecture',    x: '5%',  baseY:  0,    speed: 0.55, lerp: 0.05, italic: false },
  { label: 'Motion',    sub: 'GSAP & Lenis',        x: '33%', baseY: -60,   speed: 0.90, lerp: 0.07, italic: true  },
  { label: 'Design',    sub: 'Systems & Craft',     x: '63%', baseY:  20,   speed: 0.65, lerp: 0.06, italic: false },
  { label: 'CSS',       sub: 'Luxury Style',        x: '10%', baseY:  180,  speed: 0.40, lerp: 0.04, italic: true  },
  { label: 'Next.js',   sub: 'Full-Stack App',      x: '42%', baseY:  240,  speed: 0.75, lerp: 0.08, italic: false },
  { label: 'Editorial', sub: 'Typography',          x: '68%', baseY:  160,  speed: 1.00, lerp: 0.09, italic: true  },
  { label: 'Three.js',  sub: 'WebGL & 3D',          x: '18%', baseY:  420,  speed: 0.50, lerp: 0.05, italic: false },
  { label: 'UX',        sub: 'User Experience',     x: '53%', baseY:  380,  speed: 0.85, lerp: 0.07, italic: true  },
];

const FlowingCards = () => {
  const sectionRef = useRef(null);
  const cardEls = useRef([]);
  const currentYs = useRef(cards.map(() => 0));

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    let rafId;
    let scrollProgress = 0;

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionH = section.offsetHeight;
      const windowH = window.innerHeight;
      scrollProgress = Math.max(0, Math.min(1, -rect.top / (sectionH - windowH)));
    };

    const tick = () => {
      const totalDist = isMobile ? window.innerHeight * 0.5 : window.innerHeight;
      cardEls.current.forEach((el, i) => {
        if (!el) return;
        const { speed, lerp } = cards[i];
        const targetY = -scrollProgress * totalDist * speed;
        currentYs.current[i] += (targetY - currentYs.current[i]) * lerp;
        el.style.transform = `translateY(${currentYs.current[i].toFixed(2)}px)`;
      });
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);

    gsap.fromTo('.fc-heading',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
    );
    gsap.fromTo(cardEls.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
    );

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="flowing-section">
      {/* Sticky heading */}
      <div className="flowing-sticky-head">
        <h2
          className="fc-heading"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 8vw, 11rem)',
            lineHeight: 0.9,
            textTransform: 'uppercase',
            color: 'var(--text-color)',
            margin: 0,
          }}
        >
          Skills &amp;<br />
          <span style={{ fontStyle: 'italic', WebkitTextStroke: '1px var(--text-color)', color: 'transparent' }}>
            Capabilities
          </span>
        </h2>
      </div>

      {/* Cards layer */}
      <div className="flowing-cards-layer">
        {cards.map((card, i) => (
          <div
            key={i}
            ref={el => cardEls.current[i] = el}
            style={{
              position: 'absolute',
              left: card.x,
              top: `calc(15vh + ${card.baseY}px)`,
              width: 'clamp(160px, 20vw, 320px)',
              willChange: 'transform',
            }}
          >
            <div
              className="hover-target"
              style={{
                backgroundColor: 'rgba(12,12,12,0.65)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(232,227,216,0.1)',
                borderRadius: '3px',
                padding: 'clamp(1rem, 2vw, 2rem)',
                cursor: 'none',
              }}
            >
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.4, display: 'block', marginBottom: '1.5rem' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.2rem, 2.5vw, 2.8rem)',
                margin: '0 0 0.5rem 0', lineHeight: 1,
                textTransform: 'uppercase',
                fontStyle: card.italic ? 'italic' : 'normal',
                color: card.italic ? 'transparent' : 'var(--text-color)',
                WebkitTextStroke: card.italic ? '1px var(--text-color)' : 'none',
              }}>
                {card.label}
              </h3>
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(232,227,216,0.25)', margin: '0.8rem 0' }} />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5, margin: 0 }}>
                {card.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FlowingCards;
