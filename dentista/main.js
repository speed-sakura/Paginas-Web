(() => {
  const C = window.CLINIC;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = matchMedia("(max-width: 640px)").matches;
  const fmt = (n, d = 0) => n.toLocaleString("es-PE", { minimumFractionDigits: d, maximumFractionDigits: d });

  /* ---------- Marca ---------- */
  $$("[data-name]").forEach(el => (el.textContent = C.name));
  document.title = `${C.name} · Clínica dental en Huancayo y Lima`;
  $("#year").textContent = new Date().getFullYear();
  const waLink = text => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`;
  $("#wa").href = waLink(`Hola ${C.name}, quiero reservar una cita.`);
  $("#wa").target = "_blank"; $("#wa").rel = "noopener";

  /* ---------- Titular palabra por palabra ---------- */
  $$("[data-words]").forEach(h => {
    let i = 0;
    h.innerHTML = h.innerHTML.split(/(<br\s*\/?>)/).map(part =>
      part.startsWith("<br") ? part : part.trim().split(/\s+/).map(w => `<span class="w" style="--i:${i++}">${w}</span>`).join(" ")
    ).join("");
  });
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add("is-ready")));

  /* ---------- Iconos ---------- */
  const ICONS = {
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    brace: '<rect x="3" y="9" width="5" height="6" rx="1.5"/><rect x="16" y="9" width="5" height="6" rx="1.5"/><path d="M8 12h8"/><rect x="10" y="10" width="4" height="4" rx="1"/>',
    clear: '<path d="M4 9c0-3 3.5-5 8-5s8 2 8 5v3c0 4-3.5 8-8 8s-8-4-8-8z"/><path d="M8 10c1 1 2.5 1.5 4 1.5s3-.5 4-1.5"/>',
    implant: '<path d="M7 3h10c0 3-1.5 5-5 5S7 6 7 3z"/><path d="M9 11h6M9.5 14h5M10 17h4M11 20h2M12 8v12"/>',
    shine: '<path d="M12 3c-2 0-3 1-5 1-2.5 0-3.5 2-3.5 4.5 0 3 1.5 5 2 8 .5 2 1 3.5 2.3 3.5 1.7 0 1.4-5 4.2-5s2.5 5 4.2 5c1.3 0 1.8-1.5 2.3-3.5.5-3 2-5 2-8C20.5 6 19.5 4 17 4c-2 0-3-1-5-1z"/><path d="M8.5 7.5c.5-.7 1.3-1 2-1"/>',
    root: '<path d="M12 3c-2 0-3 1-5 1-2.5 0-3.5 2-3.5 4.5 0 3 1.5 5 2 8 .5 2 1 3.5 2.3 3.5 1.7 0 1.4-5 4.2-5s2.5 5 4.2 5c1.3 0 1.8-1.5 2.3-3.5.5-3 2-5 2-8C20.5 6 19.5 4 17 4c-2 0-3-1-5-1z"/><path d="M9 9v5M15 9v5"/>',
    kid: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8M9 9.5h.01M15 9.5h.01"/>'
  };
  const icon = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k] || ICONS.spark}</svg>`;
  const BIG_TOOTH = '<svg viewBox="0 0 120 150" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M60 8c-10 0-15 6-26 6C18 14 10 26 10 42c0 19 8 30 12 50 3 15 6 34 15 34 12 0 8-38 23-38s11 38 23 38c9 0 12-19 15-34 4-20 12-31 12-50 0-16-8-28-24-28-11 0-16-6-26-6z"/><path d="M60 88v54M52 142h16M54 132h12M55 122h10M56 112h8M57 102h6" opacity=".6"/><path d="M30 30c4-6 10-8 16-8" opacity=".7"/></svg>';

  /* ---------- Cifras ---------- */
  $("#stats").innerHTML = C.stats.map((s, i) =>
    `<div class="stat in" style="--d:${i * 60}ms"><b data-count="${s.value}" data-dec="${s.decimals || 0}" data-pre="${s.prefix}" data-suf="${s.suffix}">${s.prefix}0${s.suffix}</b><span>${s.label}</span></div>`).join("");
  const countUp = el => {
    const to = +el.dataset.count, dec = +el.dataset.dec, pre = el.dataset.pre, suf = el.dataset.suf;
    if (reduce) { el.textContent = pre + fmt(to, dec) + suf; return; }
    const t0 = performance.now(), dur = 1400;
    const step = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4); el.textContent = pre + fmt(to * e, dec) + suf; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };

  /* ---------- Tratamientos ---------- */
  $("#bento").innerHTML = C.treatments.map((t, i) => `
    <button class="tcard tcard--${t.size} in" style="--d:${(i % 4) * 60}ms" data-pick="${t.id}" type="button">
      <div class="tcard__ico">${icon(t.icon)}</div>
      ${t.size === "t" ? `<div class="tcard__art">${BIG_TOOTH}</div>` : ""}
      <div>
        <h3>${t.name}</h3>
        <p>${t.note}</p>
        <div class="tcard__price" style="margin-top:14px"><b><small>desde</small>${t.price}</b><span class="tcard__go" aria-hidden="true">↗</span></div>
      </div>
    </button>`).join("");
  $$(".tcard").forEach(c => c.addEventListener("pointermove", e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", `${e.clientX - r.left}px`); c.style.setProperty("--my", `${e.clientY - r.top}px`);
  }));

  /* ---------- Simulador de blanqueamiento ---------- */
  const teethG = $("#teeth");
  const gumY = x => { const t = x / 440; return 92 - 124 * t * (1 - t); };
  const halfW = [46, 38, 35, 31, 29];
  const toothPath = (x, y0, w, h, r) =>
    `M${x} ${y0} L${x + w} ${y0} L${x + w} ${y0 + h - r} Q${x + w} ${y0 + h} ${x + w - r} ${y0 + h} L${x + r} ${y0 + h} Q${x} ${y0 + h} ${x} ${y0 + h - r}Z`;
  let svg = "";
  [-1, 1].forEach(side => {
    let acc = 0;
    halfW.forEach((w, i) => {
      const x = side > 0 ? 220 + acc + 1.5 : 220 - acc - w - 1.5;
      const cx = x + w / 2, top = gumY(cx) - 8, h = [78, 70, 72, 60, 54][i];
      svg += `<path class="t" d="${toothPath(x, top, w - 3, h, 14)}"/><path d="${toothPath(x, top, w - 3, h, 14)}" fill="url(#toothShine)"/>`;
      // dientes de abajo
      const lw = w * 0.82, lx = side > 0 ? 220 + acc * 0.82 + 1.5 : 220 - acc * 0.82 - lw - 1.5;
      const ltop = 178 + Math.pow((lx + lw / 2 - 220) / 220, 2) * -60 + 6;
      svg += `<path class="t t--low" d="${toothPath(lx, ltop, lw - 3, 80, 10)}" opacity=".78"/>`;
      acc += w;
    });
  });
  teethG.innerHTML = svg;
  const shades = ["A3.5 · amarillento", "A3 · natural", "A2 · claro", "A1 · muy claro", "B1 · blanco", "0M1 · blanco brillante"];
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (c1, c2, t) => `rgb(${c1.map((v, i) => Math.round(lerp(v, c2[i], t))).join(",")})`;
  const shadeEl = $("#shade");
  const paintShade = () => {
    const t = shadeEl.value / 100;
    const col = t < .5 ? mix([214, 190, 140], [236, 226, 200], t * 2) : mix([236, 226, 200], [252, 252, 247], (t - .5) * 2);
    $$(".t", teethG).forEach(p => p.setAttribute("fill", col));
    $("#shadeLabel").textContent = shades[Math.min(shades.length - 1, Math.round(t * (shades.length - 1)))];
    $("#shadeGain").textContent = "+" + Math.round(t * 8);
    shadeEl.style.setProperty("--p", t);
  };
  shadeEl.addEventListener("input", paintShade);
  paintShade();
  // Pequeña demostración automática la primera vez que se ve
  let shadeDemoDone = false;
  const shadeDemo = () => {
    if (shadeDemoDone || reduce) return; shadeDemoDone = true;
    const t0 = performance.now();
    const step = t => {
      if (shadeEl.dataset.touched) return;
      const k = Math.min(1, (t - t0) / 1600), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      shadeEl.value = Math.round(e * 70); paintShade();
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  shadeEl.addEventListener("pointerdown", () => (shadeEl.dataset.touched = 1));

  /* ---------- Calculadora de cuotas ---------- */
  const calcT = $("#calcT"), calcM = $("#calcM");
  calcT.innerHTML = C.financing.map((f, i) => `<option value="${i}">${f.name} · S/ ${fmt(f.total)}</option>`).join("");
  calcM.innerHTML = C.months.map((m, i) => `<button type="button" role="radio" aria-checked="${i === 2}" class="${i === 2 ? "on" : ""}" data-m="${m}">${m}</button>`).join("");
  let months = C.months[2], shown = 0;
  const calc = () => {
    const f = C.financing[calcT.value], to = Math.ceil(f.total / months);
    $("#calcTotal").textContent = `S/ ${fmt(f.total)}`;
    const from = shown, t0 = performance.now();
    const step = t => { const k = reduce ? 1 : Math.min(1, (t - t0) / 380), e = 1 - Math.pow(1 - k, 3); shown = Math.round(lerp(from, to, e)); $("#calcOut").textContent = fmt(shown); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  calcT.addEventListener("change", calc);
  calcM.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", calcM).forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-checked", x === b); });
    months = +b.dataset.m; calc();
  });
  calc();

  /* ---------- Especialistas ---------- */
  $("#team").innerHTML = C.doctors.map((d, i) => {
    const ini = d.name.replace(/^Dra?\.\s*/, "").split(" ").map(w => w[0]).join("").slice(0, 2);
    return `<article class="doc in" style="--d:${i * 70}ms"><div class="doc__pic"><span>${ini}</span></div><div class="doc__body"><b>${d.name}</b><p>${d.role}</p><div class="doc__meta"><i>${d.cop}</i><i>${d.years} años</i></div></div></article>`;
  }).join("");

  /* ---------- Opiniones ---------- */
  const revHTML = C.reviews.map(r => `<figure class="rev"><div class="rev__stars" aria-label="5 estrellas">★★★★★</div><p>“${r.text}”</p><footer><b>${r.name}</b><span>${r.tag}</span></footer></figure>`).join("");
  $("#reviews").innerHTML = revHTML + revHTML.replace(/<figure/g, '<figure aria-hidden="true"');

  /* ---------- Sedes ---------- */
  $("#places").innerHTML = C.locations.map((l, i) => `
    <article class="place in" style="--d:${i * 70}ms"><div class="place__map"></div><span class="place__pin"></span>
      <div><small>${l.area}</small><h3>${l.city}</h3><p>${l.address}<br>${l.hours}</p></div>
      <a class="btn btn--ghost btn--sm" style="padding-right:16px" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.address + ", " + l.city + ", Perú")}">Cómo llegar</a>
    </article>`).join("");

  /* ---------- FAQ ---------- */
  $("#faqs").innerHTML = C.faqs.map((f, i) => `
    <div class="qa in" style="--d:${i * 50}ms"><button type="button" aria-expanded="false" aria-controls="qa${i}">${f.q}<i aria-hidden="true"></i></button>
    <div class="qa__a" id="qa${i}"><div><p>${f.a}</p></div></div></div>`).join("");
  $("#faqs").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    const qa = b.parentElement, open = !qa.classList.contains("open");
    qa.classList.toggle("open", open); b.setAttribute("aria-expanded", open);
  });

  /* ---------- Reserva ---------- */
  const formT = $("#formT"), formS = $("#formS"), formD = $("#formD");
  formT.innerHTML = C.treatments.map(t => `<option value="${t.id}">${t.name}</option>`).join("") + `<option value="evaluacion" selected>Evaluación general</option>`;
  formS.innerHTML = C.locations.map(l => `<option>${l.city} · ${l.area}</option>`).join("");
  const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  formD.min = today.toISOString().slice(0, 10);
  const turn = $("#formTurn");
  turn.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", turn).forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); });
  });
  document.addEventListener("click", e => {
    const p = e.target.closest("[data-pick]"); if (!p) return;
    formT.value = p.dataset.pick;
    if (p.tagName === "BUTTON") $("#reserva").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  });
  $("#calcGo").addEventListener("click", () => {
    const n = C.financing[calcT.value].name.toLowerCase();
    const hit = C.treatments.find(t => n.includes(t.name.split(" ")[0].toLowerCase()));
    formT.value = hit ? hit.id : "evaluacion";
  });
  $("#form").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target, msg = $("#formMsg");
    const name = f.nombre.value.trim();
    if (!name) { msg.textContent = "Escribe tu nombre para reservar."; f.nombre.focus(); return; }
    if (!formD.value) { msg.textContent = "Elige una fecha para tu cita."; formD.focus(); return; }
    msg.textContent = "";
    const fecha = new Date(formD.value + "T12:00").toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" });
    const text = [
      `Hola ${C.name}, quiero reservar una cita 🦷`,
      ``,
      `• Nombre: ${name}`,
      `• Tratamiento: ${formT.options[formT.selectedIndex].text}`,
      `• Sede: ${formS.value}`,
      `• Fecha: ${fecha}`,
      `• Turno: ${$(".on", turn).textContent}`
    ].join("\n");
    window.open(waLink(text), "_blank", "noopener");
  });

  /* ---------- Navegación ---------- */
  const nav = $("#nav"), burger = $("#burger"), sheet = $("#sheet");
  const toggleSheet = open => { sheet.hidden = !open; burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú"); };
  burger.addEventListener("click", () => toggleSheet(sheet.hidden));
  sheet.addEventListener("click", e => { if (e.target.closest("a")) toggleSheet(false); });
  const wa = $("#wa");
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle("is-solid", y > 20);
    wa.classList.toggle("show", y > innerHeight * .6);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const links = $$(".pill a");
  const secObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  links.forEach(a => { const s = $(a.getAttribute("href")); if (s) secObs.observe(s); });

  /* ---------- Entradas al hacer scroll ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in");
    $$("[data-count]", e.target).forEach(countUp);
    if (e.target.closest("#sonrisa")) shadeDemo();
    io.unobserve(e.target);
  }), { rootMargin: "0px 0px -8% 0px", threshold: .12 });
  $$(".in").forEach(el => io.observe(el));

  /* ---------- Diente de partículas 3D (portada) ---------- */
  const cv = $("#tooth"), ctx = cv.getContext("2d");
  const hero = $(".hero");

  // Forma del diente con funciones de distancia (corona + 2 raíces)
  const len = (x, y, z) => Math.hypot(x, y, z);
  const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * .25; };
  const smax = (a, b, k) => -smin(-a, -b, k);
  const ell = (x, y, z, rx, ry, rz) => { const k0 = len(x / rx, y / ry, z / rz), k1 = len(x / (rx * rx), y / (ry * ry), z / (rz * rz)); return k0 * (k0 - 1) / k1; };
  const cone = (px, py, pz, ax, ay, az, bx, by, bz, r1, r2) => {
    const bax = bx - ax, bay = by - ay, baz = bz - az, pax = px - ax, pay = py - ay, paz = pz - az;
    const t = Math.max(0, Math.min(1, (pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz)));
    return len(pax - bax * t, pay - bay * t, paz - baz * t) - lerp(r1, r2, t);
  };
  const sdf = (x, y, z) => {
    let d = ell(x, y - .32, z, .74, .5, .6);
    for (const [cx, cz] of [[-.33, -.24], [.33, -.24], [-.33, .24], [.33, .24]]) d = smin(d, len(x - cx, y - .66, z - cz) - .27, .22);
    d = smax(d, -(len(x, y - 1.02, z) - .3), .16);
    d = smin(d, cone(x, y, z, -.34, .05, 0, -.42, -1.12, .04, .25, .06), .2);
    d = smin(d, cone(x, y, z, .34, .05, 0, .38, -1.08, -.03, .25, .06), .2);
    d = smax(d, -cone(x, y, z, 0, -.32, 0, 0, -1.4, 0, .1, .26), .12);
    return d;
  };
  const N = isMobile ? 640 : 1050;
  const pts = [];
  let guard = 0;
  while (pts.length < N && guard++ < 600000) {
    const x = (Math.random() * 2 - 1) * 1.05, y = Math.random() * 2.35 - 1.25, z = (Math.random() * 2 - 1) * .85;
    if (Math.abs(sdf(x, y, z)) < .014) pts.push({ tx: x, ty: y - .02, tz: z });
  }
  // Polvo de fondo y anillos orbitales (como el globo del video)
  const rings = [];
  [[1.55, .42, 150], [1.9, -.28, 170]].forEach(([r, tilt, n]) => {
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; rings.push({ r, tilt, a, s: Math.random() }); }
  });
  const dust = Array.from({ length: isMobile ? 70 : 140 }, () => ({ x: Math.random(), y: Math.random(), s: Math.random() * 1.1 + .2, p: Math.random() * 6 }));
  // Vecinos cercanos para las líneas
  const edges = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], near = [];
    for (let j = i + 1; j < pts.length; j++) {
      const b = pts[j], d = (a.tx - b.tx) ** 2 + (a.ty - b.ty) ** 2 + (a.tz - b.tz) ** 2;
      if (d < .028) near.push([d, j]);
    }
    near.sort((p, q) => p[0] - q[0]).slice(0, 2).forEach(([, j]) => edges.push(i, j));
  }
  // Inicio: puntos dispersos en una esfera grande que se juntan en el diente
  pts.forEach((p, i) => {
    const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, r = 2.6 + Math.random() * 1.2, s = Math.sqrt(1 - u * u);
    p.sx = Math.cos(th) * s * r; p.sy = u * r; p.sz = Math.sin(th) * s * r;
    p.delay = Math.random() * .55; p.tw = Math.random() * 6.28; p.big = Math.random() < .08;
  });

  let W = 0, H = 0, dpr = 1, running = false, raf = 0, start = performance.now();
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, isMobile ? 1.6 : 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
  };
  addEventListener("resize", resize); resize();
  addEventListener("pointermove", e => { tmx = e.clientX / innerWidth - .5; tmy = e.clientY / innerHeight - .5; }, { passive: true });

  const proj = new Float32Array(pts.length * 3);
  const ease = t => 1 - Math.pow(1 - t, 3);
  const draw = now => {
    const t = (now - start) / 1000;
    mx += (tmx - mx) * .05; my += (tmy - my) * .05;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // polvo
    ctx.fillStyle = "#fff";
    dust.forEach(d => { ctx.globalAlpha = .15 + .25 * (Math.sin(t * .8 + d.p) * .5 + .5); ctx.fillRect(d.x * W, d.y * H, d.s, d.s); });

    const narrow = W < 700;
    const S = narrow ? Math.min(W * .4, H * .22) : Math.min(W * .17, H * .25);
    const cx = W / 2 + mx * 20, cy = narrow ? H * .3 : H * .38;
    const ry = (reduce ? .5 : t * .32) + mx * .6, rx = .18 + my * .25 + Math.sin(t * .4) * .05;
    const cyR = Math.cos(ry), syR = Math.sin(ry), cxR = Math.cos(rx), sxR = Math.sin(rx);
    const F = 4.2;
    const intro = reduce ? 1 : Math.min(1, t / 2.2);

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const k = reduce ? 1 : ease(Math.max(0, Math.min(1, (t - p.delay) / 1.7)));
      let x = lerp(p.sx, p.tx, k), y = lerp(p.sy, p.ty, k), z = lerp(p.sz, p.tz, k);
      const x1 = x * cyR + z * syR, z1 = -x * syR + z * cyR;
      const y1 = y * cxR - z1 * sxR, z2 = y * sxR + z1 * cxR;
      const sc = F / (F + z2);
      proj[i * 3] = cx + x1 * S * sc; proj[i * 3 + 1] = cy - y1 * S * sc; proj[i * 3 + 2] = z2;
    }
    // líneas (dos capas por profundidad para que se vean con volumen)
    ctx.lineWidth = .6;
    for (let pass = 0; pass < 2; pass++) {
      ctx.beginPath();
      for (let e = 0; e < edges.length; e += 2) {
        const a = edges[e] * 3, b = edges[e + 1] * 3;
        const front = proj[a + 2] + proj[b + 2] < 0;
        if (front !== (pass === 1)) continue;
        ctx.moveTo(proj[a], proj[a + 1]); ctx.lineTo(proj[b], proj[b + 1]);
      }
      ctx.globalAlpha = (pass ? .34 : .12) * intro;
      ctx.strokeStyle = "#fff"; ctx.stroke();
    }
    // puntos
    for (let i = 0; i < pts.length; i++) {
      const z = proj[i * 3 + 2], depth = (1 - z) / 2;
      const tw = .55 + .45 * Math.sin(t * 2 + pts[i].tw);
      ctx.globalAlpha = Math.max(.12, Math.min(1, .25 + depth * .8)) * (pts[i].big ? 1 : tw);
      const s = (pts[i].big ? 2.4 : 1.3) * (.7 + depth * .6);
      ctx.fillStyle = pts[i].big && i % 3 === 0 ? "#bdf57d" : "#fff";
      ctx.fillRect(proj[i * 3] - s / 2, proj[i * 3 + 1] - s / 2, s, s);
    }
    // anillos orbitales
    rings.forEach(o => {
      const a = o.a + t * .12 * (o.r > 1.7 ? -1 : 1);
      let x = Math.cos(a) * o.r, z = Math.sin(a) * o.r, y = 0;
      const y0 = y * Math.cos(o.tilt) - z * Math.sin(o.tilt), z0 = y * Math.sin(o.tilt) + z * Math.cos(o.tilt);
      const x1 = x, y1 = y0 * cxR - z0 * sxR, z1 = y0 * sxR + z0 * cxR;
      const sc = F / (F + z1);
      ctx.globalAlpha = (.1 + .4 * ((1 - z1 / o.r) / 2)) * intro * (.6 + .4 * Math.sin(t * 1.5 + o.s * 6));
      ctx.fillStyle = "#fff";
      const s = 1.1 * sc;
      ctx.fillRect(cx + x1 * S * sc - s / 2, cy - (y1 - .05) * S * sc - s / 2, s, s);
    });
    ctx.globalAlpha = 1;
    if (running && !reduce) raf = requestAnimationFrame(draw);
  };
  const play = on => {
    if (on === running) return;
    running = on;
    if (on) raf = requestAnimationFrame(draw); else cancelAnimationFrame(raf);
  };
  if (reduce) requestAnimationFrame(draw);
  else {
    new IntersectionObserver(([e]) => play(e.isIntersecting && !document.hidden)).observe(hero);
    document.addEventListener("visibilitychange", () => play(!document.hidden && hero.getBoundingClientRect().bottom > 0));
  }
})();
