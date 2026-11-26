// Frascos 3D flotando (Three.js) para Wayta. Si no hay WebGL, quedan los frascos en CSS.
import * as THREE from "three";
import { createStage, webglOK, mouseFollow, reduceMotion } from "../vendor/stage.js";

if (webglOK()) {
  document.body.classList.add("has3d");
  const B = window.BRAND;
  const hero = document.querySelector(".hero");
  const box = document.createElement("div"); box.className = "jars3d";
  hero.insertBefore(box, hero.querySelector(".hero__copy"));
  const st = createStage(box, { fov: 30, exposure: 1.0 });
  const cam = st.camera; cam.position.set(0, 0, 20);
  const key = new THREE.DirectionalLight("#fff4e0", 1.6); key.position.set(-4, 6, 8); st.scene.add(key);
  const fill = new THREE.DirectionalLight("#ffd0b0", 0.6); fill.position.set(5, -2, 4); st.scene.add(fill);

  function labelTexture(p) {
    const c = document.createElement("canvas"); c.width = 1024; c.height = 256;
    const g = c.getContext("2d");
    g.fillStyle = p.label; g.fillRect(0, 0, 1024, 256);
    g.strokeStyle = p.ink; g.globalAlpha = 0.35; g.lineWidth = 6; g.strokeRect(14, 14, 996, 228); g.globalAlpha = 1;
    g.fillStyle = p.ink; g.textAlign = "center"; g.textBaseline = "middle";
    for (const cx of [256, 768]) {
      g.font = "700 30px 'DM Sans', sans-serif"; g.fillText(p.kind.toUpperCase().split("").join(" "), cx, 70);
      g.font = "italic 700 92px Fraunces, Georgia, serif"; g.fillText(p.name, cx, 150);
      g.font = "500 24px 'DM Sans', sans-serif"; g.fillText("WAYTA · VALLE DEL MANTARO", cx, 212);
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  }
  // Perfil del frasco (radio, altura)
  const prof = [[0, -1.25], [0.86, -1.25], [0.95, -1.15], [1, -0.95], [1, 0.9], [0.95, 1.05], [0.8, 1.15], [0.8, 1.3]].map(([x, y]) => new THREE.Vector2(x, y));
  const glassGeo = new THREE.LatheGeometry(prof, 64);
  const fillGeo = new THREE.LatheGeometry(prof.map((v) => new THREE.Vector2(Math.max(0, v.x - 0.06), Math.min(v.y, 0.95))), 48);
  const labelGeo = new THREE.CylinderGeometry(1.012, 1.012, 1.05, 64, 1, true);
  const lidGeo = new THREE.CylinderGeometry(0.88, 0.88, 0.42, 64);
  const lidTopGeo = new THREE.CylinderGeometry(0.84, 0.84, 0.04, 64);
  const ridgeTex = (() => { const c = document.createElement("canvas"); c.width = 256; c.height = 8; const g = c.getContext("2d"); for (let x = 0; x < 256; x += 8) { g.fillStyle = "#fff"; g.fillRect(x, 0, 4, 8); g.fillStyle = "#777"; g.fillRect(x + 4, 0, 4, 8); } const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; t.repeat.set(6, 1); return t; })();
  const lidMat = new THREE.MeshStandardMaterial({ color: "#d9dde2", metalness: 1, roughness: 0.28, bumpMap: ridgeTex, bumpScale: 1.2 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: "#ffffff", transparent: true, opacity: 0.22, roughness: 0.04, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03, depthWrite: false });

  function jar(p) {
    const g = new THREE.Group();
    const content = new THREE.Mesh(fillGeo, new THREE.MeshStandardMaterial({ color: p.fill, roughness: 0.35 }));
    const label = new THREE.Mesh(labelGeo, new THREE.MeshStandardMaterial({ map: labelTexture(p), roughness: 0.6 }));
    label.position.y = -0.1;
    const glass = new THREE.Mesh(glassGeo, glassMat);
    const lid = new THREE.Mesh(lidGeo, lidMat); lid.position.y = 1.45;
    const top = new THREE.Mesh(lidTopGeo, new THREE.MeshStandardMaterial({ color: "#eef0f2", metalness: 1, roughness: 0.2 })); top.position.y = 1.67;
    g.add(content, label, glass, lid, top);
    g.userData.id = p.id;
    return g;
  }

  const jars = [];
  function build() {
    jars.forEach((j) => st.scene.remove(j.obj)); jars.length = 0;
    const layout = window.__jarLayout ? window.__jarLayout() : [];
    const vh = 2 * cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)), vw = vh * cam.aspect;
    layout.forEach(([x, y, r, w, d], i) => {
      const p = B.products[i % B.products.length], o = jar(p);
      const s = (w / 10) * (st.w < 760 ? 1.05 : 0.95) * (vh / 11);
      o.scale.setScalar(s * 0.55);
      const wx = (x / 100 - 0.5) * vw + s * 0.6, wy = (0.5 - y / 100) * vh - s * 0.75;
      o.position.set(wx, wy, (d - 20) * 0.08);
      o.rotation.z = THREE.MathUtils.degToRad(-r);
      st.scene.add(o);
      jars.push({ obj: o, home: o.position.clone(), rz: o.rotation.z, d, i, spin: (i % 2 ? 1 : -1) * (0.25 + (i % 3) * 0.1), hover: 0, enter: 0 });
    });
  }
  st.onResize = () => build();
  build();

  // Hover y clic con rayos
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(9, 9);
  let hovered = null;
  box.addEventListener("pointermove", (e) => { const r = box.getBoundingClientRect(); ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); });
  box.addEventListener("pointerleave", () => ptr.set(9, 9));
  box.addEventListener("click", (e) => {
    const r = box.getBoundingClientRect(); ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, cam);
    const hit = ray.intersectObjects(jars.map((j) => j.obj), true)[0];
    if (hit) { let o = hit.object; while (o.parent && !o.userData.id) o = o.parent; window.__openQuick && window.__openQuick(o.userData.id); }
  });

  const mouse = mouseFollow();
  st.onFrame = (t) => {
    mouse.update();
    ray.setFromCamera(ptr, cam);
    const hit = ray.intersectObjects(jars.map((j) => j.obj), true)[0];
    let ho = hit ? hit.object : null; while (ho && ho.parent && !ho.userData.id) ho = ho.parent;
    hovered = ho; box.style.cursor = hovered ? "pointer" : "default";
    jars.forEach((j) => {
      j.enter = Math.min(1, Math.max(0, (t - j.i * 0.08) / 1.1));
      const e = 1 - Math.pow(1 - Math.max(0, j.enter), 3);
      j.hover += ((hovered === j.obj ? 1 : 0) - j.hover) * 0.15;
      const bob = reduceMotion ? 0 : Math.sin(t * (0.9 + j.i * 0.1) + j.i) * 0.25;
      j.obj.position.set(j.home.x + mouse.x * j.d * 0.05, j.home.y + bob - (1 - e) * 3 - mouse.y * j.d * 0.04, j.home.z);
      j.obj.rotation.y = (reduceMotion ? 0 : t * j.spin) + j.hover * 0.6;
      j.obj.rotation.z = j.rz + Math.sin(t * 0.7 + j.i) * 0.08;
      j.obj.rotation.x = mouse.y * 0.3;
      const s = j.obj.userData.base || (j.obj.userData.base = j.obj.scale.x);
      j.obj.scale.setScalar(s * (1 + j.hover * 0.1) * (0.6 + 0.4 * e));
    });
  };
  if (document.fonts) document.fonts.ready.then(build);
}
