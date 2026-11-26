// Parlantes 3D (Three.js) para Resonar. Si no hay WebGL, se quedan los parlantes en CSS.
import * as THREE from "three";
import { createStage, webglOK, dragRotate, mouseFollow, glowTexture, progressOf, reduceMotion } from "../vendor/stage.js";

if (webglOK()) {
  document.body.classList.add("has3d");

  // Textura de tela (puntitos) para el cuerpo del parlante
  function fabric() {
    const c = document.createElement("canvas"); c.width = c.height = 256;
    const g = c.getContext("2d"); g.fillStyle = "#808080"; g.fillRect(0, 0, 256, 256);
    g.fillStyle = "#ffffff";
    for (let y = 0; y < 256; y += 8) for (let x = (y / 8) % 2 ? 4 : 0; x < 256; x += 8) { g.beginPath(); g.arc(x, y, 2.2, 0, 7); g.fill(); }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(10, 6); return t;
  }
  const fab = fabric();
  const halo = glowTexture(THREE, "#8cff5a");

  function speaker(ring = "#8cff5a") {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2.6, 96, 1, true),
      new THREE.MeshStandardMaterial({ color: "#16191c", roughness: 0.75, metalness: 0.2, bumpMap: fab, bumpScale: 0.6 }));
    g.add(body);
    const bottom = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), new THREE.MeshStandardMaterial({ color: "#0d0f11", roughness: 0.6 }));
    bottom.scale.y = 0.18; bottom.position.y = -1.3; g.add(bottom);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(1.012, 1.012, 0.22, 96, 1, true), new THREE.MeshStandardMaterial({ color: "#2c3136", metalness: 0.9, roughness: 0.25 }));
    band.position.y = 1.05; g.add(band);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.08, 96), new THREE.MeshStandardMaterial({ color: "#1b1e21", metalness: 0.6, roughness: 0.35 }));
    top.position.y = 1.32; g.add(top);
    const inner = new THREE.Mesh(new THREE.CircleGeometry(0.72, 64), new THREE.MeshStandardMaterial({ color: "#0a0b0c", metalness: 0.3, roughness: 0.5 }));
    inner.rotation.x = -Math.PI / 2; inner.position.y = 1.365; g.add(inner);
    const ringMat = new THREE.MeshBasicMaterial({ color: ring });
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.035, 16, 96), ringMat);
    torus.rotation.x = Math.PI / 2; torus.position.y = 1.37; g.add(torus);
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.3), new THREE.MeshBasicMaterial({ map: halo, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending, color: ring }));
    glow.rotation.x = -Math.PI / 2; glow.position.y = 1.38; g.add(glow);
    const light = new THREE.PointLight(ring, 1.2, 3, 1.5); light.position.y = 1.6; g.add(light);
    // botones
    [-0.25, 0, 0.25].forEach((x) => { const b = new THREE.Mesh(new THREE.CircleGeometry(0.05, 20), new THREE.MeshBasicMaterial({ color: "#5c6166" })); b.rotation.x = -Math.PI / 2; b.position.set(x, 1.367, 0.5); g.add(b); });
    g.userData = { ringMat, glow, torus };
    return g;
  }

  // ---------- Portada ----------
  const heroBox = document.createElement("div"); heroBox.className = "hero__3d";
  document.getElementById("hero").appendChild(heroBox);
  const A = createStage(heroBox, { fov: 32, exposure: 1.1 });
  A.camera.position.set(0, 0.2, 11);
  const pair = new THREE.Group(); A.scene.add(pair);
  const s1 = speaker(), s2 = speaker();
  s1.position.set(-1.25, 0, 0); s1.rotation.z = 0.42; s1.rotation.x = -0.12;
  s2.position.set(1.25, 0, 0); s2.rotation.z = -0.42; s2.rotation.x = -0.12;
  pair.add(s1, s2);
  const key = new THREE.DirectionalLight("#cfe0ff", 2.6); key.position.set(-4, 3, 5); A.scene.add(key);
  const rimW = new THREE.DirectionalLight("#9fb8d8", 2.2); rimW.position.set(4, 2, -4); A.scene.add(rimW);
  const rimA = new THREE.DirectionalLight("#8cff5a", 0.8); rimA.position.set(3, -2, -3); A.scene.add(rimA);
  const drag = dragRotate(heroBox, { speed: 0.01, idle: 0.35 });
  const mouse = mouseFollow();
  let enter = 0;
  A.onResize = (st) => { const narrow = st.w / st.h < 0.9; pair.scale.setScalar(narrow ? 0.56 : 0.92); pair.position.y = narrow ? 0.5 : -0.2; };
  A.onResize(A);
  A.onFrame = (t) => {
    drag.update(); mouse.update();
    enter = Math.min(1, t / 1.4);
    const e = 1 - Math.pow(1 - enter, 3);
    pair.rotation.y = drag.y + mouse.x * 0.4;
    pair.rotation.x = mouse.y * 0.25;
    s1.position.y = Math.sin(t * 1.1) * 0.12 - (1 - e) * 2; s2.position.y = Math.sin(t * 1.1 + 1.6) * 0.12 - (1 - e) * 2;
    s1.rotation.y = t * 0.3; s2.rotation.y = -t * 0.3;
    const pulse = 0.5 + Math.sin(t * 3) * 0.12;
    [s1, s2].forEach((s) => s.userData.glow.material.opacity = pulse);
  };

  // ---------- Escena verde ----------
  const glowSec = document.getElementById("glow");
  const glowBox = document.createElement("div"); glowBox.className = "glow__3d";
  glowSec.querySelector(".glow__sticky").appendChild(glowBox);
  const B = createStage(glowBox, { fov: 30, exposure: 1.15 });
  B.camera.position.set(0, 0.5, 12);
  const big = new THREE.Group(); B.scene.add(big);
  const b1 = speaker(), b2 = speaker();
  big.add(b1, b2);
  const under = new THREE.PointLight("#8cff5a", 14, 12, 1.6); under.position.set(0, -3.5, 2); B.scene.add(under);
  const keyB = new THREE.DirectionalLight("#ffffff", 0.9); keyB.position.set(-2, 5, 6); B.scene.add(keyB);
  const dragB = dragRotate(glowBox, { speed: 0.01, idle: 0 });
  B.onResize = (st) => { big.scale.setScalar(st.w / st.h < 0.9 ? 0.6 : 0.95); };
  B.onResize(B);
  B.onFrame = (t) => {
    dragB.update();
    const g = progressOf(glowSec);
    b1.position.set(-1.35 + g * 0.35, -1, 0); b1.rotation.set(0.12, t * 0.25 + g * 2, 0.55 - g * 0.35);
    b2.position.set(1.35 - g * 0.35, -1, 0); b2.rotation.set(0.12, -t * 0.25 - g * 2, -0.55 + g * 0.35);
    big.rotation.y = dragB.y;
    big.position.y = Math.sin(t) * 0.08;
  };

  // El color de luz elegido en la tienda también pinta los parlantes de la portada
  document.getElementById("grid")?.addEventListener("click", (e) => {
    const sw = e.target.closest(".swatches button"); if (!sw) return;
    const c = new THREE.Color(sw.dataset.c);
    [s1, s2].forEach((s) => { s.userData.ringMat.color.copy(c); s.userData.glow.material.color.copy(c); s.children.find((o) => o.isPointLight).color.copy(c); });
  });
}
