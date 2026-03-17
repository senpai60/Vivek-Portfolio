// src/components/NavBar.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import gsap from "gsap";

const NavBar = () => {
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.5 }, // Reduced delay so it shows instantly on Gallery page
    );
  }, []);

  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;
    if (menuOpen) {
      menu.classList.add("open");
      document.body.style.overflow = "hidden";
    } else {
      menu.classList.remove("open");
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  const handleNav = (id, path) => {
    setMenuOpen(false);

    // If it's a dedicated page (like gallery)
    if (path) {
      navigate(path);
      window.scrollTo(0, 0);
      return;
    }

    // If it's a section on the homepage
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 500); // Wait for home to render
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItemStyle = {
    cursor: "none",
    opacity: 0.8,
    transition: "opacity 0.3s",
  };

  // Note: Added 'path' for the Gallery
  const links = [
    { label: "About", id: "about" },
    { label: "Gallery", path: "/gallery" },
    { label: "Projects", id: "projects" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <>
      <nav ref={navRef} className="navbar">
        <div
          className="hover-target"
          style={navItemStyle}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.8)}
          onClick={() => handleNav("hero", "/")}
        >
          Vivek Sathloniya
        </div>

        <div className="navbar-links">
          {links.map((l, idx) => (
            <div
              key={idx}
              className="hover-target"
              style={navItemStyle}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.8)}
              onClick={() => handleNav(l.id, l.path)}
            >
              {l.label}
            </div>
          ))}
        </div>

        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span
            style={{
              transform: menuOpen
                ? "rotate(45deg) translate(4px, 4px)"
                : "none",
            }}
          />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span
            style={{
              transform: menuOpen
                ? "rotate(-45deg) translate(4px, -4px)"
                : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div ref={mobileMenuRef} className="mobile-menu">
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            opacity: 0.4,
            marginBottom: "1rem",
          }}
        >
          Navigation
        </div>
        {links.map((l, idx) => (
          <div
            key={idx}
            onClick={() => handleNav(l.id, l.path)}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.5rem, 10vw, 5rem)",
              textTransform: "uppercase",
              cursor: "pointer",
              opacity: 0.9,
              lineHeight: 1,
            }}
          >
            {l.label}
          </div>
        ))}
      </div>
    </>
  );
};

export default NavBar;
