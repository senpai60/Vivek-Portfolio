import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const title3Ref = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 3 }); // Coordinate with Intro out

    gsap.set([title1Ref.current, title2Ref.current, title3Ref.current], {
      yPercent: 120,
      opacity: 0,
    });
    gsap.set(lineRef.current, { scaleX: 0 });

    tl.to([title1Ref.current, title2Ref.current, title3Ref.current], {
      yPercent: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power4.out",
      stagger: 0.15,
    });

    tl.to(
      lineRef.current,
      {
        scaleX: 1,
        duration: 1.5,
        ease: "power3.inOut",
      },
      "-=1",
    );

    // Scroll Parallax Animation
    gsap.to(title1Ref.current, {
      xPercent: -15,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(title2Ref.current, {
      xPercent: 15,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(heroRef.current, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const titleStyle = {
    fontFamily: "var(--font-heading)",
    fontSize: "clamp(3rem, 12vw, 15rem)",
    lineHeight: 0.9,
    textTransform: "uppercase",
    margin: 0,
    whiteSpace: "nowrap",
    willChange: "transform",
  };

  const overflowHidden = {
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    width: "100%",
  };

  return (
    <section
      ref={heroRef}
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 4rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={overflowHidden}>
        <h1 ref={title1Ref} style={titleStyle}>
          Creative
        </h1>
      </div>
      <div style={{ ...overflowHidden, justifyContent: "flex-end" }}>
        <h1
          ref={title2Ref}
          style={{
            ...titleStyle,
            color: "transparent",
            WebkitTextStroke: "1px var(--text-color)",
          }}
        >
          Developer
        </h1>
      </div>
      <div style={overflowHidden}>
        <h1 ref={title3Ref} style={titleStyle}>
          Vivek Satloniya
        </h1>
      </div>

      <div
        ref={lineRef}
        className="divider"
        style={{
          position: "absolute",
          bottom: "10vh",
          left: "4rem",
          width: "calc(100% - 8rem)",
        }}
      />
    </section>
  );
};

export default Hero;
