/* Kuntur Mobile · interacciones y animaciones (sin librerías) */
(() => {
  const S = window.STORE;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const soles = n => "S/ " + Math.round(n).toLocaleString("en-US");
  const waLink = msg => `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(msg)}`;
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- Celular 3D hecho con CSS ---------- */
  function buildPhone(el, { frame, c1, c2, cam = "tri", layers = 8 }) {
    el.style.setProperty("--frame", frame);
    el.style.setProperty("--c1", c1);
    el.style.setProperty("--c2", c2);
    const t = parseFloat(getComputedStyle(el).getPropertyValue("--t")) || 10;
    let edge = "";
    for (let i = 0; i < layers; i++) {
      const z = -t / 2 + (t * (i + 0.5)) / layers;
      edge += `<div class="ph-layer" style="transform:translateZ(${z.toFixed(2)}px)"></div>`;
    }
    el.innerHTML = `${edge}
      <div class="ph-face ph-back">
        <div class="cams cams--${cam}"><span class="lens"></span><span class="lens"></span><span class="lens"></span><span class="flash"></span></div>
        <div class="ph-logo">KUNTUR</div>
      </div>
      <div class="ph-face ph-front"><div class="ph-screen">
        <span class="ph-island"></span>
        <span class="ph-date">jueves 26 de noviembre</span>
        <span class="ph-time">9:41</span>
        <div class="ph-dock"><i></i><i></i><i></i><i></i></div>
      </div></div>`;
  }

  /* ---------- Enlaces de WhatsApp ---------- */
  function wireWa(root = document) {
    $$("[data-wa]", root).forEach(a => {
      a.href = waLink(a.dataset.wa);
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  /* ---------- Catálogo ---------- */
  const grid = $("#products");
  grid.innerHTML = S.products.map((p, i) => {
    const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    const badgeCls = p.badge ? "product__badge--" + p.badge.toLowerCase().normalize("NFD").replace(/[^a-z]/g, "") : "";
    return `
    <article class="product reveal" data-id="${p.id}" data-brand="${p.brand}" data-oferta="${p.oldPrice ? 1 : 0}" style="--d:${(i % 3) * 0.08}s;--glow:${p.colors[0][1]}">
      <div class="product__stage">
        ${p.badge ? `<span class="product__badge ${badgeCls}">${p.badge}</span>` : ""}
        ${off ? `<span class="product__off">-${off}%</span>` : ""}
        <div class="phone3d ph-a"></div>
        <div class="phone3d ph-b"></div>
      </div>
      <div class="product__body">
        <span class="product__brand">${p.brand} · ${p.storage}</span>
        <h3 class="product__name">${p.name}</h3>
        <div class="product__specs">${p.specs.map(s => `<span>${s}</span>`).join("")}</div>
        <div class="swatches">
          ${p.colors.map((c, j) => `<button class="swatch ${j ? "" : "is-active"}" style="--sw:${c[1]}" data-i="${j}" aria-label="${c[0]}"></button>`).join("")}
          <span class="swatch-name">${p.colors[0][0]}</span>
        </div>
        <div class="product__foot">
          <div class="price">
            ${p.oldPrice ? `<s>${soles(p.oldPrice)}</s>` : ""}
            <b>${soles(p.price)}</b>
            <small>o ${S.installments} cuotas de ${soles(Math.ceil(p.price / S.installments))}</small>
          </div>
          <div class="product__btns">
            <button class="add-btn" aria-label="Agregar al pedido">+</button>
            <a class="wa-mini" data-wa="Hola ${S.name}, me interesa el ${p.name} ${p.storage} de ${soles(p.price)} que vi en la web.">Pedir</a>
          </div>
        </div>
      </div>
    </article>`;
  }).join("");

  $$(".product").forEach(card => {
    const p = S.products.find(x => x.id === card.dataset.id);
    card._color = 0;
    const opts = { frame: p.colors[0][1], c1: p.screen[0], c2: p.screen[1], cam: p.cam, layers: 4 };
    buildPhone($(".ph-a", card), opts);
    buildPhone($(".ph-b", card), opts);

    $$(".swatch", card).forEach(sw => sw.addEventListener("click", () => {
      const i = +sw.dataset.i;
      card._color = i;
      $$(".swatch", card).forEach(s => s.classList.toggle("is-active", s === sw));
      $(".swatch-name", card).textContent = p.colors[i][0];
      $$(".phone3d", card).forEach(ph => ph.style.setProperty("--frame", p.colors[i][1]));
      card.style.setProperty("--glow", p.colors[i][1]);
    }));

    $(".add-btn", card).addEventListener("click", () => addToCart(p, card._color));

    if (fine && !reduce) {
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", x * 100 + "%");
        card.style.setProperty("--my", y * 100 + "%");
        card.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 8}deg)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    }
  });

  // Filtros
  $$("#filters .chip").forEach(chip => chip.addEventListener("click", () => {
    $$("#filters .chip").forEach(c => c.classList.toggle("is-active", c === chip));
    const f = chip.dataset.filter;
    $$(".product").forEach(card => {
      const show = f === "all" || card.dataset.brand === f || (f === "oferta" && card.dataset.oferta === "1");
      card.classList.toggle("is-hidden", !show);
      if (show) { card.classList.remove("is-in"); requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add("is-in"))); }
    });
  }));

  /* ---------- Pedido (carrito que se envía por WhatsApp) ---------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("kuntur-cart") || "[]"); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem("kuntur-cart", JSON.stringify(cart)); } catch (e) {} };
  const drawer = $("#drawer");

  function addToCart(p, ci) {
    const key = p.id + ":" + ci;
    const found = cart.find(x => x.key === key);
    found ? found.qty++ : cart.push({ key, id: p.id, ci, qty: 1 });
    save(); renderCart();
    const btn = $("#cartOpen");
    btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
    toast(`${p.name} agregado a tu pedido`);
  }

  function renderCart() {
    const items = cart.map(x => ({ ...x, p: S.products.find(p => p.id === x.id) })).filter(x => x.p);
    const count = items.reduce((a, x) => a + x.qty, 0);
    const total = items.reduce((a, x) => a + x.qty * x.p.price, 0);
    const badge = $("#cartCount");
    badge.textContent = count;
    badge.classList.toggle("has", count > 0);
    $("#cartTotal").textContent = soles(total);
    $("#cartItems").innerHTML = items.length ? items.map(x => `
      <div class="line-item">
        <span class="line-item__sw" style="--sw:${x.p.colors[x.ci][1]}"></span>
        <div><b>${x.p.name}</b><small>${x.p.storage} · ${x.p.colors[x.ci][0]} · ${soles(x.p.price)}</small></div>
        <div class="qty"><button data-k="${x.key}" data-d="-1" aria-label="Quitar uno">−</button><span>${x.qty}</span><button data-k="${x.key}" data-d="1" aria-label="Agregar uno">+</button></div>
      </div>`).join("") : `<p class="drawer__empty">Tu pedido está vacío.<br>Agrega un celular con el botón +</p>`;
    const msg = items.length
      ? `Hola ${S.name}, quiero hacer este pedido:\n\n` +
        items.map(x => `• ${x.qty} x ${x.p.name} ${x.p.storage} (${x.p.colors[x.ci][0]}) = ${soles(x.qty * x.p.price)}`).join("\n") +
        `\n\nTotal: ${soles(total)}\nMi ciudad es: `
      : `Hola ${S.name}, quiero información sobre un celular.`;
    $("#cartWa").href = waLink(msg);
  }
  $("#cartItems").addEventListener("click", e => {
    const b = e.target.closest("button[data-k]"); if (!b) return;
    const it = cart.find(x => x.key === b.dataset.k); if (!it) return;
    it.qty += +b.dataset.d;
    if (it.qty <= 0) cart = cart.filter(x => x !== it);
    save(); renderCart();
  });
  const openDrawer = v => { drawer.classList.toggle("is-open", v); drawer.setAttribute("aria-hidden", !v); document.body.classList.toggle("is-locked", v); };
  $("#cartOpen").addEventListener("click", () => openDrawer(true));
  $$("[data-close]", drawer).forEach(el => el.addEventListener("click", () => openDrawer(false)));
  addEventListener("keydown", e => { if (e.key === "Escape") openDrawer(false); });
  renderCart();

  let toastT;
  function toast(text) {
    const t = $("#toast"); t.textContent = text; t.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("is-on"), 2200);
  }

  /* ---------- Reseñas ---------- */
  const reviewHTML = S.reviews.map(([n, c, t]) => `
    <article class="review"><div class="stars">★★★★★</div><p>“${t}”</p>
    <footer><span class="avatar">${n[0]}</span><div><b>${n}</b><small>${c}</small></div></footer></article>`).join("");
  $("#reviews").innerHTML = reviewHTML + reviewHTML;

  /* ---------- Plan canje ---------- */
  const tBase = { apple: 1800, samsung: 1200, xiaomi: 600, motorola: 450, otro: 300 };
  const tAge = { 1: 1, 2: 0.62, 3: 0.35 };
  let tShown = 0;
  function seg(id) {
    $$(`#${id} button`).forEach(b => b.addEventListener("click", () => {
      $$(`#${id} button`).forEach(x => x.classList.toggle("is-active", x === b)); calcTrade();
    }));
  }
  function calcTrade() {
    const brand = $("#tBrand").value;
    const age = +$("#tAge .is-active").dataset.v;
    const cond = +$("#tCond .is-active").dataset.v;
    const val = Math.round((tBase[brand] * tAge[age] * cond) / 10) * 10;
    animateNum($("#tValue"), tShown, val, v => soles(v)); tShown = val;
    const label = $("#tBrand").selectedOptions[0].textContent;
    $("#tradeWa").href = waLink(`Hola ${S.name}, quiero cotizar mi ${label} (${$("#tAge .is-active").textContent}, ${$("#tCond .is-active").textContent}) para el Plan Canje. La web me estimó hasta ${soles(val)}.`);
  }
  seg("tAge"); seg("tCond");
  $("#tBrand").addEventListener("change", calcTrade);
  calcTrade();

  function animateNum(el, from, to, fmt, dur = 900) {
    if (reduce) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const tick = now => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = fmt(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Revelado y contadores ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("is-in");
    io.unobserve(en.target);
  }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  const cio = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, to = +el.dataset.count, suf = el.dataset.suffix || "";
    animateNum(el, 0, to, v => Math.round(v).toLocaleString("en-US") + suf, 1800);
    cio.unobserve(el);
  }), { threshold: 0.6 });
  $$("[data-count]").forEach(el => cio.observe(el));

  /* ---------- Hero: celular 3D que gira y sigue al mouse ---------- */
  const heroPhone = $("#heroPhone");
  buildPhone(heroPhone, { frame: "#c4a58a", c1: "#ff8a3d", c2: "#5b2bff", cam: "tri", layers: 10 });
  const showPhone = $("#showPhone");
  buildPhone(showPhone, { frame: "#8a9bb0", c1: "#4fd1ff", c2: "#2b2bff", cam: "vertical", layers: 10 });

  let mx = 0, my = 0, cmx = 0, cmy = 0;
  if (fine) addEventListener("pointermove", e => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });

  /* ---------- Showcase: el celular gira con el scroll ---------- */
  const show = $("#destacado"), steps = $$(".step"), dots = $$("#stepDots i"), specs = $$(".spec"), bigWord = $("#bigWord");
  const words = ["ULTRA", "200 MP", "5000 mAh", "TITANIO"];
  // [progreso, giro Y, giro X, escala]
  const keys = [[0, -28, 6, 1], [0.18, -12, 4, 1.02], [0.32, 165, -4, 1.06], [0.46, 200, -8, 1.06], [0.58, 285, 10, 1], [0.72, 330, 6, 1], [0.86, 375, -6, 1.05], [1, 340, 4, 1.05]];
  const sample = p => {
    for (let i = 1; i < keys.length; i++) if (p <= keys[i][0]) {
      const a = keys[i - 1], b = keys[i], t = (p - a[0]) / (b[0] - a[0]), e = t * t * (3 - 2 * t);
      return [lerp(a[1], b[1], e), lerp(a[2], b[2], e), lerp(a[3], b[3], e)];
    }
    return keys[keys.length - 1].slice(1);
  };
  let cur = sample(0), stepNow = -1;

  const nav = $("#nav"), progress = $("#progress");
  let lastY = scrollY;

  function frame(now) {
    const y = scrollY;
    // barra de progreso y nav
    progress.style.transform = `scaleX(${y / (document.documentElement.scrollHeight - innerHeight)})`;
    if (Math.abs(y - lastY) > 6) { nav.classList.toggle("is-hidden", y > lastY && y > 400 && !nav.classList.contains("is-open")); lastY = y; }

    cmx = lerp(cmx, mx, 0.06); cmy = lerp(cmy, my, 0.06);

    // hero
    if (y < innerHeight * 1.2) {
      const t = reduce ? 0 : now / 1000;
      // balanceo suave y, cada 8 s, una vuelta completa para mostrar las cámaras
      const c = t % 8, k = c > 6.2 ? (c - 6.2) / 1.8 : 0, turn = k * k * (3 - 2 * k) * 360;
      const spin = reduce ? -18 : Math.sin(t * 0.45) * 22 - 14 + turn;
      heroPhone.style.transform = `translateY(${Math.sin(t * 1.1) * 12 - y * 0.15}px) rotateX(${8 - cmy * 18}deg) rotateY(${spin + cmx * 40}deg) rotateZ(${-4 + cmx * 4}deg)`;
    }

    // showcase
    const r = show.getBoundingClientRect();
    const total = show.offsetHeight - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / total));
    if (r.top < innerHeight && r.bottom > 0) {
      const target = sample(p);
      cur = cur.map((v, i) => lerp(v, target[i], reduce ? 1 : 0.1));
      showPhone.style.transform = `rotateX(${cur[1] + cmy * 10}deg) rotateY(${cur[0] + cmx * 16}deg) scale(${cur[2]})`;
      bigWord.style.transform = `translate3d(${-p * 55}%, -50%, 0)`;
      const s = Math.min(3, Math.floor(p * 4));
      if (s !== stepNow) {
        stepNow = s;
        steps.forEach((el, i) => el.classList.toggle("is-active", i === s));
        dots.forEach((el, i) => el.classList.toggle("is-on", i === s));
        specs.forEach(el => el.classList.toggle("is-on", +el.dataset.step === s));
        bigWord.textContent = words[s];
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- Botones magnéticos ---------- */
  if (fine && !reduce) $$(".magnetic").forEach(b => {
    b.addEventListener("pointermove", e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    b.addEventListener("pointerleave", () => { b.style.transform = ""; });
  });

  /* ---------- Tilt suave en tarjetas ---------- */
  if (fine && !reduce) $$(".tilt").forEach(c => {
    c.addEventListener("pointermove", e => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg)`;
    });
    c.addEventListener("pointerleave", () => { c.style.transform = ""; });
  });

  /* ---------- Menú móvil ---------- */
  $("#burger").addEventListener("click", () => nav.classList.toggle("is-open"));
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => nav.classList.remove("is-open")));

  /* ---------- WhatsApp ---------- */
  wireWa();
  setTimeout(() => { const f = $(".wa-float"); f.classList.add("show-tip"); setTimeout(() => f.classList.remove("show-tip"), 4000); }, 6000);

  /* ---------- Listo ---------- */
  const ready = () => setTimeout(() => document.body.classList.add("is-ready"), 500);
  document.readyState === "complete" ? ready() : addEventListener("load", ready);
})();
