// src/pages/GalleryPage.jsx
import { useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import Cursor from "../components/Cursor";

const galleryItems = [
  {
    id: 1,
    src: "https://i.pinimg.com/webp/736x/2d/04/cb/2d04cb246e320726d341cb796bb3dcb3.webp",
    title: "Aethereal",
  },
  {
    id: 2,
    src: "https://i.pinimg.com/webp/1200x/a4/3d/87/a43d87390609510f63a2a588e3e5db6d.webp",
    title: "Lumina",
  },
  {
    id: 3,
    src: "https://i.pinimg.com/736x/62/fb/98/62fb98bf766de67cc6fb54323f01f588.jpg",
    title: "Workspace",
  },
  {
    id: 4,
    src: "https://i.pinimg.com/736x/ae/ec/66/aeec663e52a741114398ab0dea15f729.jpg",
    title: "Nexus",
  },
  {
    id: 5,
    src: "https://i.pinimg.com/webp/736x/4f/c9/0f/4fc90f426b420ccea60c46eb0a575f4c.webp",
    title: "Void",
  },
  {
    id: 6,
    src: "https://i.pinimg.com/736x/37/16/99/3716996b7c3f1a1d13350faf33126e0b.jpg",
    title: "Portrait",
  },
];

// 6 copies → seamless infinite loop
const duplicatedItems = Array(6)
  .fill(galleryItems)
  .flat()
  .map((item, index) => ({ ...item, uniqueId: `${item.id}-${index}` }));

const SCROLL_SPEED = 0.8;
const LERP_FACTOR = 0.06;
const MAX_VELOCITY = 100;

const GalleryPage = () => {
  const trackRef = useRef(null);
  const sliderRef = useRef(null);
  const rafRef = useRef(null);
  const stateRef = useRef({
    currentX: 0,
    targetX: 0,
    isDragging: false,
    startX: 0,
    lastX: 0,
  });

  useEffect(() => {
    const slider = sliderRef.current;
    const track = trackRef.current;
    if (!slider || !track) return;

    // ── Slide geometry ──────────────────────────────────────
    const getSlideWidth = () =>
      track.children[0]?.getBoundingClientRect().width ?? 0;
    let slideWidth = getSlideWidth();
    let sequenceWidth = galleryItems.length * slideWidth;

    // Start in the 3rd repetition so we have buffer in both directions
    const initX = sequenceWidth * 2;
    stateRef.current.currentX = initX;
    stateRef.current.targetX = initX;

    // ── RAF Animation loop ──────────────────────────────────
    const animate = () => {
      const s = stateRef.current;

      // LERP
      s.currentX += (s.targetX - s.currentX) * LERP_FACTOR;

      // Infinite wrap — only jump when we've moved a full sequence
      if (s.currentX > sequenceWidth * 4) {
        s.currentX -= sequenceWidth;
        s.targetX -= sequenceWidth;
      } else if (s.currentX < sequenceWidth) {
        s.currentX += sequenceWidth;
        s.targetX += sequenceWidth;
      }

      // Apply translate to track
      track.style.transform = `translate3d(${-s.currentX}px, 0, 0)`;

      // Per-slide parallax on the inner image
      const viewportCenter = window.innerWidth / 2;
      track.querySelectorAll(".parallax-slide").forEach((slide) => {
        const rect = slide.getBoundingClientRect();
        if (rect.right < -600 || rect.left > window.innerWidth + 600) return;
        const img = slide.querySelector(".parallax-image");
        if (img) {
          const dist = rect.left + rect.width / 2 - viewportCenter;
          img.style.transform = `translate3d(${dist * 0.22}px, 0, 0) scale(1.3)`;
        }
      });

      // Moving class for overlay fade
      const velocity = Math.abs(s.targetX - s.currentX);
      slider.classList.toggle("slider-moving", velocity > 1.5);

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // ── Resize ──────────────────────────────────────────────
    const onResize = () => {
      slideWidth = getSlideWidth();
      sequenceWidth = galleryItems.length * slideWidth;
      // Reset to safe midpoint on resize
      stateRef.current.currentX = sequenceWidth * 2;
      stateRef.current.targetX = sequenceWidth * 2;
    };
    window.addEventListener("resize", onResize);

    // ── Wheel ───────────────────────────────────────────────
    // Must be non-passive so we can call preventDefault
    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const raw =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const delta = Math.max(
        -MAX_VELOCITY,
        Math.min(MAX_VELOCITY, raw * SCROLL_SPEED),
      );
      stateRef.current.targetX += delta;
    };
    slider.addEventListener("wheel", onWheel, { passive: false });

    // ── Mouse drag ──────────────────────────────────────────
    const onMouseDown = (e) => {
      stateRef.current.isDragging = true;
      stateRef.current.startX = e.clientX;
      stateRef.current.lastX = stateRef.current.targetX;
      slider.style.cursor = "grabbing";
    };
    const onMouseMove = (e) => {
      if (!stateRef.current.isDragging) return;
      stateRef.current.targetX =
        stateRef.current.lastX + (stateRef.current.startX - e.clientX) * 1.2;
    };
    const onMouseUp = () => {
      stateRef.current.isDragging = false;
      slider.style.cursor = "grab";
    };
    const onMouseLeave = () => {
      stateRef.current.isDragging = false;
      slider.style.cursor = "grab";
    };

    slider.addEventListener("mousedown", onMouseDown);
    slider.addEventListener("mousemove", onMouseMove);
    slider.addEventListener("mouseup", onMouseUp);
    slider.addEventListener("mouseleave", onMouseLeave);

    // ── Touch drag ──────────────────────────────────────────
    const onTouchStart = (e) => {
      stateRef.current.isDragging = true;
      stateRef.current.startX = e.touches[0].clientX;
      stateRef.current.lastX = stateRef.current.targetX;
    };
    const onTouchMove = (e) => {
      if (!stateRef.current.isDragging) return;
      stateRef.current.targetX =
        stateRef.current.lastX +
        (stateRef.current.startX - e.touches[0].clientX) * 1.2;
    };
    const onTouchEnd = () => {
      stateRef.current.isDragging = false;
    };

    slider.addEventListener("touchstart", onTouchStart, { passive: true });
    slider.addEventListener("touchmove", onTouchMove, { passive: true });
    slider.addEventListener("touchend", onTouchEnd);

    // ── Cleanup — remove listeners individually (NOT replaceWith) ──
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      slider.removeEventListener("wheel", onWheel);
      slider.removeEventListener("mousedown", onMouseDown);
      slider.removeEventListener("mousemove", onMouseMove);
      slider.removeEventListener("mouseup", onMouseUp);
      slider.removeEventListener("mouseleave", onMouseLeave);
      slider.removeEventListener("touchstart", onTouchStart);
      slider.removeEventListener("touchmove", onTouchMove);
      slider.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div
      style={{
        backgroundColor: "var(--bg-color)",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "fixed", // Locks the page — no body scroll interfering
        inset: 0,
      }}
    >
      <Cursor />
      <NavBar />

      <main
        ref={sliderRef}
        className="parallax-slider"
        // data-lenis-prevent tells Lenis to leave this element's scroll alone
        data-lenis-prevent
      >
        {/* Background Title */}
        <div className="parallax-title-header">
          <h1>The Archive</h1>
          <p>Drag or Scroll</p>
        </div>

        {/* Infinite Track */}
        <div ref={trackRef} className="parallax-track">
          {duplicatedItems.map((item) => (
            <div key={item.uniqueId} className="parallax-slide hover-target">
              <div className="parallax-slide-inner">
                <img
                  src={item.src}
                  alt={item.title}
                  className="parallax-image"
                  draggable={false}
                />
                <div className="parallax-overlay">
                  <h3 className="parallax-title">{item.title}</h3>
                  <div className="parallax-arrow">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GalleryPage;
