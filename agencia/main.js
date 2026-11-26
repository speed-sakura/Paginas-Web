(() => {
  const A = window.AGENCY;
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wa = (text) => `https://wa.me/${A.whatsapp}?text=${encodeURIComponent(text)}`;

  // Marca
  document.querySelectorAll("[data-brand]").forEach((el) => (el.textContent = A.name));
  document.querySelectorAll("[data-brand-up]").forEach((el) => (el.textContent = A.name.toUpperCase()));
  $("#wa").href = wa(`Hola ${A.name}, quiero una página web para mi negocio.`);

  // ---------- Navegación ----------
  const nav = $("#nav"), burger = $("#burger"), mmenu = $("#mmenu");
  const setMenu = (open) => { burger.setAttribute("aria-expanded", open); mmenu.hidden = !open; nav.classList.toggle("is-solid", open || scrollY > 20); };
  burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  mmenu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

  // ---------- Revelado ----------
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".rv, .giant").forEach((el) => io.observe(el));
  document.querySelectorAll(".gl > span").forEach((s, i) => s.style.setProperty("--n", i));

  // ---------- Carrusel 3D (coverflow) ----------
  const stage = $("#cfStage"), cf = $("#cf");
  const slides = A.showcase.map((s, i) => {
    const el = document.createElement("figure");
    el.className = "slide";
    el.setAttribute("role", "group");
    el.setAttribute("aria-label", `${i + 1} de ${A.showcase.length}: ${s.tag}`);
    el.innerHTML = `<div class="browser"><i></i><i></i><i></i></div>
      <img src="${s.img}" alt="Web de ${s.tag.toLowerCase()} ${s.word}" width="1200" height="750" ${i > 1 ? 'loading="lazy"' : ""}>
      <span class="slide__word">${s.word}</span><span class="slide__tag">${s.tag}</span>`;
    el.addEventListener("click", () => { if (i !== cur) go(i); else location.href = s.url; });
    stage.appendChild(el);
    return el;
  });
  let cur = 0;
  const n = slides.length;
  function layout() {
    const wide = innerWidth > 720;
    slides.forEach((el, i) => {
      let o = i - cur;
      if (o > n / 2) o -= n;
      if (o < -n / 2) o += n;
      const a = Math.abs(o);
      const x = o * (wide ? 52 : 70);
      el.style.transform = `translateX(${x}%) translateZ(${-a * (wide ? 220 : 160)}px) rotateY(${-o * (wide ? 32 : 40)}deg)`;
      el.style.opacity = a > 2 ? 0 : a === 2 ? 0.35 : a === 1 ? 0.8 : 1;
      el.style.filter = a ? `brightness(${a === 1 ? 0.55 : 0.35})` : "none";
      el.style.zIndex = 10 - a;
      el.classList.toggle("is-active", a === 0);
      el.setAttribute("aria-hidden", a !== 0);
    });
    const s = A.showcase[cur];
    $("#cfOpen").href = s.url;
    $("#cfCaption").textContent = `${s.tag} · ${cur + 1} / ${n}`;
  }
  function go(i) { cur = (i + n) % n; layout(); restart(); }
  $("#cfPrev").addEventListener("click", () => go(cur - 1));
  $("#cfNext").addEventListener("click", () => go(cur + 1));
  let timer;
  const restart = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => { if (!document.hidden && heroVisible) { cur = (cur + 1) % n; layout(); } }, 4200); };
  let heroVisible = true;
  new IntersectionObserver(([e]) => (heroVisible = e.isIntersecting)).observe(cf);
  swipe(cf, () => go(cur + 1), () => go(cur - 1));
  addEventListener("resize", layout, { passive: true });
  layout(); restart();

  // ---------- Cifras con conteo ----------
  const row = $("#statsRow");
  A.stats.forEach((s, i) => {
    const d = document.createElement("div");
    d.className = "stat rv";
    d.style.setProperty("--i", i + 1);
    d.innerHTML = `<b data-v="${s.value}" data-d="${s.decimals || 0}" data-p="${s.prefix || ""}" data-s="${s.suffix || ""}">${s.prefix || ""}0${s.suffix || ""}</b><span>${s.label}</span>`;
    row.appendChild(d);
    io.observe(d);
  });
  const fmt = (v, d) => v.toLocaleString("es-PE", { minimumFractionDigits: d, maximumFractionDigits: d });
  new IntersectionObserver((es, ob) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    ob.disconnect();
    row.querySelectorAll("b").forEach((b) => {
      const v = +b.dataset.v, d = +b.dataset.d, p = b.dataset.p, sf = b.dataset.s;
      if (reduce) { b.textContent = p + fmt(v, d) + sf; return; }
      const t0 = performance.now(), dur = 1400;
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / dur), e2 = 1 - Math.pow(1 - k, 4);
        b.textContent = p + fmt(v * e2, d) + sf;
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }), { threshold: 0.4 }).observe(row);

  // ---------- Efectos ligados al scroll ----------
  const growWord = $(".grow__word"), giant = $(".giant"), lines = [...document.querySelectorAll(".gl > span")];
  const phA = $(".ph--a"), phB = $(".ph--b"), waBtn = $("#wa");
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    nav.classList.toggle("is-solid", y > 20 || !mmenu.hidden);
    waBtn.classList.toggle("show", y > vh * 0.6);
    if (reduce) return;
    const r1 = growWord.parentElement.getBoundingClientRect();
    if (r1.bottom > 0 && r1.top < vh) {
      const p = (r1.top + r1.height / 2 - vh / 2) / vh;
      growWord.style.transform = `translateX(${p * -60}px)`;
    }
    const r2 = giant.getBoundingClientRect();
    if (r2.bottom > 0 && r2.top < vh) {
      const p = (r2.top + r2.height / 2 - vh / 2) / vh; // -1..1
      const w = Math.min(60, innerWidth * 0.05);
      lines.forEach((s, i) => s.style.setProperty("--sx", `${(i % 2 ? 1 : -1) * p * w}px`));
      phA.style.transform = `translateY(${p * 80}px)`;
      phB.style.transform = `translateY(${p * -60}px)`;
    }
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // ---------- Prisma de planes ----------
  const prism = $("#prism"), dots = $("#pDots"), plan = $("#plan");
  A.plans.forEach((p, i) => {
    const f = document.createElement("div");
    f.className = "face";
    f.style.setProperty("--f", i);
    f.innerHTML = `<img src="${p.img}" alt="" loading="lazy" width="1200" height="750"><span class="face__label">${p.name}</span>`;
    prism.appendChild(f);
    const b = document.createElement("button");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", p.name);
    b.addEventListener("click", () => setPlan(i));
    dots.appendChild(b);
  });
  let pi = 0, turns = 0;
  function setPlan(i, dir) {
    const m = A.plans.length;
    const next = (i + m) % m;
    // gira por el camino más corto, acumulando vueltas para que nunca "rebobine"
    let step = dir ?? next - pi;
    if (dir === undefined) { if (step > m / 2) step -= m; if (step < -m / 2) step += m; }
    turns += step;
    pi = next;
    prism.style.setProperty("--ry", `${-turns * 90}deg`);
    const p = A.plans[pi];
    $("#planN").textContent = `${String(pi + 1).padStart(2, "0")} / ${String(m).padStart(2, "0")}`;
    $("#planName").textContent = p.name;
    $("#planLead").textContent = p.lead;
    $("#planList").innerHTML = p.bullets.map((b) => `<li>${b}</li>`).join("");
    $("#planPrice").textContent = p.price;
    $("#planAsk").href = wa(`Hola ${A.name}, me interesa el plan "${p.name}" (${p.price}). ¿Me pueden dar más información?`);
    $("#planCard").innerHTML = `<b>${p.name}</b>${p.card}`;
    [...dots.children].forEach((d, k) => d.setAttribute("aria-selected", k === pi));
    plan.classList.remove("swap"); void plan.offsetWidth; plan.classList.add("swap");
  }
  $("#pPrev").addEventListener("click", () => setPlan(pi - 1, -1));
  $("#pNext").addEventListener("click", () => setPlan(pi + 1, 1));
  swipe($(".prism-wrap"), () => setPlan(pi + 1, 1), () => setPlan(pi - 1, -1));
  setPlan(0, 0);
  plan.classList.remove("swap");

  // ---------- Formulario a WhatsApp ----------
  const sel = $("#formTipo");
  sel.innerHTML = A.plans.map((p) => `<option>${p.name}</option>`).join("") + "<option>Aún no lo sé</option>";
  $("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target, msg = $("#formMsg");
    let ok = true;
    ["nombre", "negocio"].forEach((k) => {
      const bad = !f[k].value.trim();
      f[k].setAttribute("aria-invalid", bad);
      if (bad && ok) { f[k].focus(); ok = false; }
    });
    if (!ok) { msg.textContent = "Completa tu nombre y tu negocio."; return; }
    msg.textContent = "";
    open(wa(`Hola ${A.name}, soy ${f.nombre.value.trim()}.\nNegocio: ${f.negocio.value.trim()}\nQuiero: ${f.tipo.value}`), "_blank", "noopener");
  });

  // ---------- Deslizar con el dedo ----------
  function swipe(el, next, prev) {
    let x0 = null, y0 = 0;
    el.addEventListener("pointerdown", (e) => { x0 = e.clientX; y0 = e.clientY; }, { passive: true });
    el.addEventListener("pointerup", (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0, dy = e.clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? next() : prev(); swallow(el); }
    });
    el.addEventListener("pointercancel", () => (x0 = null));
  }
  function swallow(el) {
    const stop = (e) => { e.stopPropagation(); e.preventDefault(); };
    el.addEventListener("click", stop, { capture: true, once: true });
    setTimeout(() => el.removeEventListener("click", stop, { capture: true }), 50);
  }
})();
