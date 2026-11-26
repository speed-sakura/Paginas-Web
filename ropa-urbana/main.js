(() => {
  const S = window.SHOP;
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const soles = (n) => "S/ " + n.toLocaleString("es-PE");
  const wa = (msg) => `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(msg)}`;
  const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  requestAnimationFrame(() => setTimeout(() => document.body.classList.add("ready"), 100));

  // Prendas dibujadas en SVG (se recolorean con --b y --s)
  const shade = `<defs><linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".35" stop-color="#fff" stop-opacity=".08"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient></defs>`;
  function garment(type, colorKey, opts = {}) {
    const c = S.colors[colorKey], st = `style="--b:${c.body};--s:${c.stripe}"`;
    const B = "var(--b)", T = "var(--s)", D = "rgba(0,0,0,.28)";
    if (type === "jacket") {
      const back = opts.back;
      return `<svg class="garment" viewBox="0 0 300 320" ${st} aria-hidden="true">${shade}
        <path d="M68 72 18 232l34 14 44-122z" fill="${B}"/><path d="M232 72l50 160-34 14-44-122z" fill="${B}"/>
        <path d="M76 76 30 230" stroke="${T}" stroke-width="11"/><path d="M224 76l46 154" stroke="${T}" stroke-width="11"/>
        <path d="M76 76 30 230M224 76l46 154" stroke="${D}" stroke-width="2" transform="translate(7 2)"/>
        <path d="M16 228l36 14-6 18-36-14zM284 228l-36 14 6 18 36-14z" fill="${B}"/><path d="M16 228l36 14-6 18-36-14zM284 228l-36 14 6 18 36-14z" fill="${D}"/>
        <path d="M95 48h110l30 26-4 228H69l-4-228z" fill="${B}"/>
        <rect x="69" y="284" width="162" height="20" fill="${B}"/><rect x="69" y="284" width="162" height="20" fill="${D}"/>
        ${back ? `<text x="150" y="${opts.name && opts.name.length > 7 ? 128 : 134}" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="${opts.name && opts.name.length > 7 ? 26 : 38}" fill="${T}" class="jname">${esc(opts.name || "CALLE 64")}</text><text x="150" y="190" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="56" fill="none" stroke="${T}" stroke-width="2">64</text>`
               : `<path d="M150 64v220" stroke="#0006" stroke-width="3"/><path d="M150 64v220" stroke="#ccc" stroke-width="1" stroke-dasharray="2 3"/><text x="192" y="112" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="20" fill="${T}">64</text>`}
        <path d="M112 36h76l8 26-46 12-46-12z" fill="${B}"/><path d="M112 36h76l8 26-46 12-46-12z" fill="${D}"/>
        <path d="M65 74h170v230H65z" fill="url(#sh)" opacity=".9"/>
      </svg>`;
    }
    if (type === "hoodie") {
      return `<svg class="garment" viewBox="0 0 300 320" ${st} aria-hidden="true">${shade}
        <path d="M66 78 22 236l34 12 40-118z" fill="${B}"/><path d="M234 78l44 158-34 12-40-118z" fill="${B}"/>
        <path d="M20 232l36 12-5 18-36-12zM280 232l-36 12 5 18 36-12z" fill="${D}"/>
        <path d="M92 54h116l28 26-6 222H70l-6-222z" fill="${B}"/>
        <path d="M108 60c0-40 84-40 84 0l-10 24c-20 10-44 10-64 0z" fill="${B}"/><path d="M118 62c4-22 60-22 64 0-18 12-46 12-64 0z" fill="${D}"/>
        <path d="M140 84v40M160 84v40" stroke="${T}" stroke-width="3" stroke-linecap="round"/>
        <path d="M104 210h92l14 52H90z" fill="${D}"/>
        <rect x="70" y="282" width="160" height="20" fill="${D}"/>
        <text x="150" y="172" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="44" fill="${T}">64</text>
        <path d="M64 80h172v222H64z" fill="url(#sh)" opacity=".9"/>
      </svg>`;
    }
    if (type === "jogger") {
      return `<svg class="garment" viewBox="0 0 300 320" ${st} aria-hidden="true">${shade}
        <path d="M92 20h116l16 270h-56l-18-178-18 178H76z" fill="${B}"/>
        <rect x="92" y="20" width="116" height="22" fill="${D}"/>
        <path d="M96 44 82 284M204 44l14 240" stroke="${T}" stroke-width="7"/>
        <path d="M76 284h56v14H76zM168 284h56v14h-56z" fill="${D}"/>
        <path d="M150 42v70" stroke="${D}" stroke-width="2"/>
        <path d="M76 20h148v280H76z" fill="url(#sh)" opacity=".9"/>
      </svg>`;
    }
    return `<svg class="garment" viewBox="0 0 300 320" ${st} aria-hidden="true">${shade}
      <path d="M60 200c0-90 40-130 90-130s90 40 90 130z" fill="${B}"/>
      <path d="M150 70v130M105 84c-8 30-10 70-8 116M195 84c8 30 10 70 8 116" stroke="${D}" stroke-width="2" fill="none"/>
      <path d="M40 196c40-16 180-16 220 0l40 26c-40 16-120 20-170 10-50-6-110-18-90-36z" fill="${B}"/><path d="M40 196c40-16 180-16 220 0l40 26c-40 16-120 20-170 10-50-6-110-18-90-36z" fill="${D}"/>
      <circle cx="150" cy="70" r="7" fill="${T}"/>
      <text x="150" y="160" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="40" fill="${T}">64</text>
      <path d="M40 70h260v170H40z" fill="url(#sh)" opacity=".6"/>
    </svg>`;
  }

  // Portada
  $("#dropName").textContent = S.dropName;
  $("#trio").innerHTML = ["negro", "rojo", "hueso"].map((c) => `<div class="g">${garment("jacket", c)}</div>`).join("");
  const target = new Date(S.dropDate).getTime(), count = $("#count");
  function tick() {
    let d = Math.max(0, target - Date.now()) / 1000;
    const parts = [[Math.floor(d / 86400), "días"], [Math.floor(d % 86400 / 3600), "horas"], [Math.floor(d % 3600 / 60), "min"], [Math.floor(d % 60), "seg"]];
    count.innerHTML = d ? parts.map(([v, l]) => `<div><b>${String(v).padStart(2, "0")}</b><small>${l}</small></div>`).join("") : `<div><b>YA SALIÓ</b><small>disponible ahora</small></div>`;
  }
  tick(); setInterval(tick, 1000);

  // Texto cinético + nombre
  const rows = [...document.querySelectorAll(".krow")], input = $("#nameInput"), kJ = $("#kJacket");
  let myName = "";
  function setName() {
    myName = input.value.trim().toUpperCase().replace(/[^A-ZÑÁÉÍÓÚ0-9 ]/g, "");
    const word = myName || "CALLE 64";
    rows.forEach((r) => r.textContent = Array(8).fill(word).join(" · ") + " · ");
    if (!document.body.classList.contains("has3d")) kJ.innerHTML = garment("jacket", "rojo", { back: true, name: word });
    window.__name3d = word; document.dispatchEvent(new CustomEvent("name3d", { detail: word }));
  }
  input.addEventListener("input", setName); setName();
  $("#embPrice").textContent = `${soles(S.embroidery)} adicionales`;

  // Tienda
  const state = {};
  $("#grid").innerHTML = S.products.map((p, i) => {
    state[p.id] = { color: p.colors[0], size: p.sizes[Math.min(1, p.sizes.length - 1)] };
    return `<article class="card rv" style="--i:${i};--b:${S.colors[p.colors[0]].body}" data-id="${p.id}">
      <div class="card__img">${garment(p.type, p.colors[0])}</div>
      <div class="card__body">
        <div class="card__top"><h3>${p.name}</h3><span class="price">${soles(p.price)}</span></div>
        <div class="opts">${p.colors.map((c, k) => `<button class="dot" style="--c:${S.colors[c].body}" data-color="${c}" aria-label="${S.colors[c].name}" aria-pressed="${k === 0}"></button>`).join("")}</div>
        <span class="cname">${S.colors[p.colors[0]].name}</span>
        <div class="opts">${p.sizes.map((s) => `<button class="size" data-size="${s}" aria-pressed="${s === state[p.id].size}">${s}</button>`).join("")}</div>
        <button class="btn btn--red add">Agregar</button>
      </div></article>`;
  }).join("");
  $("#grid").addEventListener("click", (e) => {
    const card = e.target.closest(".card"); if (!card) return;
    const id = card.dataset.id, p = S.products.find((x) => x.id === id);
    const dot = e.target.closest(".dot"), size = e.target.closest(".size");
    if (dot) {
      state[id].color = dot.dataset.color;
      card.querySelectorAll(".dot").forEach((d) => d.setAttribute("aria-pressed", d === dot));
      const svg = card.querySelector(".garment"), col = S.colors[dot.dataset.color];
      svg.style.setProperty("--b", col.body); svg.style.setProperty("--s", col.stripe);
      card.style.setProperty("--b", col.body); card.querySelector(".cname").textContent = col.name;
    }
    if (size) { state[id].size = size.dataset.size; card.querySelectorAll(".size").forEach((s) => s.setAttribute("aria-pressed", s === size)); }
    if (e.target.closest(".add")) addToBag(p, state[id]);
  });

  // Lookbook
  $("#lookTrack").innerHTML = S.lookbook.map((l, i) => `<figure class="lk" style="--b:${S.colors[l.color].body}">${garment(l.type, l.color)}<figcaption><span>${String(i + 1).padStart(2, "0")}</span><span>${l.caption}</span></figcaption></figure>`).join("");

  // Bolsa
  const bag = [];
  const toast = $("#toast"); let tt;
  const say = (t) => { toast.textContent = t; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2000); };
  function addToBag(p, st) {
    const emb = p.type === "jacket" && myName ? myName : "";
    bag.push({ p, color: st.color, size: st.size, emb });
    renderBag(); say(`${p.name} agregada${emb ? ` con "${emb}"` : ""}`);
    const b = $("#bagBtn"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
  }
  const lineTotal = (l) => l.p.price + (l.emb ? S.embroidery : 0);
  function renderBag() {
    $("#bagCount").textContent = bag.length;
    $("#bagItems").innerHTML = bag.length ? bag.map((l, i) => `<div class="line"><div>${garment(l.p.type, l.color)}</div>
      <div>${l.p.name}<small>${S.colors[l.color].name} · Talla ${l.size}${l.emb ? ` · Bordado "${esc(l.emb)}"` : ""}</small><button data-rm="${i}">Quitar</button></div><b>${soles(lineTotal(l))}</b></div>`).join("")
      : `<p class="empty">Tu bolsa está vacía.</p>`;
    $("#bagTotal").textContent = soles(bag.reduce((a, l) => a + lineTotal(l), 0));
  }
  $("#bagItems").addEventListener("click", (e) => { const b = e.target.closest("[data-rm]"); if (b) { bag.splice(+b.dataset.rm, 1); renderBag(); } });
  const open = (v) => document.body.classList.toggle("bag-open", v);
  $("#bagBtn").onclick = () => open(true); $("#closeBag").onclick = () => open(false); $("#scrim").onclick = () => open(false);
  addEventListener("keydown", (e) => e.key === "Escape" && open(false));
  $("#checkout").onclick = () => {
    if (!bag.length) return say("Tu bolsa está vacía");
    const lines = bag.map((l) => `• ${l.p.name} – ${S.colors[l.color].name}, talla ${l.size}${l.emb ? `, bordado "${l.emb}"` : ""} – ${soles(lineTotal(l))}`);
    window.open(wa(`Hola ${S.name}, quiero este pedido:\n${lines.join("\n")}\nTotal: ${soles(bag.reduce((a, l) => a + lineTotal(l), 0))}\nEnvío a: `), "_blank");
  };
  $("#waFoot").href = wa(`Hola ${S.name}, tengo una consulta.`);
  renderBag();

  // Reveal
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
  document.querySelectorAll(".rv").forEach((el) => io.observe(el));

  // Scroll: filas de texto, casaca, lookbook horizontal
  const kin = $("#nombre"), look = $("#look"), track = $("#lookTrack");
  let tk = false;
  function onScroll() {
    tk = false;
    if (reduce) return;
    const r = kin.getBoundingClientRect(), k = (innerHeight - r.top) / (innerHeight + r.height);
    if (k > -0.1 && k < 1.1) {
      rows.forEach((row, i) => row.style.setProperty("--x", `${(row.dataset.dir === "1" ? -1 : 1) * k * 500 - (row.dataset.dir === "1" ? 100 : 700)}px`));
      kin.style.setProperty("--k", k.toFixed(3));
    }
    const lr = look.getBoundingClientRect(), lp = Math.min(1, Math.max(0, -lr.top / (lr.height - innerHeight)));
    const max = track.scrollWidth - innerWidth + 32;
    track.style.setProperty("--lx", `${-lp * Math.max(0, max)}px`);
  }
  addEventListener("scroll", () => { if (!tk) { tk = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();
})();
