import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

/* ─────────────────────────────────────────
   GLSL — Vertex Shader
───────────────────────────────────────── */
const vertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/* ─────────────────────────────────────────
   GLSL — Fragment Shader
   Fluid expanding-colony reveal from mouse.
   Uses 2D value noise for the organic edge.
───────────────────────────────────────── */
const fragmentShader = /* glsl */`
  precision highp float;
  varying vec2 vUv;

  uniform sampler2D uTex1;      // og-hero
  uniform sampler2D uTex2;      // blue-hero
  uniform vec2  uMouse;         // reveal origin in [0,1] image space
  uniform float uProgress;      // 0 → 1 driven by GSAP
  uniform float uTime;          // seconds, for edge animation

  // ── 2D Value noise ───────────────────────
  float rand(vec2 n) {
    return fract(sin(dot(n, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);       // cubic Hermite
    return mix(
      mix(rand(i),            rand(i + vec2(1.0, 0.0)), u.x),
      mix(rand(i + vec2(0.0,1.0)), rand(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {                        // fractal Brownian motion
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.1;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;

    // ── Distance from mouse-origin in uv space ──
    vec2 delta = uv - uMouse;
    float dist  = length(delta);

    // ── Organic fbm noise offset for the fluid edge ──
    // The noise shifts in time so the boundary "breathes"
    float n = fbm(uv * 3.5 + uTime * 0.4) * 0.18
            - fbm(uv * 6.0 - uTime * 0.25) * 0.06;

    // ── Expanding fluid mask ──
    // inner: sharp centre of the colony
    // outer: soft, noisy perimeter
    float radius    = uProgress * 1.65;     // max > 1.4 to fully cover corners
    float edgeWidth = 0.06 + abs(n) * 0.12; // thicker where noise is larger

    float mask = smoothstep(
      radius - edgeWidth,
      radius + edgeWidth * 0.3,
      1.0 - dist + n
    );

    vec4 col1 = texture2D(uTex1, uv);
    vec4 col2 = texture2D(uTex2, uv);

    gl_FragColor = mix(col1, col2, mask);
  }
`;

/* ─────────────────────────────────────────
   React component
───────────────────────────────────────── */
const PortraitHover = () => {
  const mountRef    = useRef(null);   // div to mount canvas into
  const threeRef    = useRef(null);   // { scene, camera, renderer, material, clock }
  const gsapTlRef   = useRef(null);
  const entryTimer  = useRef(null);

  /* ── Bootstrap Three.js once ── */
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    mount.appendChild(renderer.domElement);

    // Scene + Camera (orthographic quad)
    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Load both textures
    const loader  = new THREE.TextureLoader();
    const tex1    = loader.load('/images/og-hero.png');
    const tex2    = loader.load('/images/blue-hero.png');
    [tex1, tex2].forEach(t => {
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
    });

    // Full-screen quad
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTex1:      { value: tex1 },
        uTex2:      { value: tex2 },
        uMouse:     { value: new THREE.Vector2(0.5, 0.5) },
        uProgress:  { value: 0.0 },
        uTime:      { value: 0.0 },
      },
    });

    scene.add(new THREE.Mesh(geometry, material));

    const clock = new THREE.Clock();
    let rafId;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    threeRef.current = { renderer, material, scene, camera, clock };

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      renderer.domElement.remove();
    };
  }, []);

  /* ── Mouse interaction ── */
  const getUV = (e) => {
    const rect = mountRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left)  / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height; // flip Y for WebGL
    return { x, y };
  };

  const onMouseEnter = (e) => {
    const { x, y } = getUV(e);
    const mat = threeRef.current?.material;
    if (!mat) return;

    // Set origin to mouse position
    mat.uniforms.uMouse.value.set(x, y);

    clearTimeout(entryTimer.current);
    gsapTlRef.current?.kill();

    entryTimer.current = setTimeout(() => {
      gsapTlRef.current = gsap.to(mat.uniforms.uProgress, {
        value: 1,
        duration: 0.65,
        ease: 'power3.out',
      });
    }, 100);
  };

  const onMouseLeave = (e) => {
    clearTimeout(entryTimer.current);
    gsapTlRef.current?.kill();

    const { x, y } = getUV(e);
    const mat = threeRef.current?.material;
    if (!mat) return;

    // Collapse back from the exit point
    mat.uniforms.uMouse.value.set(x, y);
    gsapTlRef.current = gsap.to(mat.uniforms.uProgress, {
      value: 0,
      duration: 0.45,
      ease: 'power3.in',
    });
  };

  useEffect(() => () => {
    clearTimeout(entryTimer.current);
    gsapTlRef.current?.kill();
  }, []);

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', cursor: 'none' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* WebGL canvas mounts here */}
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
        background: 'linear-gradient(to top, rgba(11,11,11,0.72) 0%, transparent 50%)',
      }} />

      {/* Caption */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: '2rem', zIndex: 11,
        fontFamily: 'var(--font-body)', fontSize: '0.7rem',
        textTransform: 'uppercase', letterSpacing: '0.15em',
        opacity: 0.6, color: 'var(--text-color)', userSelect: 'none', pointerEvents: 'none',
      }}>
        Vivek Satloniya — 2025
      </div>
    </div>
  );
};

export default PortraitHover;
