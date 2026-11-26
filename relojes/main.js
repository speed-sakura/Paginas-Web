(() => {
  const S = window.STORE;
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const soles = (n) => "S/ " + n.toLocaleString("es-PE", { maximumFractionDigits: 2, minimumFractionDigits: n % 1 ? 2 : 0 });
  const wa = (msg) => `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(msg)}`;
  setTimeout(() => document.body.classList.add("ready"), 100);

  // Reloj con 4 pantallas
  const watchHTML = (screen) => `
    <div class="watch"><div class="watch__strap watch__strap--t"></div><div class="watch__strap watch__strap--b"></div>
      <div class="watch__case"><span class="watch__crown"></span><span class="watch__btn"></span><div class="watch__screen">
        <div class="face ${screen === "time" ? "on" : ""}" data-f="time"><span class="lbl js-date"></span><span class="clock js-clock">15:57</span><div class="row"><span>Huascarán</span><b>-2°</b></div><div class="meter"><i></i></div></div>
        <div class="face ${screen === "run" ? "on" : ""}" data-f="run"><span class="lbl">Trote · Costa Verde</span><span class="clock">12.4<small style="font-size:.35em"> km</small></span><div class="row"><span>Ritmo</span><b>5:12</b></div><div class="row"><span>Tiempo</span><b>1:04:46</b></div></div>
        <div class="face ${screen === "heart" ? "on" : ""}" data-f="heart"><span class="lbl">Ritmo cardiaco</span><span class="bpm">128 <small style="font-size:.3em">LPM</small></span><svg class="pulse" viewBox="0 0 200 60"><path d="M0 30h50l10-20 14 40 12-28 8 8h106" stroke="currentColor" stroke-width="4" fill="none" style="color:var(--accent)"/></svg><div class="row"><span>Zona 3</span><b>Aeróbica</b></div></div>
        <div class="face ${screen === "dive" ? "on" : ""}" data-f="dive"><span class="lbl">Buceo · Paracas</span><span class="clock">18.6<small style="font-size:.35em"> m</small></span><div class="row"><span>Agua</span><b>17°</b></div><div class="row"><span>Bajo el agua</span><b>24:10</b></div></div>
      </div></div></div>`;
  $("#heroWatch").innerHTML = watchHTML("time");
  $("#sceneWatch").innerHTML = watchHTML("time");
  $("#strapWatch").innerHTML = watchHTML("time");

  function clock() {
    const d = new Date(), t = d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Lima" });
    const date = d.toLocaleDateString("es-PE", { weekday: "short", day: "numeric", timeZone: "America/Lima" });
    document.querySelectorAll(".js-clock").forEach((el) => el.textContent = t);
    document.querySelectorAll(".js-date").forEach((el) => el.textContent = date);
  }
  clock(); setInterval(clock, 10000);

  // Escenas con scroll
  const scenes = $(".scenes"), sw = $("#sceneWatch"), bigNum = $("#bigNum");
  $("#dots").innerHTML = S.scenes.map(() => "<i></i>").join("");
  let cur = -1, shown = 0, anim;
  function setScene(i) {
    if (i === cur) return; cur = i; const s = S.scenes[i];
    document.documentElement.style.setProperty("--accent", s.accent);
    $("#bigUnit").textContent = s.unit;
    ["#sTitle", "#sText"].forEach((q) => { const el = $(q); el.classList.remove("swap"); void el.offsetWidth; el.classList.add("swap"); });
    $("#sTitle").textContent = s.title; $("#sText").textContent = s.text;
    sw.querySelectorAll(".face").forEach((f) => f.classList.toggle("on", f.dataset.f === s.screen));
    window.__scene3d = s; document.dispatchEvent(new CustomEvent("watchscene", { detail: s }));
    document.querySelectorAll(".dots i").forEach((d, k) => d.classList.toggle("on", k === i));
    cancelAnimationFrame(anim);
    const from = shown, to = s.num, t0 = performance.now(), dur = reduce ? 1 : 600;
    const tick = (t) => { const k = Math.min(1, (t - t0) / dur); shown = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); bigNum.textContent = shown.toLocaleString("es-PE"); if (k < 1) anim = requestAnimationFrame(tick); };
    anim = requestAnimationFrame(tick);
  }
  let tk = false;
  function onScroll() {
    tk = false;
    const r = scenes.getBoundingClientRect(), p = Math.min(.999, Math.max(0, -r.top / (r.height - innerHeight)));
    if (r.bottom >= innerHeight * .4) setScene(Math.floor(p * S.scenes.length));
    sw.style.setProperty("--sp", p.toFixed(3));
    if (r.top > innerHeight || r.bottom < innerHeight * .4) { document.documentElement.style.setProperty("--accent", S.scenes[0].accent); if (r.bottom < innerHeight * .4) cur = -1; }
    $(".hero__watch").style.setProperty("--hy", `${Math.min(scrollY * .25, 120)}px`);
  }
  addEventListener("scroll", () => { if (!tk) { tk = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // Correas
  let strap = S.straps[0];
  const sWatch = $("#strapWatch");
  $("#strapList").innerHTML = S.straps.map((s, i) => `<button class="rv" style="--i:${i + 2};--c:${s.color}" aria-pressed="${i === 0}" data-s="${s.id}"><i></i><span><b>${s.name}</b><span>${s.desc}</span></span></button>`).join("");
  function applyStrap() {
    sWatch.querySelectorAll(".watch__strap").forEach((el) => el.style.setProperty("--strap", strap.color));
    sWatch.style.setProperty("--s", strap.color);
    window.__strap3d = strap.color; document.dispatchEvent(new CustomEvent("strap3d", { detail: strap.color }));
  }
  $("#strapList").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    strap = S.straps.find((s) => s.id === b.dataset.s);
    $("#strapList").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    applyStrap();
  });
  applyStrap();

  // Modelos + cuotas
  let model = S.models[1], months = S.months[S.months.length - 1];
  $("#modelGrid").innerHTML = S.models.map((m, i) => `
    <article class="model rv" style="--i:${i}" data-m="${m.id}" aria-pressed="${m === model}">
      <span class="tag">${m.tag}</span><h3>${m.name}</h3><span class="price">${soles(m.price)}</span>
      <ul>${m.feats.map((f) => `<li>${f}</li>`).join("")}</ul>
      <button class="buy" data-buy="${m.id}">Pedir por WhatsApp</button>
    </article>`).join("");
  $("#months").innerHTML = S.months.map((n) => `<button aria-pressed="${n === months}" data-n="${n}">${n}</button>`).join("");
  function calc() { $("#calcOut").innerHTML = `${model.name}: <b>${months} x ${soles(Math.round(model.price / months * 100) / 100)}</b>`; }
  $("#modelGrid").addEventListener("click", (e) => {
    const card = e.target.closest(".model"); if (!card) return;
    model = S.models.find((m) => m.id === card.dataset.m);
    $("#modelGrid").querySelectorAll(".model").forEach((x) => x.setAttribute("aria-pressed", x === card)); calc();
    if (e.target.closest("[data-buy]")) window.open(wa(`Hola ${S.name}, quiero el ${model.name} (${soles(model.price)}) con correa ${strap.name}. ¿Puedo pagarlo en ${months} cuotas?`), "_blank");
  });
  $("#months").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; months = +b.dataset.n; $("#months").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b)); calc(); });
  calc();
  $("#cities").textContent = S.cities;
  $("#waFoot").href = wa(`Hola ${S.name}, tengo una consulta.`);

  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
  document.querySelectorAll(".rv").forEach((el) => io.observe(el));
})();
