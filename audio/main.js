(() => {
  const S = window.STORE;
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const soles = (n) => "S/ " + n.toLocaleString("es-PE");
  const wa = (msg) => `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(msg)}`;
  setTimeout(() => document.body.classList.add("ready"), 500);

  const toast = $("#toast"); let tt;
  const say = (t) => { toast.textContent = t; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2000); };

  // Ventajas
  $("#advTrack").innerHTML = S.features.map((f, i) => `
    <article class="feat feat--${f.tone} rv" style="--i:${i}">
      <b><span data-count="${f.big}">0</span><small>${f.unit}</small></b>
      <div><h3>${f.title}</h3><p>${f.text}</p></div>
    </article>`).join("");
  document.querySelectorAll(".arrow").forEach((b) => b.addEventListener("click", () => {
    const t = $("#advTrack"); t.scrollBy({ left: +b.dataset.dir * 356, behavior: reduce ? "auto" : "smooth" });
  }));

  // Productos
  const visual = (p, c) => p.shape === "tower" ? `<div class="tower-mini"></div>` : p.shape === "bar" ? `<div class="bar-mini"></div>`
    : `<div class="spk ${p.shape === "mini" ? "mini" : ""}"><div class="spk__body"></div><div class="spk__top"><i></i></div></div>`;
  const chosen = {};
  $("#grid").innerHTML = S.products.map((p, i) => {
    chosen[p.id] = p.colors[0];
    return `<article class="card rv" style="--i:${i}" data-id="${p.id}">
      <div class="pv" style="--c:${p.colors[0]}"><span class="chip">${p.tag}</span>${visual(p)}</div>
      <div class="card__body">
        <h3>${p.name}</h3><p>${p.desc}</p>
        <div class="swatches">${p.colors.map((c, k) => `<button style="--s:${c}" data-c="${c}" aria-label="Color de luz ${k + 1}" aria-pressed="${k === 0}"></button>`).join("")}</div>
        <div class="card__foot"><span class="price"><b>${soles(p.price)}</b>${p.old ? `<s>${soles(p.old)}</s>` : ""}</span><button class="add">Agregar</button></div>
      </div></article>`;
  }).join("");
  $("#grid").addEventListener("click", (e) => {
    const card = e.target.closest(".card"); if (!card) return;
    const sw = e.target.closest(".swatches button");
    if (sw) { card.querySelectorAll(".swatches button").forEach((b) => b.setAttribute("aria-pressed", b === sw)); card.querySelector(".pv").style.setProperty("--c", sw.dataset.c); chosen[card.dataset.id] = sw.dataset.c; }
    if (e.target.closest(".add")) add(card.dataset.id);
  });

  // Specs y opiniones
  $("#specList").innerHTML = S.specs.map((s, i) => `<li class="rv" style="--i:${i}"><span>${s.k}</span><b>${s.v}</b></li>`).join("");
  $("#revGrid").innerHTML = S.reviews.map((r, i) => `<article class="rev rv" style="--i:${i}"><span class="stars">★★★★★</span><p>“${r.text}”</p><footer><span class="av">${r.name[0]}</span>${r.name} · ${r.city}</footer></article>`).join("");
  $("#cities").textContent = S.cities;
  document.querySelectorAll(".js-wa").forEach((a) => a.href = wa(`Hola ${S.name}, tengo una consulta sobre ${a.textContent.toLowerCase()}.`));
  $("#news").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); say("¡Listo! Te avisaremos de las ofertas."); });

  // Carrito
  const cart = [];
  const colorName = { "#8cff5a": "verde", "#6ee7ff": "celeste", "#c48bff": "violeta", "#ffb14a": "ámbar", "#ff6a8b": "rosa" };
  function add(id) {
    const c = chosen[id], line = cart.find((l) => l.id === id && l.c === c);
    line ? line.q++ : cart.push({ id, c, q: 1 });
    render(); say(`${S.products.find((p) => p.id === id).name} agregado`);
    const b = $("#cartBtn"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
  }
  function render() {
    const n = cart.reduce((a, l) => a + l.q, 0), total = cart.reduce((a, l) => a + l.q * S.products.find((p) => p.id === l.id).price, 0);
    $("#cartCount").textContent = n;
    $("#items").innerHTML = cart.length ? cart.map((l, i) => { const p = S.products.find((x) => x.id === l.id); return `
      <div class="item" style="--c:${l.c}"><span class="dot"></span><div>${p.name}<small>Luz ${colorName[l.c] || ""} · ${soles(p.price)}</small></div>
      <div class="qty"><button data-i="${i}" data-d="-1" aria-label="Menos">−</button><span>${l.q}</span><button data-i="${i}" data-d="1" aria-label="Más">+</button></div></div>`; }).join("")
      : `<p class="empty">Tu carrito está vacío.</p>`;
    $("#total").textContent = soles(total);
    $("#cuotas").textContent = total ? `o 12 cuotas de ${soles(Math.ceil(total / 12))} sin intereses (ejemplo)` : "";
  }
  $("#items").addEventListener("click", (e) => { const b = e.target.closest("[data-i]"); if (!b) return; const l = cart[+b.dataset.i]; l.q += +b.dataset.d; if (l.q < 1) cart.splice(+b.dataset.i, 1); render(); });
  const open = (v) => document.body.classList.toggle("cart-open", v);
  $("#cartBtn").onclick = () => open(true); $("#closeCart").onclick = () => open(false); $("#scrim").onclick = () => open(false);
  addEventListener("keydown", (e) => e.key === "Escape" && open(false));
  $("#checkout").onclick = () => {
    if (!cart.length) return say("Agrega un parlante primero");
    const lines = cart.map((l) => { const p = S.products.find((x) => x.id === l.id); return `• ${l.q} x ${p.name} (luz ${colorName[l.c] || l.c}) – ${soles(p.price * l.q)}`; });
    const total = cart.reduce((a, l) => a + l.q * S.products.find((p) => p.id === l.id).price, 0);
    window.open(wa(`Hola ${S.name}, quiero hacer este pedido:\n${lines.join("\n")}\nTotal: ${soles(total)}\n¿Me confirman envío a mi dirección?`), "_blank");
  };
  render();

  // Reveal y contadores
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; e.target.classList.add("in"); io.unobserve(e.target);
    e.target.querySelectorAll("[data-count]").forEach(count);
  }), { threshold: .15 });
  document.querySelectorAll(".rv").forEach((el) => io.observe(el));
  function count(el) {
    const to = +el.dataset.count, t0 = performance.now(), dur = reduce ? 1 : 1000;
    const tick = (t) => { const k = Math.min(1, (t - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }
  let counted = false;

  // Parallax del mouse en portada
  const pair = $("#pair");
  if (!reduce && matchMedia("(pointer: fine)").matches) addEventListener("pointermove", (e) => {
    pair.style.setProperty("--mx", `${(e.clientX / innerWidth - .5) * 30}px`);
    pair.style.setProperty("--my", `${(e.clientY / innerHeight - .5) * 20}px`);
  });

  // Escena verde y lista de specs
  const glow = $("#glow"), specs = [...document.querySelectorAll(".spec-list li")];
  let tk = false;
  function onScroll() {
    tk = false;
    const r = glow.getBoundingClientRect(), g = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    glow.style.setProperty("--g", g.toFixed(3));
    if (g > .3 && !counted) { counted = true; count(glow.querySelector("[data-count]")); }
    const mid = innerHeight * .5;
    specs.forEach((li) => { const b = li.getBoundingClientRect(); li.classList.toggle("on", b.top < mid && b.bottom > mid - 60); });
  }
  addEventListener("scroll", () => { if (!tk) { tk = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
})();
