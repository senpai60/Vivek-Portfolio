import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const NavBar = () => {
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out', delay: 2.5 }
    );
  }, []);

  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;
    if (menuOpen) {
      menu.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const navItemStyle = { cursor: 'none', opacity: 0.8, transition: 'opacity 0.3s' };

  const links = [
    { label: 'About', id: 'about' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <nav ref={navRef} className="navbar">
        <div
          className="hover-target"
          style={navItemStyle}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
          onClick={() => scrollTo('hero')}
        >
          Vivek Satloniya
        </div>

        {/* Desktop links */}
        <div className="navbar-links">
          {links.map(l => (
            <div
              key={l.id}
              className="hover-target"
              style={navItemStyle}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
              onClick={() => scrollTo(l.id)}
            >
              {l.label}
            </div>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span style={{ transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile full-screen menu */}
      <div ref={mobileMenuRef} className="mobile-menu">
        <div
          style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.4, marginBottom: '1rem' }}
        >
          Navigation
        </div>
        {links.map(l => (
          <div
            key={l.id}
            onClick={() => scrollTo(l.id)}
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 10vw, 5rem)', textTransform: 'uppercase', cursor: 'pointer', opacity: 0.9, lineHeight: 1 }}
          >
            {l.label}
          </div>
        ))}
        <div
          style={{ marginTop: '2rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}
        >
          © 2025 Vivek Satloniya
        </div>
      </div>
    </>
  );
};

export default NavBar;
