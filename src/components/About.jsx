import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const statementRef = useRef(null);
  const bioRef = useRef(null);
  const marqueeRef = useRef(null);
  const detailsRef = useRef([]);

  useEffect(() => {
    if (!sectionRef.current) return;
    let statementSplit, bioSplit;

    let ctx = gsap.context(() => {
      if (statementRef.current) {
        statementSplit = new SplitType(statementRef.current, { types: 'lines' });
        gsap.fromTo(statementSplit.lines,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0, opacity: 1, duration: 1.4, ease: 'power4.out', stagger: 0.12,
            scrollTrigger: { trigger: statementRef.current, start: 'top 80%' }
          }
        );
      }
      if (bioRef.current) {
        bioSplit = new SplitType(bioRef.current, { types: 'lines' });
        gsap.fromTo(bioSplit.lines,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.06,
            scrollTrigger: { trigger: bioRef.current, start: 'top 85%' }
          }
        );
      }
      if (detailsRef.current.length) {
        gsap.fromTo(detailsRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
          }
        );
      }
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, { xPercent: -50, ease: 'none', repeat: -1, duration: 20 });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      if (statementSplit) statementSplit.revert();
      if (bioSplit) bioSplit.revert();
    };
  }, []);

  const details = [
    { label: 'Expertise', value: 'MERN Stack · Motion · UI Design' },
    { label: 'Focus', value: 'Cinematic Web Experiences' },
    { label: 'Based in', value: 'India' },
    { label: 'Available', value: 'For Freelance →' },
  ];

  const marqueeText = [
    'MERN Stack ✦', 'React ✦', 'Node.js ✦', 'Motion Design ✦',
    'GSAP ✦', 'Next.js ✦', 'MongoDB ✦', 'Creative Development ✦',
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', overflow: 'hidden' }}
    >
      {/* Header */}
      <div className="about-header">
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>About</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>002 / 006</span>
      </div>

      {/* 3-col responsive grid */}
      <div className="about-grid">

        {/* LEFT — Statement + details */}
        <div className="about-left">
          <div ref={statementRef} style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.4rem, 4.5vw, 6rem)',
            lineHeight: 0.95,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            overflow: 'hidden',
          }}>
            Full-Stack<br />
            <span style={{ fontStyle: 'italic', color: 'transparent', WebkitTextStroke: '1px var(--text-color)' }}>Developer</span><br />
            &amp; Motion<br />
            Craftsman.
          </div>

          <div className="about-details-grid">
            {details.map((d, i) => (
              <div key={i} ref={el => detailsRef.current[i] = el} style={{
                borderTop: '1px solid var(--accent-color)',
                padding: '1.5rem 0',
                paddingRight: i % 2 === 0 ? '2rem' : '0',
                borderLeft: i % 2 === 1 ? '1px solid var(--accent-color)' : 'none',
                paddingLeft: i % 2 === 1 ? '2rem' : '0',
              }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4, margin: '0 0 0.5rem 0' }}>{d.label}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, fontWeight: 500 }}>{d.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER — Portrait */}
        <div className="about-center">
          <img
            src="https://images.unsplash.com/photo-1544077960-604201fe74bc?w=900&q=85&fit=crop&crop=faces,top"
            alt="Vivek Satloniya portrait"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', filter: 'grayscale(20%) contrast(1.1)', transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1)' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,11,11,0.65) 0%, transparent 55%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', fontFamily: 'var(--font-body)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.6 }}>
            Vivek Satloniya — 2025
          </div>
        </div>

        {/* RIGHT — Workspace + bio */}
        <div className="about-right">
          <div className="about-workspace">
            <img
              src="https://images.unsplash.com/photo-1536148935331-408321065b18?w=700&q=85&fit=crop&crop=top"
              alt="Dark workspace"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%) contrast(1.1)', transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1)' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(11,11,11,0.4) 0%, transparent 50%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '2rem', left: '2rem', fontFamily: 'var(--font-body)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>
              Studio / Workspace
            </div>
          </div>

          <div className="about-right-bio">
            <div ref={bioRef} style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
              lineHeight: 1.9, opacity: 0.75, fontWeight: 300, overflow: 'hidden'
            }}>
              Vivek Satloniya is a full-stack developer specialising in the MERN stack and interactive web experiences. His work combines modern web technologies with motion and visual design to create digital products that are both functional and visually compelling.
            </div>
            <p style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1rem, 1.6vw, 1.3rem)',
              lineHeight: 1.5, fontStyle: 'italic', opacity: 0.55,
              borderLeft: '1px solid rgba(232, 227, 216, 0.2)',
              paddingLeft: '1.5rem', margin: 0
            }}>
              "Building at the intersection of engineering and aesthetics."
            </p>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div style={{ borderTop: '1px solid var(--accent-color)', borderBottom: '1px solid var(--accent-color)', overflow: 'hidden', padding: '1.2rem 0' }}>
        <div ref={marqueeRef} style={{ display: 'flex', gap: '4rem', whiteSpace: 'nowrap', willChange: 'transform' }}>
          {[...marqueeText, ...marqueeText].map((item, i) => (
            <span key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5, flexShrink: 0 }}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
