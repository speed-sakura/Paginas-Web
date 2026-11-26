(() => {
  const C = window.BAR;
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wa = (msg) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`;

  // Telón
  requestAnimationFrame(() => setTimeout(() => document.body.classList.add("ready"), 250));

  // Datos del cliente
  $("#addr").textContent = `${C.address} · ${C.hours}`;
  $("#footAddr").textContent = C.address;
  $("#footHours").textContent = C.hours;
  $("#waFloat").href = wa(`Hola ${C.name}, quisiera hacer una consulta.`);

  const toast = document.createElement("div");
  toast.className = "toast"; document.body.append(toast);
  let tt; const say = (t) => { toast.textContent = t; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2200); };

  // Reveal
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
  const watch = () => document.querySelectorAll(".rv:not(.in)").forEach((el) => io.observe(el));

  // Carta
  const tabs = $("#tabs"), drinks = $("#drinks");
  const cats = Object.keys(C.menu);
  const pedido = [];
  function showCat(cat) {
    tabs.querySelectorAll("button").forEach((b) => b.setAttribute("aria-selected", b.dataset.cat === cat));
    drinks.innerHTML = C.menu[cat].map((d, i) => `
      <article class="drink" style="--i:${i}">
        <h3>${d.name}</h3><span class="price">S/ ${d.price}</span>
        <p>${d.desc}</p>
        <button class="add" data-name="${d.name}">+ Pedir en la reserva</button>
      </article>`).join("");
  }
  tabs.innerHTML = cats.map((c) => `<button role="tab" data-cat="${c}">${c}</button>`).join("");
  tabs.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) showCat(b.dataset.cat); });
  drinks.addEventListener("click", (e) => {
    const b = e.target.closest(".add"); if (!b) return;
    pedido.push(b.dataset.name); say(`${b.dataset.name} agregado a tu reserva`);
  });
  showCat(cats[0]);

  // Agenda
  $("#agendaList").innerHTML = C.agenda.map((a, i) => `<li class="rv" style="--i:${i}"><span class="d">${a.day}</span><span class="t">${a.title}</span><span class="x">${a.detail}</span></li>`).join("");

  // Reserva
  let people = 2, zone = C.zones[0];
  const zones = $("#zones");
  zones.innerHTML = C.zones.map((z, i) => `<button type="button" aria-pressed="${i === 0}">${z}</button>`).join("");
  zones.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; zones.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b)); zone = b.textContent; });
  document.querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => { people = Math.min(20, Math.max(1, people + +b.dataset.step)); $("#people").textContent = people; }));
  const date = $('input[name="fecha"]'); const today = new Date(); date.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`; date.value = date.min;
  $("#bookForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    let msg = `Hola ${C.name}, quiero reservar:\n• Nombre: ${f.get("nombre")}\n• Fecha: ${f.get("fecha")} a las ${f.get("hora")}\n• Personas: ${people}\n• Zona: ${zone}`;
    if (f.get("ocasion")) msg += `\n• Ocasión: ${f.get("ocasion")}`;
    if (pedido.length) msg += `\n• Quiero que me esperen con: ${pedido.join(", ")}`;
    window.open(wa(msg), "_blank");
  });

  // Contadores
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, dec = +(el.dataset.dec || 0), t0 = performance.now(), dur = reduce ? 1 : 1100;
    const tick = (t) => { const k = Math.min(1, (t - t0) / dur), v = to * (1 - Math.pow(1 - k, 3)); el.textContent = v.toFixed(dec); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .5 });
  document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));

  // Scroll: nav, escena del cóctel, columnas, figura
  const nav = $(".nav"), pour = $("#pour"), steps = [...document.querySelectorAll(".steps li")], house = $(".house"), hero = $(".hero");
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    nav.classList.toggle("solid", y > 40);
    hero.style.setProperty("--fy", `${Math.min(y * .12, 60)}px`);

    const r = pour.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / (r.height - vh)));
    const tilt = Math.min(1, p / .25) * -38;
    pour.style.setProperty("--p", Math.min(1, p / .25).toFixed(3));
    pour.style.setProperty("--tilt", tilt.toFixed(2));
    pour.style.setProperty("--stream", p > .2 && p < .62 ? 1 : 0);
    pour.style.setProperty("--fill", Math.min(1, Math.max(0, (p - .2) / .42)).toFixed(3));
    pour.style.setProperty("--foam", Math.min(1, Math.max(0, (p - .62) / .15)).toFixed(3));
    pour.classList.toggle("bitters", p > .82);
    const idx = p < .2 ? 0 : p < .45 ? 1 : p < .7 ? 2 : 3;
    steps.forEach((s, i) => s.classList.toggle("on", i === idx));

    const h = house.getBoundingClientRect();
    const open = Math.min(1, Math.max(0, (vh - h.top) / (vh + h.height * .4)));
    house.style.setProperty("--open", open.toFixed(3));
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll(); watch();
})();
