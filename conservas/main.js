(() => {
  const B = window.BRAND;
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const soles = (n) => "S/ " + (Number.isInteger(n) ? n : n.toFixed(2)).toLocaleString("es-PE");
  const wa = (msg) => `https://wa.me/${B.whatsapp}?text=${encodeURIComponent(msg)}`;
  const byId = (id) => B.products.find((p) => p.id === id);
  const jar = (p) => `<div class="jar" style="--f:${p.fill};--l:${p.label};--k:${p.ink}"><div class="jar__lid"></div><div class="jar__glass"><div class="jar__label"><small>${p.kind}</small><b>${p.name}</b></div></div></div>`;
  setTimeout(() => document.body.classList.add("ready"), 120);

  const toast = $("#toast"); let tt;
  const say = (t) => { toast.textContent = t; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2000); };

  // Frascos flotando en la portada
  const desk = [[5, 16, -14, 12, 30], [20, 60, 10, 10, 18], [74, 13, 12, 11, 26], [83, 55, -10, 12, 34], [38, 6, -6, 7.5, 12], [60, 68, 8, 9, 22], [1, 62, 6, 7.5, 14]];
  const mob = [[2, 12, -14, 7, 14], [64, 10, 12, 7.5, 18], [68, 70, -10, 8, 16], [4, 72, 8, 7.5, 12], [38, 84, -6, 5.5, 8]];
  function placeJars() {
    const pos = innerWidth < 760 ? mob : desk;
    $("#heroJars").innerHTML = pos.map(([x, y, r, w, d], i) => {
      const p = B.products[i % B.products.length];
      return `<button class="fj" data-id="${p.id}" aria-label="Ver ${p.kind} de ${p.name}" style="left:${x}%;top:${y}%;--d:${d};--r:${r}deg;--t:${5 + (i % 3)}s;--delay:-${i}s"><div class="in-wrap" style="--enter:${.15 + i * .07}s"><div style="font-size:0">${jar(p).replace('class="jar"', `class="jar" `).replace("--f:", `--w:${w}px;--f:`)}</div></div></button>`;
    }).join("");
  }
  placeJars();
  let lastMob = innerWidth < 760;
  addEventListener("resize", () => { const m = innerWidth < 760; if (m !== lastMob) { lastMob = m; placeJars(); } });
  if (!reduce && matchMedia("(pointer: fine)").matches) addEventListener("pointermove", (e) => {
    const h = $(".hero"); h.style.setProperty("--mx", ((e.clientX / innerWidth - .5) * 2).toFixed(3)); h.style.setProperty("--my", ((e.clientY / innerHeight - .5) * 2).toFixed(3));
  });
  $("#heroJars").addEventListener("click", (e) => { const b = e.target.closest(".fj"); if (b) openQuick(b.dataset.id); });

  // Vista rápida
  const quick = $("#quick"); let qId = null, lastFocus = null;
  function openQuick(id) {
    const p = byId(id); qId = id; lastFocus = document.activeElement;
    $("#qJar").innerHTML = jar(p); $("#qKind").textContent = `${p.kind} · ${p.type}`; $("#qName").textContent = p.name; $("#qDesc").textContent = p.desc; $("#qPrice").textContent = soles(p.price);
    quick.hidden = false; requestAnimationFrame(() => quick.classList.add("show")); $("#qAdd").focus();
  }
  function closeQuick() { quick.classList.remove("show"); setTimeout(() => quick.hidden = true, 200); lastFocus && lastFocus.focus(); }
  $("#qClose").onclick = closeQuick;
  quick.addEventListener("click", (e) => { if (e.target === quick) closeQuick(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !quick.hidden) closeQuick(); });
  $("#qAdd").onclick = () => { addToBox(qId); closeQuick(); };

  // Catálogo
  $("#grid").innerHTML = B.products.map((p, i) => `
    <article class="card rv" style="--i:${i % 4};--f:${p.fill}" data-type="${p.type}">
      <button class="card__jar" data-q="${p.id}" aria-label="Ver detalle de ${p.name}">${jar(p)}</button>
      <span class="tag ${p.type}">${p.kind} · ${p.type === "picante" ? "🌶 picante" : "dulce"}</span>
      <h3>${p.name}</h3>
      <div class="card__foot"><b>${soles(p.price)}</b><button class="plus" data-add="${p.id}" aria-label="Agregar ${p.name} a mi caja">+</button></div>
    </article>`).join("");
  $("#grid").addEventListener("click", (e) => {
    const q = e.target.closest("[data-q]"), a = e.target.closest("[data-add]");
    if (q) openQuick(q.dataset.q); if (a) addToBox(a.dataset.add);
  });
  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    $("#filters").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    document.querySelectorAll(".card").forEach((c) => c.classList.toggle("hide", b.dataset.f !== "todos" && c.dataset.type !== b.dataset.f));
  });

  // Caja de regalo
  let size = B.boxes[1], box = [];
  $("#sizes").innerHTML = B.boxes.map((b, i) => `<button aria-pressed="${b === size}" data-s="${i}">${b.label}<small>-${Math.round(b.off * 100)}%</small></button>`).join("");
  $("#sizes").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; size = B.boxes[+b.dataset.s]; $("#sizes").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b)); box = box.slice(0, size.size); renderBox(); });
  $("#picker").innerHTML = B.products.map((p) => `<button data-p="${p.id}" style="--f:${p.fill}"><i></i>${p.name}</button>`).join("");
  $("#picker").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) addToBox(b.dataset.p, true); });
  function addToBox(id, quiet) {
    if (box.length >= size.size) {
      const bigger = B.boxes.find((b) => b.size > box.length);
      if (bigger) { size = bigger; $("#sizes").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", B.boxes[+x.dataset.s] === size)); }
      else return say(`Tu caja de ${size.size} ya está llena`);
    }
    box.push(id); renderBox();
    if (!quiet) say(`${byId(id).name} agregado a tu caja`);
    const b = $("#boxBtn"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
  }
  function totals() { const sum = box.reduce((a, id) => a + byId(id).price, 0); return { sum, total: Math.round(sum * (1 - size.off) * 10) / 10 }; }
  function renderBox() {
    $("#boxCount").textContent = box.length;
    $("#crate").innerHTML = Array.from({ length: size.size }, (_, i) => box[i] ? `<div class="slot">${jar(byId(box[i]))}<button data-rm="${i}" aria-label="Quitar">✕</button></div>` : `<div class="slot"></div>`).join("");
    const { sum, total } = totals(), left = size.size - box.length;
    $("#crateTotal").textContent = soles(total);
    $("#crateOld").textContent = sum ? soles(sum) : "";
    $("#crateState").textContent = left ? `Faltan ${left} frasco${left > 1 ? "s" : ""} para completar tu ${size.label.toLowerCase()}` : `¡Caja completa! Ahorras ${soles(Math.round((sum - total) * 10) / 10)}`;
  }
  $("#crate").addEventListener("click", (e) => { const b = e.target.closest("[data-rm]"); if (b) { box.splice(+b.dataset.rm, 1); renderBox(); } });
  $("#clearBox").onclick = () => { box = []; renderBox(); };
  $("#boxBtn").onclick = () => $("#caja").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  $("#orderBox").onclick = () => {
    if (!box.length) return say("Agrega al menos un frasco");
    const count = {}; box.forEach((id) => count[id] = (count[id] || 0) + 1);
    const lines = Object.entries(count).map(([id, n]) => `• ${n} x ${byId(id).kind} de ${byId(id).name}`);
    const { total } = totals(), msg = $("#cardMsg").value.trim();
    window.open(wa(`Hola ${B.name}, quiero una ${size.label.toLowerCase()} de regalo:\n${lines.join("\n")}\nTotal con descuento: ${soles(total)}${msg ? `\nTarjeta: "${msg}"` : ""}\nEnvío a: `), "_blank");
  };
  renderBox();

  $("#stores").innerHTML = B.stores.map((s, i) => `<li class="rv" style="--i:${i}"><b>${s.city}</b><span>${s.place}</span></li>`).join("");
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
  const nav = $(".nav"); addEventListener("scroll", () => nav.classList.toggle("solid", scrollY > 30), { passive: true });
})();
