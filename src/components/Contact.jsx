import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const formRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState('');

  useEffect(() => {
    if (!sectionRef.current) return;
    let headingSplit;

    const ctx = gsap.context(() => {
      // Heading char reveal
      if (headingRef.current) {
        headingSplit = new SplitType(headingRef.current, { types: 'chars' });
        gsap.fromTo(headingSplit.chars,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0, opacity: 1, duration: 1.2,
            ease: 'power4.out', stagger: 0.03,
            scrollTrigger: { trigger: headingRef.current, start: 'top 80%' }
          }
        );
      }

      // Form fields slide up
      gsap.fromTo('.contact-field',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: formRef.current, start: 'top 80%' }
        }
      );

      // Meta info
      gsap.fromTo('.contact-meta',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      if (headingSplit) headingSplit.revert();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Animate button on submit
    gsap.to('.contact-btn', { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  const inputStyle = (field) => ({
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${focused === field ? 'var(--text-color)' : 'var(--accent-color)'}`,
    color: 'var(--text-color)',
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
    padding: '1.2rem 0',
    outline: 'none',
    transition: 'border-color 0.4s ease',
    letterSpacing: '0.02em',
    fontWeight: 300,
  });

  const labelStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    opacity: 0.45,
    display: 'block',
    marginBottom: '0.3rem',
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
        borderTop: '1px solid var(--accent-color)',
        overflow: 'hidden',
      }}
    >
      {/* Section header bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '2rem var(--padding-x)',
        borderBottom: '1px solid var(--accent-color)',
      }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>Contact</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }}>006 / 006</span>
      </div>

      {/* Main content grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.4fr',
        minHeight: '80vh',
      }}
        className="contact-grid"
      >
        {/* LEFT — Heading + meta info */}
        <div style={{
          padding: '6rem var(--padding-x)',
          borderRight: '1px solid var(--accent-color)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
          className="contact-left"
        >
          <div>
            <div style={{ overflow: 'hidden' }}>
              <h2
                ref={headingRef}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(3rem, 6vw, 8rem)',
                  lineHeight: 0.9,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                Let's<br />
                <span style={{ fontStyle: 'italic', color: 'transparent', WebkitTextStroke: '1px var(--text-color)' }}>
                  Work
                </span><br />
                Together.
              </h2>
            </div>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
              lineHeight: 1.8,
              opacity: 0.6,
              fontWeight: 300,
              marginTop: '3rem',
              maxWidth: '380px',
            }}>
              Have a project in mind or just want to talk creative direction? Drop a message and I'll get back within 24 hours.
            </p>
          </div>

          {/* Contact meta links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { label: 'Email', value: 'vivek@example.com' },
              { label: 'LinkedIn', value: 'linkedin.com/in/vivek' },
              { label: 'GitHub', value: 'github.com/vivek' },
            ].map((item, i) => (
              <div
                key={i}
                className="contact-meta hover-target"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.5rem 0',
                  borderTop: '1px solid var(--accent-color)',
                  cursor: 'none',
                }}
              >
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.4 }}>{item.label}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', opacity: 0.8 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Form */}
        <div style={{
          padding: '6rem var(--padding-x) 6rem 5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
          className="contact-right"
        >
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4vw, 5rem)',
                textTransform: 'uppercase',
                lineHeight: 1,
                marginBottom: '2rem',
              }}>
                Message<br />
                <span style={{ fontStyle: 'italic', color: 'transparent', WebkitTextStroke: '1px var(--text-color)' }}>Received.</span>
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', opacity: 0.6, lineHeight: 1.8 }}>
                Thank you for reaching out. I'll be in touch shortly.
              </p>
              <button
                onClick={() => setSent(false)}
                style={{
                  marginTop: '3rem',
                  background: 'transparent',
                  border: '1px solid var(--accent-color)',
                  color: 'var(--text-color)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  padding: '1rem 2.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--text-color)'; e.currentTarget.style.color = 'var(--bg-color)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-color)'; }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
              {/* Name */}
              <div className="contact-field">
                <label style={labelStyle}>Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused('')}
                  style={inputStyle('name')}
                  placeholder="Vivek Satloniya"
                />
              </div>

              {/* Email */}
              <div className="contact-field">
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  style={inputStyle('email')}
                  placeholder="hello@example.com"
                />
              </div>

              {/* Message */}
              <div className="contact-field">
                <label style={labelStyle}>Your Message</label>
                <textarea
                  required
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused('')}
                  style={{
                    ...inputStyle('message'),
                    resize: 'none',
                    minHeight: '120px',
                  }}
                  placeholder="Tell me about your project..."
                  rows={4}
                />
              </div>

              {/* Submit */}
              <div className="contact-field" style={{ marginTop: '1rem' }}>
                <button
                  type="submit"
                  className="contact-btn hover-target"
                  style={{
                    background: 'var(--text-color)',
                    color: 'var(--bg-color)',
                    border: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    padding: '1.4rem 3.5rem',
                    cursor: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-color)';
                    e.currentTarget.style.border = '1px solid var(--text-color)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--text-color)';
                    e.currentTarget.style.color = 'var(--bg-color)';
                    e.currentTarget.style.border = 'none';
                  }}
                >
                  Send Message
                  <span style={{ fontSize: '1.1rem' }}>→</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
