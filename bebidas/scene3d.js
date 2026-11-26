// Latas 3D (Three.js) para Kausay: carrusel que se arrastra y lata que gira al cambiar de sabor.
import * as THREE from "three";
import { createStage, webglOK, dragRotate, mouseFollow, reduceMotion } from "../vendor/stage.js";

if (webglOK()) {
  document.body.classList.add("has3d");
  const B = window.BRAND;

  function labelTex(f) {
    const c = document.createElement("canvas"); c.width = 1024; c.height = 512;
    const g = c.getContext("2d");
    g.fillStyle = f.can; g.fillRect(0, 0, 1024, 512);
    const grd = g.createLinearGradient(0, 0, 0, 512); grd.addColorStop(0, "rgba(255,255,255,.12)"); grd.addColorStop(1, "rgba(0,0,0,.25)"); g.fillStyle = grd; g.fillRect(0, 0, 1024, 512);
    for (const cx of [256, 768]) {
      g.save(); g.translate(cx, 250); g.rotate(-Math.PI / 2);
      g.fillStyle = "#fff"; g.font = "900 150px Unbounded, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
      let size = 150; while (g.measureText(B.name.toUpperCase()).width > 440 && size > 60) { size -= 6; g.font = `900 ${size}px Unbounded, sans-serif`; }
      g.fillText(B.name.toUpperCase(), 0, 0); g.restore();
      g.fillStyle = "#fff"; g.font = "600 30px Inter, sans-serif"; g.textAlign = "center";
      g.fillText(f.name.toUpperCase(), cx + 128, 470);
      g.beginPath(); g.arc(cx - 128, 60, 16, 0, 7); g.fill();
    }
    g.fillStyle = "rgba(255,255,255,.85)"; g.font = "500 18px Inter, sans-serif"; g.textAlign = "left";
    g.fillText(`${f.kcal} kcal · 355 ml · Hecho en Perú`, 530, 40);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  }
  const texCache = {}; const texOf = (f) => texCache[f.id] || (texCache[f.id] = labelTex(f));

  // Perfil de lata
  const H = 2.4, R = 0.62;
  const metalProf = [[0, -H / 2], [R * 0.78, -H / 2], [R * 0.95, -H / 2 + 0.05], [R, -H / 2 + 0.2], [R, -H / 2 + 0.24]].map(([x, y]) => new THREE.Vector2(x, y));
  const topProf = [[R, H / 2 - 0.24], [R, H / 2 - 0.2], [R * 0.84, H / 2 - 0.02], [R * 0.86, H / 2 + 0.02], [R * 0.8, H / 2 + 0.03], [R * 0.78, H / 2 - 0.02], [0, H / 2 - 0.02]].map(([x, y]) => new THREE.Vector2(x, y));
  const metal = new THREE.MeshStandardMaterial({ color: "#d7dade", metalness: 1, roughness: 0.25 });
  const bodyGeo = new THREE.CylinderGeometry(R, R, H - 0.48, 64, 1, true);
  const botGeo = new THREE.LatheGeometry(metalProf, 64), topGeo = new THREE.LatheGeometry(topProf, 64);
  const tabGeo = new THREE.BoxGeometry(0.3, 0.02, 0.16);
  function can(f) {
    const g = new THREE.Group();
    const mat = new THREE.MeshPhysicalMaterial({ map: texOf(f), metalness: 0.45, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.15 });
    const body = new THREE.Mesh(bodyGeo, mat); body.rotation.y = -Math.PI / 2; g.add(body);
    g.add(new THREE.Mesh(botGeo, metal), new THREE.Mesh(topGeo, metal));
    const tab = new THREE.Mesh(tabGeo, metal); tab.position.set(0.12, H / 2 - 0.0, 0); g.add(tab);
    g.userData.mat = mat;
    return g;
  }
  const lights = (scene) => {
    const key = new THREE.DirectionalLight("#ffffff", 2); key.position.set(-3, 4, 5); scene.add(key);
    const rim = new THREE.DirectionalLight("#ff8fc8", 2); rim.position.set(4, 1, -4); scene.add(rim);
  };

  // ---------- Carrusel de la portada ----------
  const hero = document.querySelector(".hero");
  const box = document.createElement("div"); box.className = "cans3d";
  hero.insertBefore(box, hero.querySelector(".hero__copy"));
  const A = createStage(box, { fov: 30, exposure: 1.05 });
  lights(A.scene);
  const ring = new THREE.Group(); A.scene.add(ring);
  const N = 8, cans = [];
  for (let i = 0; i < N; i++) { const c = can(B.flavors[i % B.flavors.length]); const a = (i / N) * Math.PI * 2; c.userData.a = a; ring.add(c); cans.push(c); }
  let radius = 4.2;
  A.onResize = (st) => {
    const narrow = st.w / st.h < 0.9; radius = narrow ? 2.6 : 4.2;
    A.camera.position.set(0, 2.4, narrow ? 15 : 14.5); A.camera.lookAt(0, -0.6, 0);
  };
  A.onResize(A);
  const drag = dragRotate(box, { speed: 0.006, idle: 0.25 });
  const mouse = mouseFollow();
  let enter = 0;
  A.onFrame = (t) => {
    drag.update(); mouse.update(); enter = Math.min(1, t / 1.4);
    const e = 1 - Math.pow(1 - enter, 3);
    ring.rotation.y = drag.y; ring.position.y = (A.w / A.h < 0.9 ? -3.4 : -2.9) - (1 - e) * 2; ring.scale.setScalar(A.w / A.h < 0.9 ? 0.72 : 1);
    ring.rotation.x = mouse.y * 0.15;
    cans.forEach((c, i) => {
      c.position.set(Math.cos(c.userData.a) * radius * e, Math.sin(t * 1.2 + i) * 0.15, Math.sin(c.userData.a) * radius * e);
      c.rotation.y = -c.userData.a - Math.PI / 2 + Math.PI;
      c.rotation.z = Math.sin(t * 0.8 + i) * 0.12;
    });
  };

  // ---------- Lata del sabor ----------
  const fBox = document.getElementById("fCan");
  const holder = document.createElement("div"); holder.className = "fcan3d"; fBox.appendChild(holder);
  const C = createStage(holder, { fov: 28, exposure: 1.05 });
  C.camera.position.set(0, 0.3, 7.4);
  lights(C.scene);
  const hero1 = can(B.flavors[0]); C.scene.add(hero1);
  const dragC = dragRotate(holder, { speed: 0.01, idle: 0.3 });
  let spin = 0, cur = null;
  const obs = new MutationObserver(() => {
    const name = document.getElementById("fName").textContent, f = B.flavors.find((x) => x.name === name);
    if (f && f !== cur) { cur = f; hero1.userData.mat.map = texOf(f); hero1.userData.mat.needsUpdate = true; spin = 1; }
  });
  obs.observe(document.getElementById("fName"), { childList: true, characterData: true, subtree: true });
  C.onFrame = (t, dt) => {
    dragC.update();
    spin = Math.max(0, spin - dt * 1.6);
    const s = reduceMotion ? 0 : spin * spin * Math.PI * 2;
    hero1.rotation.set(0.12, dragC.y + s, Math.sin(t * 0.9) * 0.08 - 0.1);
    hero1.position.y = Math.sin(t * 1.1) * 0.12;
    hero1.scale.setScalar(1 - spin * 0.08);
  };
  if (document.fonts) document.fonts.ready.then(() => { Object.keys(texCache).forEach((k) => delete texCache[k]); cans.forEach((c, i) => { c.userData.mat.map = texOf(B.flavors[i % B.flavors.length]); c.userData.mat.needsUpdate = true; }); if (cur) { hero1.userData.mat.map = texOf(cur); hero1.userData.mat.needsUpdate = true; } });
}
