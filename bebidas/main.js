(() => {
  const B = window.BRAND;
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const soles = (n) => "S/ " + n.toLocaleString("es-PE");
  const wa = (msg) => `https://wa.me/${B.whatsapp}?text=${encodeURIComponent(msg)}`;
  const can = (f) => `<div class="can" style="--c:${f.can}"><div class="can__top"></div><div class="can__body"><span class="can__dot"></span><span class="can__brand">${B.name.toUpperCase()}</span><span class="can__flavor">${f.name}</span></div></div>`;
  setTimeout(() => document.body.classList.add("ready"), 120);
  const toast = $("#toast"); let tt;
  const say = (t) => { toast.textContent = t; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2000); };

  // Carrusel 3D de latas (gira solo y se arrastra)
  const N = 8, car = $("#carousel");
  car.innerHTML = Array.from({ length: N }, (_, i) => `<div class="slot" style="--a:${i * 360 / N}deg;--d:${.1 + i * .06}s">${can(B.flavors[i % B.flavors.length])}</div>`).join("");
  let ry = 0, vel = reduce ? 0 : .12, dragging = false, lastX = 0;
  const stage = $("#stage");
  stage.addEventListener("pointerdown", (e) => { dragging = true; lastX = e.clientX; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener("pointermove", (e) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; ry += dx * .3; vel = dx * .3; });
  const end = () => { dragging = false; };
  stage.addEventListener("pointerup", end); stage.addEventListener("pointercancel", end);
  let heroVisible = true;
  new IntersectionObserver(([e]) => heroVisible = e.isIntersecting).observe($(".hero"));
  (function loop() {
    if (heroVisible && !dragging) { vel += ((reduce ? 0 : .12) - vel) * .03; ry += vel; }
    car.style.setProperty("--ry", `${ry}deg`);
    requestAnimationFrame(loop);
  })();

  // Sabores con scroll
  const fl = $(".flavors"), sticky = $("#fSticky"), fCan = $("#fCan"), info = $(".finfo"), word = $("#fWord");
  $("#fNav").innerHTML = B.flavors.map((f, i) => `<button data-i="${i}" style="--c:${f.can}" aria-label="${f.name}"><i></i><span>${f.name}</span></button>`).join("");
  let cur = -1;
  function setFlavor(i) {
    if (i === cur) return; cur = i; const f = B.flavors[i];
    sticky.style.setProperty("--fbg", f.bg);
    fCan.innerHTML = can(f);
    fCan.classList.remove("spin"); void fCan.offsetWidth; fCan.classList.add("spin");
    word.textContent = f.word; word.classList.remove("swap"); void word.offsetWidth; word.classList.add("swap");
    $("#fNum").textContent = `${String(i + 1).padStart(2, "0")} / ${String(B.flavors.length).padStart(2, "0")}`;
    $("#fName").textContent = f.name; $("#fNotes").textContent = f.notes; $("#fKcal").textContent = `${f.kcal} kcal por lata`;
    info.classList.remove("swap"); void info.offsetWidth; info.classList.add("swap");
    document.querySelectorAll("#fNav button").forEach((b, k) => b.setAttribute("aria-current", k === i));
  }
  $("#fNav").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    const top = fl.offsetTop + (+b.dataset.i + .5) / B.flavors.length * (fl.offsetHeight - innerHeight);
    scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  });
  let tk = false;
  function onScroll() {
    tk = false;
    const r = fl.getBoundingClientRect(), p = Math.min(.999, Math.max(0, -r.top / (r.height - innerHeight)));
    setFlavor(Math.floor(p * B.flavors.length));
  }
  const nav = $(".nav"); addEventListener("scroll", () => nav.classList.toggle("solid", scrollY > 40), { passive: true });
  addEventListener("scroll", () => { if (!tk) { tk = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // Arma tu pack
  let pack = B.packs[1];
  const qty = Object.fromEntries(B.flavors.map((f) => [f.id, 0]));
  qty[B.flavors[0].id] = 3; qty[B.flavors[1].id] = 3; qty[B.flavors[2].id] = 3; qty[B.flavors[3].id] = 3;
  $("#delivery").textContent = B.delivery;
  $("#sizes").innerHTML = B.packs.map((p, i) => `<button aria-pressed="${p === pack}" data-p="${i}"><b>${p.size} latas</b><span>${soles(p.price)} · ${soles(Math.round(p.price / p.size * 100) / 100)} c/u</span></button>`).join("");
  $("#mix").innerHTML = B.flavors.map((f, i) => `<div class="mix__row rv" style="--i:${i + 3};--c:${f.can}"><i></i><b>${f.name}</b><div class="step"><button data-f="${f.id}" data-d="-1" aria-label="Quitar ${f.name}">−</button><output id="q-${f.id}">0</output><button data-f="${f.id}" data-d="1" aria-label="Agregar ${f.name}">+</button></div></div>`).join("");
  const total = () => Object.values(qty).reduce((a, b) => a + b, 0);
  $("#sizes").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return; pack = B.packs[+b.dataset.p];
    $("#sizes").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    // recorta si sobran latas
    let over = total() - pack.size;
    for (const f of [...B.flavors].reverse()) { while (over > 0 && qty[f.id] > 0) { qty[f.id]--; over--; } }
    render();
  });
  $("#mix").addEventListener("click", (e) => {
    const b = e.target.closest("[data-f]"); if (!b) return; const d = +b.dataset.d;
    if (d > 0 && total() >= pack.size) return say(`Tu pack de ${pack.size} ya está completo`);
    qty[b.dataset.f] = Math.max(0, qty[b.dataset.f] + d); render();
  });
  function render() {
    B.flavors.forEach((f) => $(`#q-${f.id}`).textContent = qty[f.id]);
    const list = B.flavors.flatMap((f) => Array(qty[f.id]).fill(f));
    $("#tray").innerHTML = Array.from({ length: pack.size }, (_, i) => `<div class="tslot">${list[i] ? can(list[i]) : ""}</div>`).join("");
    const left = pack.size - total();
    $("#trayState").textContent = left ? `Faltan ${left} lata${left > 1 ? "s" : ""}` : "¡Pack completo!";
    $("#trayPrice").textContent = soles(pack.price);
  }
  $("#orderPack").onclick = () => {
    const left = pack.size - total();
    if (left) return say(`Elige ${left} lata${left > 1 ? "s" : ""} más`);
    const lines = B.flavors.filter((f) => qty[f.id]).map((f) => `• ${qty[f.id]} x ${f.name}`);
    window.open(wa(`Hola ${B.name}, quiero un pack de ${pack.size} latas (${soles(pack.price)}):\n${lines.join("\n")}\nEntrega en: `), "_blank");
  };
  render();

  // Distribuidores
  $("#distForm").addEventListener("submit", (e) => {
    e.preventDefault(); const f = new FormData(e.target);
    window.open(wa(`Hola ${B.name}, quiero ser distribuidor:\n• Negocio: ${f.get("negocio")} (${f.get("tipo")})\n• Ciudad: ${f.get("ciudad")}\n• Cajas al mes: ${f.get("cajas")}`), "_blank");
  });
  $("#waFoot").href = wa(`Hola ${B.name}, tengo una consulta.`);

  // Reveal y contadores
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; e.target.classList.add("in"); io.unobserve(e.target);
    e.target.querySelectorAll("[data-count]").forEach((el) => {
      const to = +el.dataset.count, t0 = performance.now(), dur = reduce ? 1 : 1000;
      const tick = (t) => { const k = Math.min(1, (t - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
  }), { threshold: .15 });
  document.querySelectorAll(".rv").forEach((el) => io.observe(el));
})();
