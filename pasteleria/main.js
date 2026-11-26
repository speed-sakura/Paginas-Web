/* Lúcuma Pastelería · interacciones y animaciones (sin librerías) */
(() => {
  const P = window.PASTE;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const waLink = msg => `https://wa.me/${P.whatsapp}?text=${encodeURIComponent(msg)}`;
  const soles = n => "S/ " + Math.round(n);
  const wireWa = (root = document) => $$("[data-wa]", root).forEach(a => { a.href = waLink(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });

  /* ---------- Torta dibujada con CSS ---------- */
  const WIDTHS = { 1: [86], 2: [92, 62], 3: [96, 72, 48] };
  const lum = hex => { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255; };
  const DECO_POS = {
    flores: [[16, 8], [50, 26], [84, 8], [33, 18], [67, 18]],
    frutas: [[14, 14], [28, 22], [42, 26], [58, 26], [72, 22], [86, 14], [35, 10], [65, 10], [50, 6]],
    petals: ["#f6b8c8", "#fffaf3", "#cdb8e8", "#f7b267"]
  };
  function makeCake(el, opts = {}) {
    el.innerHTML = `<div class="cake">
      ${opts.candles ? `<div class="candles"><span class="candle"></span><span class="candle"></span><span class="candle"></span></div>` : ""}
      <div class="topper off"><div class="topper__plaque"></div><div class="topper__stick"></div></div>
      <div class="tier t3 off"></div><div class="tier t2 off"></div><div class="tier t1 off"></div>
      <div class="stand"></div></div>`;
    const c = $(".cake", el);
    c._state = {};
    return c;
  }
  function updateCake(c, o) {
    const s = c._state;
    const widths = WIDTHS[o.tiers];
    const tiers = [$(".t1", c), $(".t2", c), $(".t3", c)];
    tiers.forEach((t, i) => {
      const on = i < o.tiers;
      t.classList.toggle("off", !on);
      if (on) t.style.setProperty("--w", widths[i]);
    });
    c.style.setProperty("--cover", o.cover);
    c.classList.toggle("dark", lum(o.cover) < .45);
    c.classList.toggle("light", lum(o.cover) > .93);
    ["chispas", "oro", "flores", "frutas"].forEach(d => c.classList.toggle("d-" + d, o.decos.includes(d)));
    const key = o.tiers + "|" + o.decos.join(",");
    if (s.key !== key) {
      s.key = key;
      tiers.forEach((t, ti) => {
        t.innerHTML = "";
        if (ti >= o.tiers) return;
        const top = ti === o.tiers - 1;
        let k = 0, html = "";
        if (o.decos.includes("flores")) {
          DECO_POS.flores.slice(0, top ? 5 : 3).forEach(([x, y], j) => {
            html += `<span class="deco flower" style="left:${x}%;top:${y}%;--i:${k++};--petal:${DECO_POS.petals[(j + ti) % 4]}"></span>`;
          });
        }
        if (o.decos.includes("frutas")) {
          DECO_POS.frutas.slice(0, top ? 9 : 6).forEach(([x, y], j) => {
            const cls = j % 3 === 2 ? "berry blue" : "berry";
            html += `<span class="deco ${cls}" style="left:${x}%;top:${y}%;--i:${k++}"></span>`;
          });
          if (top) html += `<span class="deco leaf" style="left:44%;top:0%;--i:${k++}"></span><span class="deco leaf" style="left:58%;top:4%;--i:${k++};rotate:80deg"></span>`;
        }
        t.innerHTML = html;
      });
    }
    const tp = $(".topper", c);
    tp.classList.toggle("off", !o.text);
    if (o.text) $(".topper__plaque", tp).textContent = o.text;
  }

  /* Torta del hero */
  const hero = makeCake($("#heroCake"), { candles: true });
  updateCake(hero, { tiers: 3, cover: "#f6b8c8", decos: ["flores"], text: "" });
  // pequeña secuencia: cambia de estilo cada cierto tiempo
  if (!reduce) {
    const looks = [
      { tiers: 3, cover: "#f6b8c8", decos: ["flores"] },
      { tiers: 2, cover: "#fffaf3", decos: ["frutas", "oro"] },
      { tiers: 3, cover: "#bfe3d0", decos: ["chispas"] },
      { tiers: 2, cover: "#4a2c2a", decos: ["oro", "frutas"] }
    ];
    let li = 0;
    setInterval(() => {
      if (document.hidden || scrollY > innerHeight) return;
      li = (li + 1) % looks.length;
      updateCake(hero, { ...looks[li], text: "" });
    }, 3200);
  }

  /* Torta de la vitrina */
  updateCake(makeCake($("#shopCake")), { tiers: 2, cover: "#fffaf3", decos: ["frutas"], text: "" });

  /* ---------- Catálogo ---------- */
  const grid = $("#grid");
  function renderGrid(type) {
    const list = P.catalog.filter(p => p.type === type);
    grid.innerHTML = list.map((p, i) => `
      <article class="card" data-id="${p.id}" style="--i:${i};--glow:${p.cover}55">
        <div class="card__stage">${p.tag ? `<span class="card__tag">${p.tag}</span>` : ""}<div class="art"></div></div>
        <div class="card__body">
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="sizes">${p.sizes.map((s, j) => `<button class="size ${j ? "" : "is-on"}" data-j="${j}">${s[0]}${s[1] ? ` · ${s[1]} porc.` : ""}</button>`).join("")}</div>
          <div class="card__foot">
            <div class="card__price"><small>Precio</small><span class="pv">${soles(p.sizes[0][2])}</span></div>
            <a class="order" href="#">Pedir</a>
          </div>
        </div>
      </article>`).join("");
    $$(".card", grid).forEach(card => {
      const p = P.catalog.find(x => x.id === card.dataset.id);
      const art = $(".art", card);
      if (p.icon === "alfajor") art.outerHTML = `<div class="mini"><div class="alfajor"><i></i><i></i><i></i></div></div>`;
      else if (p.icon === "cupcake") art.outerHTML = `<div class="mini"><div class="cupcake"><div class="swirl"></div><div class="wrap"></div></div></div>`;
      else {
        const c = makeCake(art);
        updateCake(c, { tiers: p.icon === "pie" ? 1 : (p.id === "lucuma" || p.id === "redvelvet" ? 2 : 1), cover: p.cover, decos: p.deco ? [p.deco] : [], text: "" });
      }
      let j = 0;
      const setWa = () => {
        const s = p.sizes[j];
        const a = $(".order", card);
        a.href = waLink(`Hola ${P.name}, quiero pedir: ${p.name} (${s[0]}${s[1] ? `, ${s[1]} porciones` : ""}) de ${soles(s[2])}. ¿Para qué fecha está disponible?`);
        a.target = "_blank"; a.rel = "noopener";
      };
      $$(".size", card).forEach(b => b.addEventListener("click", () => {
        j = +b.dataset.j;
        $$(".size", card).forEach(x => x.classList.toggle("is-on", x === b));
        const pv = $(".pv", card);
        pv.textContent = soles(p.sizes[j][2]);
        pv.animate([{ transform: "scale(1.2)" }, { transform: "none" }], { duration: 400, easing: "cubic-bezier(.34,1.56,.64,1)" });
        setWa();
      }));
      setWa();
    });
  }
  $$("#filter button").forEach(b => b.addEventListener("click", () => {
    $$("#filter button").forEach(x => x.classList.toggle("is-on", x === b));
    renderGrid(b.dataset.f);
  }));
  renderGrid("tortas");

  /* ---------- Diseña tu torta ---------- */
  const B = P.builder;
  const st = { tiers: 1, portions: B.portions[0], sponge: B.sponges[0], filling: B.fillings[0], cover: B.covers[0], decos: new Set(["chispas"]), text: "", mode: "recojo" };
  const minPortions = { 1: 12, 2: 20, 3: 30 };
  const build = makeCake($("#buildCake"));

  function chips(el, list, key, label = o => o.name, extra = () => "") {
    el.innerHTML = list.map((o, i) => `<button type="button" class="chip${st[key] === o ? " is-on" : ""}" data-i="${i}">${extra(o)}${label(o)}${o.add ? `<small>+S/ ${o.add}</small>` : ""}</button>`).join("");
    $$(".chip", el).forEach(c => c.addEventListener("click", () => {
      st[key] = list[+c.dataset.i];
      $$(".chip", el).forEach(x => x.classList.toggle("is-on", x === c));
      if (key === "portions") fitTiers();
      refresh();
    }));
  }
  const portionsEl = $("#optPortions");
  const renderPortions = () => chips(portionsEl, B.portions, "portions", o => `${o.n} porciones`);
  renderPortions();
  chips($("#optSponge"), B.sponges, "sponge", o => o.name, o => `<i style="--c:${o.color}"></i>`);
  chips($("#optFilling"), B.fillings, "filling", o => o.name, o => `<i style="--c:${o.color}"></i>`);

  $("#optCover").innerHTML = B.covers.map((o, i) => `<button type="button" class="sw${i ? "" : " is-on"}" style="--c:${o.color}" data-i="${i}" aria-label="${o.name}" title="${o.name}"></button>`).join("");
  $$("#optCover .sw").forEach(b => b.addEventListener("click", () => {
    st.cover = B.covers[+b.dataset.i];
    $$("#optCover .sw").forEach(x => x.classList.toggle("is-on", x === b));
    refresh();
  }));

  const decoEl = $("#optDeco");
  decoEl.innerHTML = B.decos.map((o, i) => `<button type="button" class="chip${st.decos.has(o.id) ? " is-on" : ""}" data-i="${i}">${o.name}${o.add ? `<small>+S/ ${o.add}</small>` : ""}</button>`).join("");
  $$(".chip", decoEl).forEach(c => c.addEventListener("click", () => {
    const o = B.decos[+c.dataset.i];
    st.decos.has(o.id) ? st.decos.delete(o.id) : st.decos.add(o.id);
    c.classList.toggle("is-on");
    refresh();
  }));

  // pisos: si no alcanzan las porciones, se suben solas
  $$("#optTiers button").forEach(b => b.addEventListener("click", () => {
    st.tiers = +b.dataset.v;
    $$("#optTiers button").forEach(x => x.classList.toggle("is-on", x === b));
    if (st.portions.n < minPortions[st.tiers]) {
      st.portions = B.portions.find(p => p.n >= minPortions[st.tiers]);
      renderPortions();
      toast(`Para ${st.tiers} pisos, mínimo ${st.portions.n} porciones`);
    }
    refresh();
  }));
  function fitTiers() {
    if (st.portions.n < minPortions[st.tiers]) {
      st.tiers = st.portions.n >= 20 ? 2 : 1;
      $$("#optTiers button").forEach(x => x.classList.toggle("is-on", +x.dataset.v === st.tiers));
      toast(`Con ${st.portions.n} porciones la torta queda de ${st.tiers} piso${st.tiers > 1 ? "s" : ""}`);
    }
  }

  const textIn = $("#optText");
  textIn.addEventListener("input", () => { st.text = textIn.value.trim(); refresh(); });

  const dateIn = $("#optDate");
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const minD = new Date(); minD.setDate(minD.getDate() + P.minDays);
  dateIn.min = iso(minD);
  dateIn.addEventListener("change", () => dateIn.classList.remove("err"));
  $$("#optMode button").forEach(b => b.addEventListener("click", () => {
    st.mode = b.dataset.v;
    $$("#optMode button").forEach(x => x.classList.toggle("is-on", x === b));
    $("#optDistrict").hidden = st.mode !== "delivery";
    refresh();
  }));

  function price() {
    let p = st.portions.price + (st.tiers - 1) * B.tierAdd + st.sponge.add + st.filling.add;
    B.decos.forEach(d => { if (st.decos.has(d.id)) p += d.add; });
    if (st.mode === "delivery") p += P.deliveryFee;
    return p;
  }
  let shown = 0;
  function refresh() {
    updateCake(build, { tiers: st.tiers, cover: st.cover.color, decos: [...st.decos], text: st.text });
    const sl = $("#slice");
    sl.style.setProperty("--s-cover", st.cover.color);
    sl.style.setProperty("--s-sponge", st.sponge.color);
    sl.style.setProperty("--s-fill", st.filling.color);
    $("#sumTitle").textContent = `${st.tiers} piso${st.tiers > 1 ? "s" : ""} · ${st.portions.n} porciones`;
    $("#sumSub").textContent = `${st.sponge.name} con ${st.filling.name.toLowerCase()}`;
    const to = price(), el = $("#sumPrice");
    if (to !== shown) {
      const from = shown; shown = to;
      if (reduce || !from) el.textContent = soles(to);
      else {
        const t0 = performance.now();
        const tick = now => { const k = Math.min(1, (now - t0) / 450); el.textContent = soles(from + (to - from) * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
        el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick");
      }
    }
  }
  refresh();

  $("#dform").addEventListener("submit", e => {
    e.preventDefault();
    if (!dateIn.value) {
      dateIn.classList.add("err"); dateIn.focus({ preventScroll: true });
      dateIn.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      toast(`Elige la fecha de entrega (mínimo ${P.minDays} días)`);
      return;
    }
    const [y, m, d] = dateIn.value.split("-").map(Number);
    const fecha = new Date(y, m - 1, d).toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" });
    const decos = B.decos.filter(o => st.decos.has(o.id)).map(o => o.name).join(", ") || "Sin decoración";
    let msg = `Hola ${P.name}, diseñé esta torta en su web:\n\n` +
      `• Pisos: ${st.tiers}\n• Porciones: ${st.portions.n}\n• Bizcocho: ${st.sponge.name}\n• Relleno: ${st.filling.name}\n` +
      `• Cobertura: ${st.cover.name}\n• Decoración: ${decos}\n`;
    if (st.text) msg += `• Mensaje: "${st.text}"\n`;
    msg += `• Entrega: ${fecha}, ${st.mode === "delivery" ? "delivery" : "recojo en tienda"}\n`;
    const dist = $("#optDistrict").value.trim();
    if (st.mode === "delivery" && dist) msg += `• Dirección: ${dist}\n`;
    msg += `\nTotal estimado: ${soles(price())}`;
    open(waLink(msg), "_blank", "noopener");
  });

  /* ---------- Reseñas ---------- */
  const rv = P.reviews.map(r => `<figure class="rev"><span class="stars">★★★★★</span><p>“${r[2]}”</p><b>${r[0]} <span>· ${r[1]}</span></b></figure>`).join("");
  $("#reviews").innerHTML = rv + rv;

  /* ---------- Confeti (chispas que caen) ---------- */
  const cv = $("#confetti"), cx = cv.getContext("2d");
  const COLORS = ["#e8506e", "#5bb6e0", "#f4c430", "#7fc99b", "#cdb8e8", "#f6b8c8"];
  let W, H, bits = [];
  const sz = () => { const d = Math.min(devicePixelRatio || 1, 2); W = cv.width = innerWidth * d; H = cv.height = innerHeight * d; };
  const spawn = top => ({ x: Math.random() * W, y: top ? -20 : Math.random() * H, l: (6 + Math.random() * 6) * (devicePixelRatio || 1), a: Math.random() * 6, va: (Math.random() - .5) * .05, vy: .4 + Math.random() * .7, c: COLORS[Math.random() * COLORS.length | 0] });
  if (!reduce) {
    sz(); addEventListener("resize", sz);
    for (let i = 0; i < (innerWidth < 700 ? 18 : 36); i++) bits.push(spawn(false));
    (function loop() {
      cx.clearRect(0, 0, W, H);
      const vis = Math.max(0, 1 - scrollY / innerHeight);
      if (vis > 0) {
        cx.globalAlpha = vis * .8;
        cx.lineCap = "round";
        for (const b of bits) {
          b.y += b.vy; b.a += b.va; b.x += Math.sin(b.a) * .3;
          if (b.y > H + 20) Object.assign(b, spawn(true));
          cx.strokeStyle = b.c; cx.lineWidth = b.l / 2.6;
          cx.beginPath();
          cx.moveTo(b.x - Math.cos(b.a) * b.l / 2, b.y - Math.sin(b.a) * b.l / 2);
          cx.lineTo(b.x + Math.cos(b.a) * b.l / 2, b.y + Math.sin(b.a) * b.l / 2);
          cx.stroke();
        }
      }
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Reveal, nav y menú ---------- */
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("is-in"); io.unobserve(en.target);
  }), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  const nav = $("#nav");
  let lastY = 0;
  addEventListener("scroll", () => {
    const y = scrollY;
    nav.classList.toggle("is-hidden", y > 300 && y > lastY && !nav.classList.contains("is-open"));
    lastY = y;
  }, { passive: true });
  $("#burger").addEventListener("click", () => nav.classList.toggle("is-open"));
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => nav.classList.remove("is-open")));

  let tt;
  function toast(t) {
    const el = $("#toast");
    el.textContent = t; el.classList.add("is-on");
    clearTimeout(tt); tt = setTimeout(() => el.classList.remove("is-on"), 2400);
  }

  wireWa();
  const ready = () => setTimeout(() => document.body.classList.add("is-ready"), 200);
  document.readyState === "complete" ? ready() : addEventListener("load", ready);
})();
