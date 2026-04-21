/* ──────────────────────────────────────────────────────────────
   atelier-dust.js — ultra-subtle Three.js layer: slow ink-wash
   turbulence in multiply blend over the page. Not spectacle —
   depth the eye can rest in without a timeline (Step 7).

   Skipped when prefers-reduced-motion or WebGL unavailable.
   Pauses rAF when document is hidden.
   ────────────────────────────────────────────────────────────── */

import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";
import { motion } from "./motion.js";

const vertexShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;
precision highp int;

uniform float uTime;
uniform vec2 uRes;
uniform vec3 uInk;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    /* Slightly faster drift so the idle read is perceptible vs body grain. */
    p = rot * p * 2.0 + uTime * 0.12;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv * vec2(uRes.x / uRes.y, 1.0);
  vec2 flow = vec2(
    fbm(uv * 1.8 + uTime * 0.022),
    fbm(uv * 1.8 - uTime * 0.018)
  );
  float n = fbm(uv * 3.2 + flow * 0.6 + uTime * 0.028);
  n = smoothstep(0.28, 0.78, n) * 0.62;
  float vignette = smoothstep(1.05, 0.15, length(vUv - 0.5) * 1.35);
  float a = n * vignette * 0.94;
  gl_FragColor = vec4(uInk, a);
}
`;

export function initAtelierDust() {
  if (motion.prefersReducedMotion) return;

  const host = document.getElementById("atelier-dust");
  if (!host) return;

  try {
  const ink = [0x1a / 255, 0x16 / 255, 0x13 / 255];

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 10);
  camera.position.z = 1;

  const geo = new PlaneGeometry(2, 2);
  const mat = new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uRes: { value: new Vector2(window.innerWidth, window.innerHeight) },
      uInk: { value: ink },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
  });
  const mesh = new Mesh(geo, mat);
  scene.add(mesh);

  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  host.appendChild(renderer.domElement);

  let raf = 0;
  let running = true;

  const tick = (t) => {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    mat.uniforms.uTime.value = t * 0.001;
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);

  const onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    mat.uniforms.uRes.value.set(w, h);
    renderer.setSize(w, h);
  };
  window.addEventListener("resize", onResize, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else {
      running = true;
      raf = requestAnimationFrame(tick);
    }
  });
  } catch (_) {
    host.innerHTML = "";
  }
}
