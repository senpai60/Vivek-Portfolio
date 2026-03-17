import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: 'Aethereal',
    type: 'Design & Motion',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80&fit=crop',
  },
  {
    title: 'Lumina',
    type: 'E-Commerce',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=600&q=80&fit=crop',
  },
  {
    title: 'Nexus',
    type: 'Creative Development',
    year: '2025',
    img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80&fit=crop',
  },
  {
    title: 'Void',
    type: 'Interactive Experience',
    year: '2025',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop',
  },
];

const Projects = () => {
  const containerRef = useRef(null);
  const previewRef = useRef(null);
  const previewImgRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const isMobile = window.innerWidth <= 768;

    const ctx = gsap.context(() => {
      const listItems = containerRef.current.querySelectorAll('.project-item');
      listItems.forEach((item, i) => {
        gsap.fromTo(item,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: i * 0.05,
            scrollTrigger: { trigger: item, start: 'top 92%' }
          }
        );

        const underline = item.querySelector('.project-underline');
        const number = item.querySelector('.project-number');
        const type = item.querySelector('.project-type');

        const tl = gsap.timeline({ paused: true });
        tl.to(underline, { scaleX: 1, duration: 0.6, ease: 'power3.inOut' }, 0);
        if (number) tl.to(number, { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' }, 0);
        if (type) tl.to(type, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 0.05);

        item.addEventListener('mouseenter', () => tl.play());
        item.addEventListener('mouseleave', () => tl.reverse());
      });

      if (isMobile) return;

      // Cursor preview only on desktop
      const preview = previewRef.current;
      if (!preview) return;

      listItems.forEach((item, i) => {
        item.addEventListener('mouseenter', () => {
          if (previewImgRef.current) previewImgRef.current.src = projects[i].img;
          gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power3.out' });
        });
        item.addEventListener('mouseleave', () => {
          gsap.to(preview, { autoAlpha: 0, scale: 0.85, duration: 0.4, ease: 'power3.in' });
        });
      });

      const onMove = (e) => {
        gsap.to(preview, { x: e.clientX - 100, y: e.clientY - 140, duration: 0.6, ease: 'power2.out' });
      };
      window.addEventListener('mousemove', onMove);
      return () => window.removeEventListener('mousemove', onMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="section-padding"
      id="projects"
      style={{ paddingBottom: '12rem', position: 'relative' }}
    >
      {/* Floating image preview — hidden via CSS on mobile */}
      <div
        ref={previewRef}
        className="project-preview-float"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '200px', height: '280px',
          pointerEvents: 'none',
          zIndex: 100, opacity: 0,
          overflow: 'hidden', borderRadius: '2px',
        }}
      >
        <img
          ref={previewImgRef}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(10%) contrast(1.1)' }}
        />
        <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(232,227,216,0.15)', borderRadius: '2px', pointerEvents: 'none' }} />
      </div>

      {/* Header */}
      <div className="divider" style={{ marginBottom: '0', opacity: 0.25 }} />
      <div className="projects-header">
        <h3 style={{ fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.8rem', opacity: 0.5, margin: 0 }}>
          Selected Works
        </h3>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>003 / 006</span>
      </div>

      {/* List */}
      <div>
        {projects.map((project, i) => (
          <div
            key={i}
            className="project-item project-row hover-target"
            style={{ cursor: 'none' }}
          >
            <span
              className="project-number"
              style={{
                fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                textTransform: 'uppercase', letterSpacing: '0.15em',
                opacity: 0, transform: 'translateX(-10px)',
                minWidth: '2rem',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>

            <h2
              className="project-title"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.5rem, 5.5vw, 7.5rem)',
                margin: 0, textTransform: 'uppercase',
                lineHeight: 1, letterSpacing: '-0.02em',
              }}
            >
              {project.title}
            </h2>

            <div style={{ textAlign: 'right' }}>
              <p
                className="project-type"
                style={{
                  fontFamily: 'var(--font-body)',
                  textTransform: 'uppercase', opacity: 0,
                  fontSize: '0.85rem', letterSpacing: '0.08em',
                  transform: 'translateY(8px)', margin: '0 0 0.3rem 0'
                }}
              >
                {project.type}
              </p>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', opacity: 0.3, letterSpacing: '0.1em' }}>
                {project.year}
              </span>
            </div>

            <div
              className="project-underline"
              style={{
                position: 'absolute', bottom: -1, left: 0,
                width: '100%', height: '1px',
                backgroundColor: 'var(--text-color)',
                transform: 'scaleX(0)', transformOrigin: 'left', zIndex: 2
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
