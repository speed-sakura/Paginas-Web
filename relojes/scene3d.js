// Reloj 3D (Three.js) para Cumbre: caja de titanio, pantalla con hora real y correas que cambian de color.
import * as THREE from "three";
import { RoundedBoxGeometry } from "../vendor/addons/RoundedBoxGeometry.js";
import { createStage, webglOK, dragRotate, mouseFollow, progressOf, reduceMotion } from "../vendor/stage.js";

if (webglOK()) {
  document.body.classList.add("has3d");
  const S = window.STORE;

  // ---------- Pantalla dibujada en canvas ----------
  function limaTime() { return new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Lima" }); }
  function limaDate() { return new Date().toLocaleDateString("es-PE", { weekday: "short", day: "numeric", timeZone: "America/Lima" }).toUpperCase(); }
  function makeScreen() {
    const c = document.createElement("canvas"); c.width = 520; c.height = 640;
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const g = c.getContext("2d");
    let mode = "time", accent = "#ff6a1a", last = "";
    function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
    function draw(t = 0) {
      const key = mode + accent + limaTime() + (mode === "heart" ? Math.floor(t * 8) : "");
      if (key === last) return; last = key;
      g.clearRect(0, 0, 520, 640); rr(0, 0, 520, 640, 110); g.fillStyle = "#000"; g.fill();
      g.textAlign = "left"; g.textBaseline = "alphabetic";
      const label = (txt) => { g.fillStyle = accent; g.font = "600 30px Archivo, sans-serif"; g.fillText(txt, 60, 140); };
      const row = (a, b, y) => { g.fillStyle = "#9a9a9a"; g.font = "500 30px Archivo, sans-serif"; g.fillText(a, 60, y); g.fillStyle = "#fff"; g.textAlign = "right"; g.font = "700 38px Archivo, sans-serif"; g.fillText(b, 460, y); g.textAlign = "left"; };
      const big = (txt, unit) => { g.fillStyle = "#fff"; g.font = "800 150px Archivo, sans-serif"; g.fillText(txt, 52, 300); if (unit) { const w = g.measureText(txt).width; g.font = "600 40px Archivo, sans-serif"; g.fillText(unit, 62 + w, 300); } };
      if (mode === "time") {
        label(limaDate()); big(limaTime()); row("Huascarán", "-2°", 400);
        rr(60, 450, 400, 18, 9); g.fillStyle = "#222"; g.fill(); const grd = g.createLinearGradient(60, 0, 460, 0); grd.addColorStop(0, accent); grd.addColorStop(1, "#ffd21a"); rr(60, 450, 290, 18, 9); g.fillStyle = grd; g.fill();
      } else if (mode === "run") { label("TROTE · COSTA VERDE"); big("12.4", "km"); row("Ritmo", "5:12", 400); row("Tiempo", "1:04:46", 470); }
      else if (mode === "heart") {
        label("RITMO CARDIACO"); big("128", "LPM");
        g.strokeStyle = accent; g.lineWidth = 8; g.lineJoin = "round"; g.beginPath();
        const off = (t * 160) % 400;
        for (let x = 0; x <= 400; x += 4) { const k = ((x + off) % 200); const y = k > 80 && k < 92 ? -70 : k > 92 && k < 104 ? 60 : k > 104 && k < 112 ? -20 : 0; x ? g.lineTo(60 + x, 390 + y) : g.moveTo(60 + x, 390 + y); }
        g.stroke(); row("Zona 3", "Aeróbica", 520);
      } else { label("BUCEO · PARACAS"); big("18.6", "m"); row("Agua", "17°", 400); row("Bajo el agua", "24:10", 470); }
      tex.needsUpdate = true;
    }
    return { tex, draw, set: (m, a) => { mode = m || mode; accent = a || accent; last = ""; } };
  }

  // ---------- Modelo del reloj ----------
  const ti = new THREE.MeshPhysicalMaterial({ color: "#cfcdc7", metalness: 1, roughness: 0.32, clearcoat: 0.3 });
  const caseGeo = new RoundedBoxGeometry(2.05, 2.45, 0.62, 6, 0.42);
  const bezelGeo = new RoundedBoxGeometry(1.86, 2.26, 0.08, 6, 0.36);
  const strapGeo = new RoundedBoxGeometry(1.48, 2.0, 0.16, 4, 0.07);
  function strapTex() {
    const c = document.createElement("canvas"); c.width = 64; c.height = 256; const g = c.getContext("2d");
    g.fillStyle = "#fff"; g.fillRect(0, 0, 64, 256); g.fillStyle = "#bbb"; for (let y = 0; y < 256; y += 6) g.fillRect(0, y, 64, 2);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 3); return t;
  }
  const sTex = strapTex();
  function watch() {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(caseGeo, ti));
    const bezel = new THREE.Mesh(bezelGeo, new THREE.MeshStandardMaterial({ color: "#050505", roughness: 0.2 })); bezel.position.z = 0.29; g.add(bezel);
    const scr = makeScreen();
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.62, 1.99), new THREE.MeshBasicMaterial({ map: scr.tex, transparent: true, toneMapped: false })); screen.position.z = 0.335; g.add(screen);
    const glass = new THREE.Mesh(new RoundedBoxGeometry(1.86, 2.26, 0.02, 4, 0.36), new THREE.MeshPhysicalMaterial({ color: "#ffffff", transparent: true, opacity: 0.08, roughness: 0, clearcoat: 1, metalness: 0 })); glass.position.z = 0.345; g.add(glass);
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.22, 32), ti); crown.rotation.z = Math.PI / 2; crown.position.set(1.08, 0.35, 0); g.add(crown);
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.7, 0.4), ti); guard.position.set(1.04, 0.35, 0); g.add(guard);
    const actionMat = new THREE.MeshStandardMaterial({ color: "#ff6a1a", roughness: 0.4 });
    const action = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.45, 0.22), actionMat); action.position.set(-1.05, 0.25, 0); g.add(action);
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.32, 0.18), ti); side.position.set(1.05, -0.45, 0); g.add(side);
    const strapMat = new THREE.MeshStandardMaterial({ color: "#ff6a1a", roughness: 0.85, bumpMap: sTex, bumpScale: 0.8 });
    const top = new THREE.Mesh(strapGeo, strapMat); top.position.set(0, 2.0, -0.28); top.rotation.x = -0.32; g.add(top);
    const bot = new THREE.Mesh(strapGeo, strapMat); bot.position.set(0, -2.0, -0.28); bot.rotation.x = 0.32; g.add(bot);
    const top2 = new THREE.Mesh(strapGeo, strapMat); top2.position.set(0, 3.55, -1.05); top2.rotation.x = -0.75; g.add(top2);
    const bot2 = new THREE.Mesh(strapGeo, strapMat); bot2.position.set(0, -3.55, -1.05); bot2.rotation.x = 0.75; g.add(bot2);
    const buckle = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.05, 12, 32), ti); buckle.position.set(0, -3.6, -0.95); buckle.rotation.x = 0.75 + Math.PI / 2; buckle.scale.set(1.3, 1, 1); g.add(buckle);
    g.userData = { scr, strapMat, actionMat };
    return g;
  }
  function lights(scene, accent) {
    const key = new THREE.DirectionalLight("#ffffff", 2.2); key.position.set(-4, 5, 6); scene.add(key);
    const rim = new THREE.DirectionalLight(accent, 3); rim.position.set(5, -1, -4); scene.add(rim);
    const under = new THREE.PointLight(accent, 10, 10, 1.5); under.position.set(0, -4, 2); scene.add(under);
    return { rim, under };
  }
  const mouse = mouseFollow();
  const setStrap = (w, c) => w.userData.strapMat.color.set(c);

  // ---------- Portada ----------
  const heroBox = document.getElementById("heroWatch"); heroBox.innerHTML = "";
  const A = createStage(heroBox, { fov: 28, exposure: 1 });
  A.camera.position.set(0, 0, 20);
  A.onResize = (st) => { A.camera.position.z = st.w / st.h < 0.9 ? 25 : 19; };
  A.onResize(A);
  lights(A.scene, "#ff6a1a");
  const w1 = watch(); A.scene.add(w1);
  const d1 = dragRotate(heroBox, { speed: 0.01, idle: 0 });
  let intro = 0;
  A.onFrame = (t) => {
    d1.update(); mouse.update(); intro = Math.min(1, t / 1.4);
    const e = 1 - Math.pow(1 - intro, 3);
    w1.rotation.set(0.18 + mouse.y * 0.3, -0.5 + e * 0.5 + Math.sin(t * 0.5) * 0.25 + mouse.x * 0.5 + d1.y, -0.14);
    w1.position.y = 0.3 + Math.sin(t * 0.8) * 0.1 - (1 - e) * 2 - Math.min(scrollY * 0.004, 1.5);
    w1.userData.scr.draw(t);
  };

  // ---------- Escenas con números ----------
  const sceneBox = document.getElementById("sceneWatch"); sceneBox.innerHTML = "";
  const B2 = createStage(sceneBox, { fov: 28, exposure: 1 });
  B2.camera.position.set(0, 0, 13.5);
  B2.onResize = (st) => { B2.camera.position.z = st.w / st.h > 1 ? 16 : 13.5; };
  B2.onResize(B2);
  const L2 = lights(B2.scene, "#ff6a1a");
  const w2 = watch(); B2.scene.add(w2);
  const d2 = dragRotate(sceneBox, { speed: 0.01, idle: 0 });
  const scenesEl = document.querySelector(".scenes");
  let spin = 0, lastScreen = "";
  function applyScene(s) {
    if (!s) return;
    w2.userData.scr.set(s.screen, s.accent); setStrap(w2, s.accent); w2.userData.actionMat.color.set(s.accent);
    L2.rim.color.set(s.accent); L2.under.color.set(s.accent);
    if (s.screen !== lastScreen) { spin = 1; lastScreen = s.screen; }
  }
  document.addEventListener("watchscene", (e) => applyScene(e.detail));
  applyScene(window.__scene3d || S.scenes[0]);
  B2.onFrame = (t, dt) => {
    d2.update();
    const p = progressOf(scenesEl);
    spin = Math.max(0, spin - dt * 1.8);
    const flip = reduceMotion ? 0 : (1 - Math.pow(1 - (1 - spin), 3)) * Math.PI * 2;
    w2.rotation.set(0.1, -0.35 + p * 0.7 + d2.y + flip, -0.08 + Math.sin(t * 0.6) * 0.04);
    w2.position.y = Math.sin(t * 0.9) * 0.08;
    w2.userData.scr.draw(t);
  };

  // ---------- Correas ----------
  const strapBox = document.getElementById("strapWatch"); strapBox.innerHTML = "";
  const C = createStage(strapBox, { fov: 28, exposure: 1 });
  C.camera.position.set(0, 0, 14);
  const L3 = lights(C.scene, window.__strap3d || "#ff6a1a");
  const w3 = watch(); C.scene.add(w3);
  const d3 = dragRotate(strapBox, { speed: 0.01, idle: 0.2 });
  const target = new THREE.Color(window.__strap3d || "#ff6a1a");
  document.addEventListener("strap3d", (e) => target.set(e.detail));
  C.onFrame = (t) => {
    d3.update();
    w3.userData.strapMat.color.lerp(target, 0.12); L3.rim.color.lerp(target, 0.12); L3.under.color.lerp(target, 0.12);
    w3.rotation.set(0.12, d3.y - 0.3, 0);
    w3.position.y = Math.sin(t) * 0.08;
    w3.userData.scr.draw(t);
  };
}
