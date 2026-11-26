// Casacas 3D (Three.js) para Calle 64. Si no hay WebGL, se quedan los dibujos SVG.
import * as THREE from "three";
import { createStage, webglOK, dragRotate, mouseFollow, glowTexture, progressOf } from "../vendor/stage.js";

if (webglOK()) {
  document.body.classList.add("has3d");
  const S = window.SHOP;

  // Silueta de la casaca (coordenadas del dibujo 300x320) -> forma 3D inflada
  const P = (x, y) => new THREE.Vector2((x - 150) / 100, (160 - y) / 100);
  function shapeFrom(pts) { const s = new THREE.Shape(); pts.forEach(([x, y], i) => i ? s.lineTo(...P(x, y).toArray()) : s.moveTo(...P(x, y).toArray())); s.closePath(); return s; }
  const bodyPts = [[112, 40], [95, 50], [68, 74], [16, 232], [50, 252], [92, 140], [74, 146], [72, 300], [228, 300], [226, 146], [208, 140], [250, 252], [284, 232], [232, 74], [205, 50], [188, 40], [150, 66]];
  const ext = (shape, depth, bevel = 0.18, seg = 6) => { const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.8, bevelSegments: seg, curveSegments: 8 }); g.translate(0, 0, -depth / 2); g.computeVertexNormals(); return g; };
  const bodyGeo = ext(shapeFrom(bodyPts), 0.42, 0.22, 8);
  const FRONT = 0.21 + 0.22;
  const bandGeo = ext(shapeFrom([[70, 286], [230, 286], [230, 306], [70, 306]]), 0.5, 0.1, 4);
  const collarGeo = ext(shapeFrom([[110, 30], [190, 30], [198, 58], [150, 74], [102, 58]]), 0.52, 0.1, 4);
  const cuffL = ext(shapeFrom([[12, 228], [52, 244], [46, 262], [6, 246]]), 0.42, 0.1, 4);
  const cuffR = ext(shapeFrom([[288, 228], [248, 244], [254, 262], [294, 246]]), 0.42, 0.1, 4);
  // franja de manga: tira delgada a lo largo de la manga
  function stripe(x1, y1, x2, y2, w) {
    const a = P(x1, y1), b = P(x2, y2), d = b.clone().sub(a).normalize(), n = new THREE.Vector2(-d.y, d.x).multiplyScalar(w / 2);
    const s = new THREE.Shape([a.clone().add(n), b.clone().add(n), b.clone().sub(n), a.clone().sub(n)]);
    const g = new THREE.ExtrudeGeometry(s, { depth: 1.02, bevelEnabled: false }); g.translate(0, 0, -0.51); return g;
  }
  const stripeL = stripe(80, 80, 32, 226, 0.12), stripeR = stripe(220, 80, 268, 226, 0.12);

  function nameTexture() {
    const c = document.createElement("canvas"); c.width = 512; c.height = 256;
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    t.draw = (txt, color) => {
      const g = c.getContext("2d"); g.clearRect(0, 0, 512, 256);
      g.fillStyle = color; g.textAlign = "center"; g.textBaseline = "middle";
      let size = 120; g.font = `${size}px Anton, Impact, sans-serif`;
      while (g.measureText(txt).width > 470 && size > 40) { size -= 6; g.font = `${size}px Anton, Impact, sans-serif`; }
      g.fillText(txt, 256, 90);
      g.font = "130px Anton, Impact, sans-serif"; g.lineWidth = 5; g.strokeStyle = color; g.strokeText("64", 256, 205);
      t.needsUpdate = true;
    };
    return t;
  }

  function jacket(colorKey, opts = {}) {
    const col = S.colors[colorKey];
    const fabric = (c) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.9, sheen: 0.6, sheenColor: new THREE.Color(c).lerp(new THREE.Color("#ffffff"), 0.25), sheenRoughness: 0.7 });
    const g = new THREE.Group();
    const mBody = fabric(col.body), mStripe = fabric(col.stripe), mDark = fabric(new THREE.Color(col.body).multiplyScalar(0.6));
    g.add(new THREE.Mesh(bodyGeo, mBody));
    g.add(new THREE.Mesh(bandGeo, mDark), new THREE.Mesh(collarGeo, mDark), new THREE.Mesh(cuffL, mDark), new THREE.Mesh(cuffR, mDark));
    g.add(new THREE.Mesh(stripeL, mStripe), new THREE.Mesh(stripeR, mStripe));
    const zip = new THREE.Mesh(new THREE.BoxGeometry(0.035, 2.2, 0.03), new THREE.MeshStandardMaterial({ color: "#c9c9c9", metalness: 0.9, roughness: 0.3 }));
    zip.position.set(0, -0.35, FRONT + 0.005); g.add(zip);
    const pull = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, 0.04), zip.material); pull.position.set(0, 0.62, FRONT + 0.02); g.add(pull);
    // logo pecho
    const logoTex = nameTexture(); logoTex.draw("", "#" + new THREE.Color(col.stripe).getHexString());
    const lc = logoTex.image.getContext("2d"); lc.clearRect(0, 0, 512, 256); lc.fillStyle = col.stripe; lc.font = "150px Anton, Impact, sans-serif"; lc.textAlign = "center"; lc.textBaseline = "middle"; lc.fillText("64", 256, 128); logoTex.needsUpdate = true;
    const logo = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.25), new THREE.MeshBasicMaterial({ map: logoTex, transparent: true }));
    logo.position.set(0.42, 0.48, FRONT + 0.006); g.add(logo);
    if (opts.back) {
      const tex = nameTexture(); tex.draw(opts.name || "CALLE 64", col.stripe);
      const back = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.7), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
      back.position.set(0, 0.25, -FRONT - 0.006); back.rotation.y = Math.PI; g.add(back);
      g.userData.setName = (n) => tex.draw(n, col.stripe);
    }
    return g;
  }
  function neon(scene, x, h) {
    const tube = new THREE.Mesh(new THREE.BoxGeometry(0.28, h, 0.28), new THREE.MeshBasicMaterial({ color: "#ff3b40", toneMapped: false }));
    tube.position.set(x, 0, -1.2); scene.add(tube);
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, h + 1.2), new THREE.MeshBasicMaterial({ map: glowTexture(THREE, "#ff2a31"), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.85 }));
    glow.position.set(x, 0, -1.25); scene.add(glow);
    const l1 = new THREE.PointLight("#ff2a31", 18, 7, 1.4); l1.position.set(x, 1, -0.6); scene.add(l1);
    const l2 = new THREE.PointLight("#ff2a31", 18, 7, 1.4); l2.position.set(x, -1.4, -0.6); scene.add(l2);
    return { tube, glow };
  }

  // ---------- Portada: tres casacas con neón ----------
  const trio = document.getElementById("trio");
  trio.innerHTML = "";
  const A = createStage(trio, { fov: 30, exposure: 0.8 });
  A.camera.position.set(0, 0, 13);
  const n = neon(A.scene, 0, 6.4);
  const key = new THREE.DirectionalLight("#ffffff", 1.1); key.position.set(3, 3, 6); A.scene.add(key);
  const jackets = [jacket("negro"), jacket("rojo"), jacket("hueso")];
  jackets.forEach((j, i) => { j.position.set((i - 1) * 3.3, 0, i === 1 ? 0.6 : -0.4); j.scale.setScalar(i === 1 ? 1.18 : 1); A.scene.add(j); });
  const drag = dragRotate(trio, { speed: 0.01, idle: 0 });
  const mouse = mouseFollow();
  A.onFrame = (t) => {
    drag.update(); mouse.update();
    jackets.forEach((j, i) => { j.rotation.y = drag.y + Math.sin(t * 0.6 + i) * 0.25 + mouse.x * 0.5; j.position.y = Math.sin(t * 0.9 + i * 1.3) * 0.08; });
    const f = (Math.sin(t * 13) > 0.97 || (t % 5 > 2.1 && t % 5 < 2.18)) ? 0.45 : 1;
    n.glow.material.opacity = 0.85 * f; n.tube.material.color.setRGB(f, 0.23 * f, 0.25 * f);
  };
  A.onResize = (st) => { A.camera.position.z = st.w / st.h < 1 ? 15 : 12.6; };
  A.onResize(A);

  // ---------- Casaca con tu nombre ----------
  const kBox = document.getElementById("kJacket");
  kBox.innerHTML = "";
  const B = createStage(kBox, { fov: 30, exposure: 0.85 });
  B.camera.position.set(0, 0, 9.5);
  const keyB = new THREE.DirectionalLight("#ffffff", 1.6); keyB.position.set(-3, 3, 5); B.scene.add(keyB);
  const backL = new THREE.DirectionalLight("#ffffff", 1.4); backL.position.set(2, 2, -6); B.scene.add(backL);
  const named = jacket("rojo", { back: true, name: window.__name3d || "CALLE 64" });
  B.scene.add(named);
  document.addEventListener("name3d", (e) => named.userData.setName(e.detail));
  if (document.fonts) document.fonts.ready.then(() => named.userData.setName(window.__name3d || "CALLE 64"));
  const dragB = dragRotate(kBox, { speed: 0.01, idle: 0 });
  const kin = document.getElementById("nombre");
  B.onFrame = (t) => {
    dragB.update();
    const r = kin.getBoundingClientRect(), k = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
    named.rotation.y = Math.PI + (k - 0.5) * 1.4 + dragB.y;
    named.rotation.z = Math.sin(t * 0.8) * 0.03;
    named.position.y = Math.sin(t) * 0.06;
  };
}
