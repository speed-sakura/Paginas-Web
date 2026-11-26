// Ayudante compartido para escenas 3D de las demos (Three.js).
// Crea un canvas dentro de un contenedor, ajusta tamaño, y solo dibuja cuando está en pantalla.
import * as THREE from "three";
import { RoomEnvironment } from "./addons/RoomEnvironment.js";

export const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

export function webglOK() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { return false; }
}

export function createStage(container, { fov = 35, env = true, exposure = 1, maxDPR = 1.75 } = {}) {
  const canvas = document.createElement("canvas");
  canvas.className = "stage3d";
  canvas.setAttribute("aria-hidden", "true");
  container.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;
  const scene = new THREE.Scene();
  if (env) {
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  }
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 200);
  const stage = { THREE, renderer, scene, camera, canvas, container, w: 1, h: 1, visible: true, onFrame: null, onResize: null };
  function resize() {
    const r = container.getBoundingClientRect();
    stage.w = Math.max(1, r.width); stage.h = Math.max(1, r.height);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, maxDPR));
    renderer.setSize(stage.w, stage.h, false);
    camera.aspect = stage.w / stage.h; camera.updateProjectionMatrix();
    stage.onResize && stage.onResize(stage);
  }
  new ResizeObserver(resize).observe(container);
  resize();
  new IntersectionObserver(([e]) => { stage.visible = e.isIntersecting; }, { rootMargin: "100px" }).observe(container);
  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    if (!stage.visible) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    stage.onFrame && stage.onFrame(clock.elapsedTime, dt);
    renderer.render(scene, camera);
  })();
  return stage;
}

// Arrastrar para girar (mouse y dedo). Devuelve un objeto con rotación acumulada e inercia.
export function dragRotate(el, { speed = 0.008, axisY = true, axisX = false, idle = 0.25 } = {}) {
  const st = { y: 0, x: 0, vy: reduceMotion ? 0 : idle * 0.016, vx: 0, dragging: false, idle };
  let lx = 0, ly = 0;
  el.style.touchAction = axisX ? "none" : "pan-y";
  el.addEventListener("pointerdown", (e) => { st.dragging = true; lx = e.clientX; ly = e.clientY; el.setPointerCapture && el.setPointerCapture(e.pointerId); });
  el.addEventListener("pointermove", (e) => {
    if (!st.dragging) return;
    const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
    if (axisY) { st.vy = dx * speed; st.y += st.vy; }
    if (axisX) { st.vx = dy * speed; st.x += st.vx; }
  });
  const up = () => { st.dragging = false; };
  el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up); el.addEventListener("pointerleave", up);
  st.update = () => {
    if (!st.dragging) {
      const target = reduceMotion ? 0 : st.idle * 0.016;
      st.vy += (target - st.vy) * 0.04; st.y += st.vy;
      st.vx *= 0.92; st.x += st.vx; st.x *= 0.96;
    }
  };
  return st;
}

// Seguimiento suave del mouse (-0.5..0.5)
export function mouseFollow() {
  const m = { x: 0, y: 0, tx: 0, ty: 0 };
  if (!reduceMotion && matchMedia("(pointer: fine)").matches) addEventListener("pointermove", (e) => { m.tx = e.clientX / innerWidth - 0.5; m.ty = e.clientY / innerHeight - 0.5; }, { passive: true });
  m.update = () => { m.x += (m.tx - m.x) * 0.06; m.y += (m.ty - m.y) * 0.06; };
  return m;
}

// Textura de brillo radial para halos
export function glowTexture(THREE, color = "#ffffff") {
  const c = document.createElement("canvas"); c.width = c.height = 128;
  const g = c.getContext("2d"), grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, color); grd.addColorStop(0.35, color + "88"); grd.addColorStop(1, color + "00");
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export const progressOf = (el) => { const r = el.getBoundingClientRect(); return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight))); };
