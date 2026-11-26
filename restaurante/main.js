/* Wayra · interacciones y animaciones (sin librerías) */
(() => {
  const R = window.RESTO;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const waLink = msg => `https://wa.me/${R.whatsapp}?text=${encodeURIComponent(msg)}`;

  $$("[data-wa]").forEach(a => { a.href = waLink(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });

  /* ---------- Brasas (canvas) ---------- */
  const cv = $("#embers"), cx = cv.getContext("2d");
  let W, H, parts = [];
  function size() {
    const d = Math.min(devicePixelRatio || 1, 2);
    W = cv.width = innerWidth * d; H = cv.height = innerHeight * d;
    cx.setTransform(1, 0, 0, 1, 0, 0);
  }
  function spawn(y) {
    return { x: Math.random() * W, y: y ?? H + Math.random() * 40, r: (Math.random() * 1.8 + .6) * (devicePixelRatio || 1),
      vy: -(Math.random() * .6 + .25), vx: (Math.random() - .5) * .3, life: 0, max: 400 + Math.random() * 500, ph: Math.random() * 6 };
  }
  if (!reduce) {
    size(); addEventListener("resize", size);
    const n = innerWidth < 700 ? 28 : 60;
    for (let i = 0; i < n; i++) parts.push(spawn(Math.random() * H));
    (function loop() {
      cx.clearRect(0, 0, W, H);
      const fade = Math.max(0, 1 - scrollY / (innerHeight * 1.4)) * .9 + .1;
      for (const p of parts) {
        p.life++; p.ph += .02;
        p.x += p.vx + Math.sin(p.ph) * .3; p.y += p.vy;
        const a = Math.sin(Math.PI * Math.min(1, p.life / p.max)) * fade;
        cx.beginPath();
        cx.fillStyle = `rgba(${240},${120 + (p.r * 20 | 0)},${50},${a})`;
        cx.shadowColor = "rgba(226,85,45,.9)"; cx.shadowBlur = 10;
        cx.arc(p.x, p.y, p.r, 0, Math.PI * 2); cx.fill();
        if (p.life > p.max || p.y < -10) Object.assign(p, spawn());
      }
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Manifiesto: palabras que se encienden ---------- */
  const man = $("#manifesto");
  const goldWords = ["viento", "mar", "brasa", "Perú", "respeto"];
  man.innerHTML = man.textContent.trim().split(/\s+/).map(w => {
    const clean = w.replace(/[.,]/g, "");
    return `<span class="mw${goldWords.includes(clean) ? " gold" : ""}">${w}</span>`;
  }).join(" ");
  const words = $$(".mw", man);

  /* ---------- Carta ---------- */
  const dishes = $("#dishes");
  const tagHtml = t => ({ chef: '<span class="t t--chef" title="Recomendado del chef">✦</span>', picante: '<span class="t" title="Picante">🌶</span>', veg: '<span class="t t--veg" title="Vegetariano">●</span>' })[t] || "";
  function renderCat(k) {
    dishes.innerHTML = R.menu[k].map((d, i) => `
      <article class="dish-row" style="--i:${i}">
        <div class="dish-row__top"><h3>${d.name} ${(d.tags || []).map(tagHtml).join("")}</h3><span class="dots"></span><span class="price">S/ ${d.price}</span></div>
        <p>${d.desc}</p>
      </article>`).join("");
  }
  $$(".cat").forEach(c => c.addEventListener("click", () => {
    $$(".cat").forEach(x => x.classList.toggle("is-active", x === c));
    renderCat(c.dataset.cat);
  }));
  renderCat("entradas");

  /* ---------- Degustación ---------- */
  const T = R.tasting;
  $("#tPrice").textContent = "S/ " + T.price;
  $("#tPair").textContent = `Maridaje opcional +S/ ${T.pairing}`;
  const track = $("#track");
  track.innerHTML = T.courses.map((c, i) => `
    <article class="course">
      <span class="course__n">TIEMPO ${String(i + 1).padStart(2, "0")}</span>
      <div class="course__art"><div class="dot-plate" style="--hue:${c.hue}"><i></i></div></div>
      <h3>${c.name}</h3><p>${c.desc}</p>
    </article>`).join("") + `
    <article class="course" style="justify-content:center;text-align:center">
      <span class="course__n">RESERVA</span>
      <h3>Vive la experiencia completa</h3>
      <p>Disponible de martes a sábado en la cena. Reserva con 24 horas de anticipación.</p>
      <a class="btn btn--gold" href="#reservas">Reservar degustación</a>
    </article>`;
  const tasting = $("#degustacion"), tBar = $("#tBar");
  const isDesk = () => innerWidth > 980;

  /* ---------- Scroll ---------- */
  const nav = $("#nav");
  let lastY = 0;
  function onScroll() {
    const y = scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    nav.classList.toggle("is-hidden", y > 500 && y > lastY && !nav.classList.contains("is-open"));
    lastY = y;

    // manifiesto
    const mr = man.getBoundingClientRect();
    const k = Math.min(1, Math.max(0, (innerHeight * .8 - mr.top) / (mr.height + innerHeight * .35)));
    const lit = Math.round(k * words.length);
    words.forEach((w, i) => w.classList.toggle("on", i < lit));

    // degustación horizontal
    if (isDesk()) {
      const r = tasting.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
      const max = track.scrollWidth - innerWidth;
      track.style.transform = `translateX(${-p * max}px)`;
      tBar.style.width = p * 100 + "%";
    }

    // plato: leve rotación con el scroll
    if (!reduce) $("#plate").style.transform = `translateY(${y * .12}px) rotate(${y * .04}deg)`;
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  track.addEventListener("scroll", () => {
    if (!isDesk()) tBar.style.width = (track.scrollLeft / (track.scrollWidth - track.clientWidth)) * 100 + "%";
  }, { passive: true });

  $("#burger").addEventListener("click", () => {
    nav.classList.toggle("is-open");
    document.body.classList.toggle("is-locked", nav.classList.contains("is-open"));
  });
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("is-open"); document.body.classList.remove("is-locked"); }));

  /* ---------- Reveal y contadores ---------- */
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("is-in"); io.unobserve(en.target);
  }), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => io.observe(el));
  const cio = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, to = +el.dataset.count, suf = el.dataset.suffix || "", t0 = performance.now();
    const tick = now => {
      const k = Math.min(1, (now - t0) / 1600), e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(to * e) + suf;
      if (k < 1) requestAnimationFrame(tick);
    };
    reduce ? (el.textContent = to + suf) : requestAnimationFrame(tick);
    cio.unobserve(el);
  }), { threshold: .6 });
  $$("[data-count]").forEach(el => cio.observe(el));

  /* ---------- Reservas ---------- */
  const st = { date: "", time: "", people: 2, zone: R.zones[0] };
  const dateIn = $("#rDate");
  const today = new Date();
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateIn.min = iso(today);
  const max = new Date(today); max.setDate(max.getDate() + 60); dateIn.max = iso(max);

  function chips(el, list, key) {
    el.innerHTML = list.map(v => `<button type="button" class="chip${st[key] === v ? " is-on" : ""}">${v}</button>`).join("");
    $$(".chip", el).forEach(c => c.addEventListener("click", () => {
      st[key] = c.textContent;
      $$(".chip", el).forEach(x => x.classList.toggle("is-on", x === c));
      el.classList.remove("err");
      updateTicket();
    }));
  }
  chips($("#rTimes"), R.times, "time");
  chips($("#rZones"), R.zones, "zone");
  $("#rOcc").innerHTML = R.occasions.map(o => `<option>${o}</option>`).join("");

  $$(".stepper button").forEach(b => b.addEventListener("click", () => {
    st.people = Math.min(12, Math.max(1, st.people + +b.dataset.d));
    $("#rPeople").textContent = st.people;
    updateTicket();
  }));
  const fmtDate = v => {
    if (!v) return "";
    const [y, m, d] = v.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" });
  };
  function updateTicket() {
    st.date = dateIn.value;
    $("#tkDate").textContent = fmtDate(st.date) || "Elige una fecha";
    $("#tkTime").textContent = st.time || "—";
    $("#tkPeople").textContent = st.people + (st.people === 1 ? " persona" : " personas");
    $("#tkZone").textContent = st.zone;
    $("#tkName").textContent = $("#rName").value.trim() || "—";
    const tk = $("#ticket");
    if (!reduce) { tk.classList.remove("is-on"); void tk.offsetWidth; tk.classList.add("is-on"); }
  }
  dateIn.addEventListener("change", () => { dateIn.closest(".rfield").classList.remove("err"); updateTicket(); });
  $("#rName").addEventListener("input", () => $("#tkName").textContent = $("#rName").value.trim() || "—");
  updateTicket();

  $("#rform").addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    if (!dateIn.value) { dateIn.closest(".rfield").classList.add("err"); ok = false; }
    if (!st.time) { $("#rTimes").classList.add("err"); ok = false; }
    if (!ok) { toast("Elige fecha y hora para tu reserva"); return; }
    const occ = $("#rOcc").value, notes = $("#rNotes").value.trim(), name = $("#rName").value.trim();
    let msg = `Hola ${R.name}, quisiera reservar una mesa:\n\n• Fecha: ${fmtDate(st.date)}\n• Hora: ${st.time}\n• Personas: ${st.people}\n• Zona: ${st.zone}`;
    if (occ !== R.occasions[0]) msg += `\n• Ocasión: ${occ}`;
    if (name) msg += `\n• A nombre de: ${name}`;
    if (notes) msg += `\n• Notas: ${notes}`;
    open(waLink(msg), "_blank", "noopener");
  });

  let tt;
  function toast(t) {
    const el = $("#toast");
    el.textContent = t; el.classList.add("is-on");
    clearTimeout(tt); tt = setTimeout(() => el.classList.remove("is-on"), 2200);
  }

  /* Plato sigue al mouse */
  if (fine && !reduce) {
    const svg = $(".plate");
    addEventListener("pointermove", e => {
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      svg.style.translate = `${x * 18}px ${y * 14}px`;
    });
  }

  onScroll();
  const ready = () => setTimeout(() => document.body.classList.add("is-ready"), 500);
  document.readyState === "complete" ? ready() : addEventListener("load", ready);
})();
