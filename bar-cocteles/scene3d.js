// Escenas 3D con estilo de grabado (líneas de tinta) para Cinabrio.
// Si el navegador no soporta WebGL, la página sigue con las ilustraciones SVG.
import * as THREE from "three";

const RED = new THREE.Color("#d4100f"), CREAM = new THREE.Color("#f3ece0"), INK = new THREE.Color("#111111");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.getElementById("gl");
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" }); }
catch (e) { renderer = null; }

if (renderer) init();

function init() {
  document.body.classList.add("has3d");
  const mats = [];
  let pr = Math.min(devicePixelRatio || 1, 1.75);

  // ---------- Material "grabado": líneas que engrosan en la sombra ----------
  const VERT = `
    varying vec3 vN; varying vec3 vW; varying float vDepth;
    void main(){
      vec4 w = modelMatrix * vec4(position,1.0);
      vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal);
      vec4 mv = viewMatrix * w; vDepth = -mv.z;
      gl_Position = projectionMatrix * mv;
    }`;
  const FRAG = `
    uniform vec3 uPaper; uniform vec3 uInk; uniform vec3 uLight; uniform float uSpacing; uniform float uAngle;
    uniform float uAmbient; uniform float uAlpha; uniform vec3 uFog; uniform float uFogNear; uniform float uFogFar;
    varying vec3 vN; varying vec3 vW; varying float vDepth;
    float lines(float coord, float width){
      float f = abs(fract(coord) - 0.5) * 2.0;
      float aa = fwidth(coord) * 1.5;
      return 1.0 - smoothstep(width - aa, width + aa, 1.0 - f);
    }
    void main(){
      vec3 n = normalize(vN);
      if (!gl_FrontFacing) n = -n;
      float d = max(dot(n, normalize(uLight)), 0.0);
      float tone = clamp(uAmbient + (1.0 - uAmbient) * d, 0.0, 1.0);
      vec2 p = gl_FragCoord.xy;
      float c = cos(uAngle), s = sin(uAngle);
      float wob = sin(vW.y * 2.7 + vW.x * 1.3 + vW.z) * 0.35;
      float c1 = (p.x * c + p.y * s) / uSpacing + wob;
      float c2 = (p.x * s - p.y * c) / uSpacing + wob;
      float w1 = (1.0 - tone) * 0.95;
      float ink = 1.0 - lines(c1, w1);
      float ink2 = tone < 0.38 ? 1.0 - lines(c2, (0.38 - tone) * 1.6) : 0.0;
      float k = max(ink, ink2);
      vec3 col = mix(uPaper, uInk, k);
      float fog = smoothstep(uFogNear, uFogFar, vDepth);
      col = mix(col, uFog, fog);
      if (uAlpha < 0.5 && k < 0.5) discard;
      gl_FragColor = vec4(col, 1.0);
    }`;
  function engrave(paper, o = {}) {
    const m = new THREE.ShaderMaterial({
      uniforms: {
        uPaper: { value: new THREE.Color(paper) }, uInk: { value: INK.clone() },
        uLight: { value: (o.light || new THREE.Vector3(-0.6, 0.7, 0.5)).clone().normalize() },
        uSpacing: { value: (o.spacing || 5) * pr }, uAngle: { value: o.angle ?? 0 },
        uAmbient: { value: o.ambient ?? 0.18 }, uAlpha: { value: o.alpha ?? 1 },
        uFog: { value: new THREE.Color(o.fog || "#000") }, uFogNear: { value: o.fogNear ?? 1e4 }, uFogFar: { value: o.fogFar ?? 2e4 }
      },
      vertexShader: VERT, fragmentShader: FRAG, side: o.side || THREE.FrontSide
    });
    m.userData.spacing = o.spacing || 5; mats.push(m); return m;
  }
  const outlineMat = (thick = 0.03, color = INK) => new THREE.ShaderMaterial({
    uniforms: { uT: { value: thick }, uC: { value: color } },
    vertexShader: `uniform float uT; void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * uT, 1.0); }`,
    fragmentShader: `uniform vec3 uC; void main(){ gl_FragColor = vec4(uC, 1.0); }`, side: THREE.BackSide
  });
  function mesh(geo, mat, outline = 0.03) {
    const g = new THREE.Group();
    const m = new THREE.Mesh(geo, mat); g.add(m);
    if (outline) g.add(new THREE.Mesh(geo, outlineMat(outline)));
    return g;
  }

  // ---------- Escena 1: pasillo de columnas hasta la barra ----------
  const s1 = new THREE.Scene(); s1.background = new THREE.Color("#0b0202");
  const cam1 = new THREE.PerspectiveCamera(55, 1, 0.1, 80);
  const fog1 = { fog: "#0b0202", fogNear: 18, fogFar: 50 };
  const L1 = new THREE.Vector3(0.7, 0.6, 0.45);
  const redM = engrave(RED, { light: L1, spacing: 5.5, ambient: 0.38, ...fog1 });
  const floorM = engrave(RED, { light: new THREE.Vector3(0.2, 0.5, 0.9), spacing: 6, angle: 1.2, ambient: 0.35, ...fog1 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(9, 60), floorM); floor.rotation.x = -Math.PI / 2; floor.position.z = -16; s1.add(floor);
  const grid = new THREE.GridHelper(60, 60, 0x3a0000, 0x3a0000); grid.position.set(0, 0.01, -16); grid.scale.x = 9 / 60; s1.add(grid);
  const shaft = new THREE.CylinderGeometry(0.42, 0.5, 5.2, 28), base = new THREE.BoxGeometry(1.3, 0.4, 1.3), cap = new THREE.BoxGeometry(1.35, 0.35, 1.35), ring = new THREE.TorusGeometry(0.5, 0.08, 10, 28);
  for (let i = 0; i < 11; i++) for (const sx of [-1, 1]) {
    const col = new THREE.Group();
    const sh = mesh(shaft, redM, 0.025); sh.position.y = 3.0; col.add(sh);
    const b = mesh(base, redM, 0.025); b.position.y = 0.2; col.add(b);
    const c = mesh(cap, redM, 0.025); c.position.y = 5.78; col.add(c);
    const r = new THREE.Mesh(ring, redM); r.rotation.x = Math.PI / 2; r.position.y = 5.45; col.add(r);
    col.position.set(sx * 3.2, 0, -i * 3.4);
    s1.add(col);
  }
  for (let i = 0; i < 11; i++) { const l = mesh(new THREE.BoxGeometry(7.8, 0.6, 1.4), redM, 0.02); l.position.set(0, 6.25, -i * 3.4); s1.add(l); }
  // pared del fondo con luna roja y figura
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), engrave(RED, { light: new THREE.Vector3(0, 0.3, 1), ambient: 0.55, spacing: 4, ...fog1 })); wall.position.set(0, 4.5, -36); s1.add(wall);
  const moon = new THREE.Mesh(new THREE.CircleGeometry(2.4, 48), new THREE.MeshBasicMaterial({ color: "#ff2a1f" })); moon.position.set(0, 3.8, -35.9); s1.add(moon);
  const moonRing = mesh(new THREE.TorusGeometry(2.55, 0.16, 12, 64), engrave(CREAM, { light: new THREE.Vector3(0, 0.5, 1) }), 0.02); moonRing.position.set(0, 3.8, -35.8); s1.add(moonRing);
  const figure = new THREE.Group();
  const cloak = new THREE.Mesh(new THREE.ConeGeometry(0.95, 3.2, 32), new THREE.MeshBasicMaterial({ color: "#050000" })); cloak.position.y = 1.6; figure.add(cloak);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.33, 24, 16), new THREE.MeshBasicMaterial({ color: "#050000" })); head.position.y = 3.35; figure.add(head);
  figure.position.set(0, 0, -31.5); s1.add(figure);
  const bar = mesh(new THREE.BoxGeometry(4.4, 1.15, 1.1), engrave(CREAM, { light: L1, ...fog1, fogNear: 30, fogFar: 60 }), 0.03); bar.position.set(0, 0.58, -29.5); s1.add(bar);
  const bottles = [];
  ["#f4d23c", "#3fd16a", "#3aa0ff", "#ff7a2a"].forEach((c, i) => {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.7, 16), new THREE.MeshBasicMaterial({ color: c }));
    b.position.set(-0.9 + i * 0.6, 1.5, -29.5); s1.add(b); bottles.push(b);
    const glow = new THREE.Mesh(new THREE.CircleGeometry(0.42, 24), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.22, depthWrite: false }));
    glow.position.set(b.position.x, 1.55, -29.6); s1.add(glow);
  });

  // ---------- Escena 2: botella y copa ----------
  const s2 = new THREE.Scene(); s2.background = RED.clone();
  const cam2 = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
  const L2 = new THREE.Vector3(-0.5, 0.8, 0.6);
  const glassProfile = [[0, 0], [0.95, 0], [0.95, 0.07], [0.12, 0.14], [0.07, 0.4], [0.07, 1.55], [0.12, 1.66], [1.32, 2.92], [1.28, 2.95], [0.1, 1.72], [0, 1.7]].map(([x, y]) => new THREE.Vector2(x, y));
  const glass = new THREE.Group();
  const glassGeo = new THREE.LatheGeometry(glassProfile, 64);
  glass.add(new THREE.Mesh(glassGeo, engrave(CREAM, { light: L2, spacing: 6, ambient: 0.5, alpha: 0, side: THREE.DoubleSide })));
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.025, 8, 64), new THREE.MeshBasicMaterial({ color: "#111" })); rim.rotation.x = Math.PI / 2; rim.position.y = 2.935; glass.add(rim);
  s2.add(glass);
  const LQ_H = 1.2, LQ_R = 1.2 * (1.2 / 1.26);
  const liqGeo = new THREE.ConeGeometry(LQ_R, LQ_H, 48, 1, false); liqGeo.rotateX(Math.PI); liqGeo.translate(0, LQ_H / 2, 0);
  const liquid = new THREE.Mesh(liqGeo, engrave("#f4d23c", { light: new THREE.Vector3(0.2, 1, 0.4), spacing: 6, ambient: 0.8 })); liquid.position.y = 1.7; liquid.scale.setScalar(0.001); s2.add(liquid);
  const foam = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.1, 48), engrave("#fff8e6", { light: new THREE.Vector3(0, 1, 0.3), ambient: 0.7 })); foam.visible = false; s2.add(foam);
  const drops = [0, 1, 2].map((i) => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshBasicMaterial({ color: "#3a0505" })); d.position.set(-0.25 + i * 0.25, 6, 0.1); d.visible = false; s2.add(d); return d; });
  const bottle = new THREE.Group();
  const bProfile = [[0, 0], [0.55, 0], [0.6, 0.12], [0.6, 1.95], [0.5, 2.35], [0.21, 2.65], [0.19, 3.3], [0.23, 3.34], [0.23, 3.5], [0, 3.5]].map(([x, y]) => new THREE.Vector2(x, y - 1.75));
  const bGeo = new THREE.LatheGeometry(bProfile, 48);
  bottle.add(mesh(bGeo, engrave(CREAM, { light: L2, spacing: 4.5 }), 0.03));
  const label = mesh(new THREE.CylinderGeometry(0.615, 0.615, 0.9, 48, 1, true), engrave(RED, { light: L2, spacing: 4.5, side: THREE.DoubleSide }), 0);
  label.position.y = 0.95 - 1.75; bottle.add(label);
  s2.add(bottle);
  const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1, 10).translate(0, -0.5, 0), new THREE.MeshBasicMaterial({ color: "#f4d23c" })); stream.visible = false; s2.add(stream);
  const mouthLocal = new THREE.Vector3(0, 1.75, 0), mouth = new THREE.Vector3();

  // ---------- Escena 3: columnas que se rompen ----------
  const s3 = new THREE.Scene(); s3.background = RED.clone();
  const cam3 = new THREE.PerspectiveCamera(40, 1, 0.1, 80);
  const L3 = new THREE.Vector3(0.5, 0.7, 0.6);
  const stoneM = engrave(CREAM, { light: L3, spacing: 4.5, ambient: 0.12 });
  const pieces = [];
  const drum = new THREE.CylinderGeometry(0.72, 0.72, 0.6, 28);
  const cols = [];
  for (const sx of [-1, 1]) {
    const col = new THREE.Group(); s3.add(col); cols.push(col);
    const add = (geo, y, h) => {
      const p = mesh(geo, stoneM, 0.03); p.position.y = y; col.add(p);
      const dir = new THREE.Vector3(sx * (0.6 + Math.random() * 1.6), -0.4 + Math.random() * 1.4, 0.3 + Math.random() * 1.6);
      pieces.push({ obj: p, home: p.position.clone(), dir, spin: new THREE.Vector3(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2), delay: (1 - h) * 0.28 });
    };
    add(new THREE.BoxGeometry(1.8, 0.45, 1.8), 0.22, 0);
    for (let i = 0; i < 9; i++) add(drum, 0.75 + i * 0.62, (i + 1) / 10);
    add(new THREE.BoxGeometry(1.9, 0.5, 1.9), 6.5, 1);
    for (let i = 0; i < 26; i++) {
      const sh = mesh(new THREE.DodecahedronGeometry(0.12 + Math.random() * 0.22, 0), stoneM, 0.02);
      const y = 0.6 + Math.random() * 5.6; sh.position.set((Math.random() - 0.5) * 1.2, y, (Math.random() - 0.5) * 1.2); sh.scale.setScalar(0.001); col.add(sh);
      pieces.push({ obj: sh, home: sh.position.clone(), dir: new THREE.Vector3(sx * (1 + Math.random() * 3), Math.random() * 2.4 - 0.6, Math.random() * 3), spin: new THREE.Vector3(Math.random() * 8, Math.random() * 8, 0), delay: (1 - y / 6.5) * 0.28, shard: true });
    }
  }

  // ---------- Bucle y scroll ----------
  const sections = { hero: document.querySelector(".hero"), pour: document.getElementById("pour"), house: document.querySelector(".house") };
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  if (!reduce) addEventListener("pointermove", (e) => { mouse.tx = e.clientX / innerWidth - 0.5; mouse.ty = e.clientY / innerHeight - 0.5; }, { passive: true });
  let W = 0, H = 0;
  function resize() {
    W = innerWidth; H = innerHeight; pr = Math.min(devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(pr); renderer.setSize(W, H, false);
    mats.forEach((m) => m.uniforms.uSpacing.value = m.userData.spacing * pr);
    [cam1, cam2, cam3].forEach((c) => { c.aspect = W / H; c.updateProjectionMatrix(); });
    const narrow = W / H < 0.9;
    cols[0].position.set(narrow ? -2.9 : -5.7, 0, narrow ? -3 : 0); cols[1].position.set(narrow ? 2.9 : 5.7, 0, narrow ? -3 : 0);
    if (narrow) cam2.setViewOffset(W, H, 0, -H * 0.14, W, H); else cam2.setViewOffset(W, H, -W * 0.2, 0, W, H);
  }
  addEventListener("resize", resize); resize();

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const prog = (el) => { const r = el.getBoundingClientRect(); return { r, p: clamp(-r.top / Math.max(1, r.height - H)) }; };
  const visible = (r) => Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0));

  function frame(t) {
    requestAnimationFrame(frame);
    mouse.x += (mouse.tx - mouse.x) * 0.06; mouse.y += (mouse.ty - mouse.y) * 0.06;
    const a = prog(sections.hero), b = prog(sections.pour), c = prog(sections.house);
    const vis = [[visible(a.r), 1], [visible(b.r), 2], [visible(c.r), 3]].sort((x, y) => y[0] - x[0]);
    if (vis[0][0] <= 0) { canvas.style.visibility = "hidden"; return; }
    canvas.style.visibility = "visible";
    const time = t / 1000;
    if (vis[0][1] === 1) {
      const p = a.p, z = 13 - ease(p) * 30;
      cam1.position.set(mouse.x * 1.2 + Math.sin(time * 0.3) * 0.08, 1.9 - mouse.y * 0.4, z);
      cam1.lookAt(mouse.x * 0.6, 2.4, z - 12);
      bottles.forEach((bt, i) => bt.position.y = 1.5 + Math.sin(time * 2 + i) * 0.03);
      sections.hero.style.setProperty("--hp", p.toFixed(3));
      renderer.render(s1, cam1);
    } else if (vis[0][1] === 2) {
      const p = b.p, narrow = W / H < 0.9, dist = narrow ? 15 : 10.5;
      const ang = (p - 0.5) * 0.7 + mouse.x * 0.25;
      cam2.position.set(Math.sin(ang) * dist, 3.6 - mouse.y * 0.6, Math.cos(ang) * dist);
      cam2.lookAt(0, 3, 0);
      // botella: entra, se inclina, sirve y vuelve
      const tin = ease(clamp(p / 0.22)), tout = ease(clamp((p - 0.66) / 0.16));
      const tilt = -0.35 - (2.05 - 0.35) * tin + (2.05 + 0.1) * tout;
      bottle.rotation.z = tilt;
      const pt = -0.35 - (2.05 - 0.35) * tin;
      const mx = -Math.sin(pt) * 1.75, my = Math.cos(pt) * 1.75;
      const targetX = 0.05 - mx, targetY = 4.45 - my;
      const startX = -1.9, startY = 4.2, outX = 2.9, outY = 4.6;
      const bx = startX + (targetX - startX) * tin, by = startY + (targetY - startY) * tin;
      bottle.position.set(bx + (outX - bx) * tout, by + (outY - by) * tout, 0);
      // líquido
      const fill = clamp((p - 0.2) / 0.44);
      liquid.scale.setScalar(Math.max(0.001, Math.cbrt(fill) * 0.98));
      const surf = 1.7 + LQ_H * Math.cbrt(fill) * 0.98;
      bottle.updateMatrixWorld(); mouth.copy(mouthLocal).applyMatrix4(bottle.matrixWorld);
      stream.visible = fill > 0 && fill < 1 && tin > 0.95;
      if (stream.visible) { stream.position.set(mouth.x, mouth.y, mouth.z); stream.scale.y = Math.max(0.01, mouth.y - surf); }
      const fo = clamp((p - 0.64) / 0.12);
      foam.visible = fo > 0; foam.position.y = surf + 0.04; foam.scale.set(LQ_R * Math.cbrt(fill) * 0.98 * fo, 1, LQ_R * Math.cbrt(fill) * 0.98 * fo);
      drops.forEach((d, i) => { const q = clamp((p - 0.82 - i * 0.03) / 0.08); d.visible = q > 0 && q < 1; d.position.y = 6 - (6 - surf) * q; });
      renderer.render(s2, cam2);
    } else {
      const p = c.p;
      cam3.position.set(mouse.x * 1.5, 3.3 - mouse.y * 0.8, 13); cam3.lookAt(0, 3.3, 0);
      pieces.forEach((pc) => {
        const k = ease(clamp((p - 0.12 - pc.delay) / 0.5));
        pc.obj.position.copy(pc.home).addScaledVector(pc.dir, k * 3.2);
        pc.obj.position.y -= k * k * 0.8;
        pc.obj.rotation.set(pc.spin.x * k, pc.spin.y * k, pc.spin.z * k);
        if (pc.shard) pc.obj.scale.setScalar(Math.max(0.001, Math.min(1, k * 4)));
      });
      cols.forEach((col, i) => col.rotation.y = Math.sin(time * 0.4 + i) * 0.05);
      renderer.render(s3, cam3);
    }
  }
  requestAnimationFrame(frame);
}
