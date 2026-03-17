import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Cursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    
    let xSetter = gsap.quickSetter(cursor, "x", "px");
    let ySetter = gsap.quickSetter(cursor, "y", "px");

    const onMouseMove = (e) => {
      xSetter(e.clientX);
      ySetter(e.clientY);
    };

    window.addEventListener('mousemove', onMouseMove);

    const onMouseEnter = () => cursor.classList.add('hover');
    const onMouseLeave = () => cursor.classList.remove('hover');

    // Polling or mutation observer might be better, but we will attach to interactive elements
    const attachHoverEvents = () => {
      const hoverTargets = document.querySelectorAll('a, button, .hover-target');
      hoverTargets.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });
      return hoverTargets;
    };

    // Delay attaching to let components mount
    let hoverTargets = [];
    const timeout = setTimeout(() => {
      hoverTargets = attachHoverEvents();
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      clearTimeout(timeout);
      hoverTargets.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor"></div>;
};

export default Cursor;
