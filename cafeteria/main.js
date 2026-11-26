/* Raíz Café · interacciones y animaciones (sin librerías) */
(() => {
  const C = window.CAFE;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const soles = n => "S/ " + n.toFixed(2);
  const waLink = msg => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`;

  const ICONS = {
    cup: '<svg viewBox="0 0 40 40" fill="none" stroke="#2a1a12" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 16h20v6a10 10 0 0 1-20 0v-6Z"/><path d="M28 18h2a4 4 0 0 1 0 8h-3"/><path d="M14 6c-1 2 1 3 0 5M20 6c-1 2 1 3 0 5"/><path d="M6 35h26"/></svg>',
    glass: '<svg viewBox="0 0 40 40" fill="none" stroke="#2a1a12" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 9h18l-2 26H13L11 9Z"/><path d="M12 17h16"/><rect x="15" y="20" width="5" height="5" rx="1"/><rect x="21" y="24" width="5" height="5" rx="1"/><path d="M24 9l3-6"/></svg>',
    croissant: '<svg viewBox="0 0 40 40" fill="none" stroke="#2a1a12" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 26c2-9 9-15 15-15s13 6 15 15c-4 1-7-1-9-3-2 3-4 4-6 4s-4-1-6-4c-2 2-5 4-9 3Z"/><path d="M14 13l3 12M26 13l-3 12"/></svg>',
    cake: '<svg viewBox="0 0 40 40" fill="none" stroke="#2a1a12" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 33V20h26v13"/><path d="M7 25c3 2 5 2 8 0s5-2 8 0 5 2 8 0"/><path d="M20 20v-6"/><path d="M20 8c-1.5 1.5-1.5 3 0 4 1.5-1 1.5-2.5 0-4Z"/><path d="M4 33h32"/></svg>',
    plate: '<svg viewBox="0 0 40 40" fill="none" stroke="#2a1a12" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="22" r="13"/><circle cx="20" cy="22" r="7"/><path d="M4 6v8a3 3 0 0 0 3 3M4 6v8M36 6c-3 2-3 8 0 10v12"/></svg>',
    bag: '<svg viewBox="0 0 40 40" fill="none" stroke="#2a1a12" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10h20l2 25H8l2-25Z"/><path d="M10 10l3-5h14l3 5"/><ellipse cx="20" cy="22" rx="4" ry="6" transform="rotate(25 20 22)"/></svg>'
  };

  /* ---------- WhatsApp ---------- */
  function wireWa(root = document) {
    $$("[data-wa]", root).forEach(a => { a.href = waLink(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });
  }

  /* ---------- Carta con pestañas ---------- */
  const menu = $("#menu");
  const ink = $("#tabInk");
  function renderMenu(key) {
    menu.innerHTML = C.menu[key].map((it, i) => `
      <article class="item" style="--i:${i}">
        <div class="item__ico">${ICONS[it.icon] || ICONS.cup}</div>
        <div>
          <h3>${it.name}${it.tag ? `<span class="tag">${it.tag}</span>` : ""}</h3>
          <p>${it.desc}</p>
        </div>
        <div class="item__buy">
          <span class="item__price">${soles(it.price)}</span>
          <button class="add" data-id="${it.id}" aria-label="Agregar ${it.name}">+</button>
        </div>
      </article>`).join("");
    $$(".add", menu).forEach(b => b.addEventListener("click", e => {
      const it = C.menu[key].find(x => x.id === b.dataset.id);
      addLine({ key: it.id, name: it.name, detail: "", price: it.price });
      flyTo(e.currentTarget);
    }));
  }
  function moveInk(tab) {
    ink.style.width = tab.offsetWidth + "px";
    ink.style.transform = `translateX(${tab.offsetLeft}px)`;
  }
  $$(".tab").forEach(t => t.addEventListener("click", () => {
    $$(".tab").forEach(x => x.classList.toggle("is-active", x === t));
    moveInk(t);
    renderMenu(t.dataset.tab);
  }));
  renderMenu("calientes");
  requestAnimationFrame(() => moveInk($(".tab.is-active")));
  addEventListener("resize", () => moveInk($(".tab.is-active")));

  /* ---------- Arma tu bebida ---------- */
  const B = C.builder;
  const state = { base: B.bases[0], size: B.sizes[0], milk: B.milks[0], extras: new Set() };
  const glass = $("#glass");
  function pills(el, list, kind, multi) {
    el.innerHTML = list.map((o, i) => `<button class="pill ${!multi && i === 0 ? "is-on" : ""}" data-i="${i}">${o.name}${(o.add || 0) > 0 ? `<small>+S/ ${o.add}</small>` : ""}</button>`).join("");
    $$(".pill", el).forEach(p => p.addEventListener("click", () => {
      const o = list[+p.dataset.i];
      if (multi) {
        state.extras.has(o) ? state.extras.delete(o) : state.extras.add(o);
        p.classList.toggle("is-on");
      } else {
        state[kind] = o;
        $$(".pill", el).forEach(x => x.classList.toggle("is-on", x === p));
      }
      updateGlass(true);
    }));
  }
  pills($("#optBase"), B.bases, "base");
  pills($("#optSize"), B.sizes, "size");
  pills($("#optMilk"), B.milks, "milk");
  pills($("#optExtra"), B.extras, "extras", true);

  function drinkPrice() {
    let p = state.base.price + state.size.add + (state.base.layers.milk ? state.milk.add : 0);
    state.extras.forEach(e => p += e.add);
    return p;
  }
  function drinkName() {
    const parts = [state.base.name, state.size.name];
    if (state.base.layers.milk) parts.push(state.milk.name);
    state.extras.forEach(e => parts.push(e.name));
    return parts.join(" · ");
  }
  function updateGlass(pour) {
    const L = { ...state.base.layers };
    if ([...state.extras].some(e => e.id === "shot")) { L.coffee += 10; L.milk = Math.max(0, L.milk - 10); }
    $(".liq--choco", glass).style.setProperty("--h", L.choco + "%");
    $(".liq--coffee", glass).style.setProperty("--h", L.coffee + "%");
    $(".liq--milk", glass).style.setProperty("--h", L.milk + "%");
    $(".liq--foam", glass).style.setProperty("--h", L.foam + "%");
    glass.style.setProperty("--scale", state.size.scale);
    glass.classList.toggle("has-ice", [...state.extras].some(e => e.id === "hielo"));
    glass.classList.toggle("has-cara", [...state.extras].some(e => e.id === "cara"));
    glass.classList.toggle("alt-milk", state.milk.add > 0);
    if (pour && !reduce) { glass.classList.remove("pour"); void glass.offsetWidth; glass.classList.add("pour"); }
    animateNum($("#bPrice"), drinkPrice());
    $("#bName").textContent = drinkName();
    $("#bBtnPrice").textContent = soles(drinkPrice());
  }
  let shownPrice = drinkPrice();
  function animateNum(el, to) {
    const from = shownPrice; shownPrice = to;
    if (reduce) { el.textContent = soles(to); return; }
    const t0 = performance.now();
    const tick = now => {
      const k = Math.min(1, (now - t0) / 500), e = 1 - Math.pow(1 - k, 3);
      el.textContent = soles(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  updateGlass(false);
  $("#bAdd").addEventListener("click", e => {
    addLine({ key: "b-" + drinkName(), name: state.base.name + " a tu gusto", detail: drinkName(), price: drinkPrice() });
    flyTo(e.currentTarget);
  });

  /* ---------- Pedido ---------- */
  const bag = [];
  let mode = "recojo";
  function addLine(line) {
    const ex = bag.find(l => l.key === line.key);
    ex ? ex.qty++ : bag.push({ ...line, qty: 1 });
    renderBag();
    toast(`${line.name} agregado ✓`);
    const btn = $("#bagOpen");
    btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
  }
  function total() { return bag.reduce((s, l) => s + l.price * l.qty, 0) + (mode === "delivery" && bag.length ? 5 : 0); }
  function renderBag() {
    const n = bag.reduce((s, l) => s + l.qty, 0);
    const cnt = $("#bagCount");
    cnt.textContent = n; cnt.classList.toggle("has", n > 0);
    const body = $("#bagItems");
    if (!bag.length) {
      body.innerHTML = `<div class="empty">${ICONS.cup}<b>Tu pedido está vacío</b><span>Agrega algo de la carta o arma tu bebida.</span></div>`;
    } else {
      body.innerHTML = bag.map((l, i) => `
        <div class="line">
          <b>${l.name}</b><span class="line__price">${soles(l.price * l.qty)}</span>
          <small>${l.detail || soles(l.price) + " c/u"}</small>
          <div class="qty"><button data-i="${i}" data-d="-1" aria-label="Quitar uno">−</button><span>${l.qty}</span><button data-i="${i}" data-d="1" aria-label="Agregar uno">+</button></div>
        </div>`).join("");
      $$(".qty button", body).forEach(b => b.addEventListener("click", () => {
        const l = bag[+b.dataset.i];
        l.qty += +b.dataset.d;
        if (l.qty <= 0) bag.splice(+b.dataset.i, 1);
        renderBag();
      }));
    }
    $("#bagTotal").textContent = soles(total());
  }
  renderBag();
  const openBag = () => document.body.classList.add("bag-open", "is-locked");
  const closeBag = () => document.body.classList.remove("bag-open", "is-locked");
  $("#bagOpen").addEventListener("click", openBag);
  $("#bagClose").addEventListener("click", closeBag);
  $("#scrim").addEventListener("click", closeBag);
  addEventListener("keydown", e => e.key === "Escape" && closeBag());
  $$("#mode button").forEach(b => b.addEventListener("click", () => {
    mode = b.dataset.mode;
    $$("#mode button").forEach(x => x.classList.toggle("is-active", x === b));
    $("#addrField").hidden = mode !== "delivery";
    renderBag();
  }));
  $("#sendOrder").addEventListener("click", () => {
    if (!bag.length) { toast("Agrega al menos un producto"); return; }
    const name = $("#custName").value.trim();
    const lines = bag.map(l => `• ${l.qty} x ${l.name}${l.detail ? ` (${l.detail})` : ""}: ${soles(l.price * l.qty)}`);
    let msg = `Hola ${C.name}, quiero hacer un pedido:\n\n${lines.join("\n")}\n`;
    if (mode === "delivery") msg += `• Delivery: S/ 5.00\n`;
    msg += `\nTotal: ${soles(total())}\nModalidad: ${mode === "delivery" ? "Delivery" : "Recojo en tienda"}`;
    if (mode === "delivery" && $("#custAddr").value.trim()) msg += `\nDirección: ${$("#custAddr").value.trim()}`;
    if (name) msg += `\nNombre: ${name}`;
    open(waLink(msg), "_blank", "noopener");
  });

  /* Animación: punto que vuela hacia la bolsa */
  function flyTo(from) {
    if (reduce) return;
    const a = from.getBoundingClientRect(), b = $("#bagOpen").getBoundingClientRect();
    const dot = document.createElement("span");
    dot.style.cssText = `position:fixed;z-index:250;width:16px;height:16px;border-radius:50%;background:#c8743a;left:${a.left + a.width / 2 - 8}px;top:${a.top + a.height / 2 - 8}px;pointer-events:none`;
    document.body.appendChild(dot);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    dot.animate([
      { transform: "translate(0,0) scale(1)" },
      { transform: `translate(${dx * .5}px, ${dy - 120}px) scale(1.3)`, offset: .5 },
      { transform: `translate(${dx}px, ${dy}px) scale(.4)` }
    ], { duration: 750, easing: "cubic-bezier(.5,0,.5,1)" }).onfinish = () => dot.remove();
  }

  let tt;
  function toast(t) {
    const el = $("#toast");
    el.textContent = t; el.classList.add("is-on");
    clearTimeout(tt); tt = setTimeout(() => el.classList.remove("is-on"), 1800);
  }

  /* ---------- Reseñas ---------- */
  const revHtml = C.reviews.map(r => `<figure class="rev"><span class="stars">★★★★★</span><p>“${r[1]}”</p><b>${r[0]}</b></figure>`).join("");
  $("#reviews").innerHTML = revHtml + revHtml;

  /* ---------- Origen: pasos con scroll ---------- */
  const orb = $("#orb"), steps = $$(".step"), bar = $("#originBar");
  orb.dataset.s = 1;
  const sio = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    steps.forEach(s => s.classList.toggle("is-on", s === en.target));
    orb.dataset.s = en.target.dataset.step;
  }), { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach(s => sio.observe(s));

  /* ---------- Reveal y contadores ---------- */
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("is-in"); io.unobserve(en.target);
  }), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  const cio = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, to = +el.dataset.count, suf = el.dataset.suffix || "";
    const t0 = performance.now();
    const tick = now => {
      const k = Math.min(1, (now - t0) / 1600), e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(to * e).toLocaleString("en-US") + suf;
      if (k < 1) requestAnimationFrame(tick);
    };
    reduce ? (el.textContent = to.toLocaleString("en-US") + suf) : requestAnimationFrame(tick);
    cio.unobserve(el);
  }), { threshold: .6 });
  $$("[data-count]").forEach(el => cio.observe(el));

  /* ---------- Scroll: nav, barra de origen ---------- */
  const nav = $("#nav");
  let lastY = 0;
  function onScroll() {
    const y = scrollY;
    nav.classList.toggle("is-hidden", y > 300 && y > lastY && !nav.classList.contains("is-open"));
    lastY = y;
    const og = $("#origen").getBoundingClientRect();
    const k = Math.min(1, Math.max(0, -og.top / (og.height - innerHeight)));
    bar.style.width = k * 100 + "%";
  }
  addEventListener("scroll", onScroll, { passive: true });

  /* Menú móvil */
  $("#burger").addEventListener("click", () => nav.classList.toggle("is-open"));
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => nav.classList.remove("is-open")));

  /* ---------- Hero: parallax con el mouse ---------- */
  if (fine && !reduce) {
    const art = $("#heroArt");
    const beans = $$(".bean", art);
    addEventListener("pointermove", e => {
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      $(".cup", art).style.translate = `${x * -14}px ${y * -10}px`;
      beans.forEach((b, i) => b.style.translate = `${x * (20 + i * 12)}px ${y * (20 + i * 10)}px`);
    });
    $$(".magnetic").forEach(m => {
      m.addEventListener("pointermove", e => {
        const r = m.getBoundingClientRect();
        m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
      });
      m.addEventListener("pointerleave", () => m.style.transform = "");
    });
  }

  wireWa();
  const ready = () => setTimeout(() => document.body.classList.add("is-ready"), 450);
  document.readyState === "complete" ? ready() : addEventListener("load", ready);
})();
