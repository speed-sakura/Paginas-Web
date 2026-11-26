(function () {
  "use strict";
  var S = window.STORE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var soles = function (n) { return "S/ " + Math.round(n).toLocaleString("en-US"); };
  var cuota = function (n) { return soles(Math.ceil(n / S.installments)); };
  var byId = {};
  S.products.forEach(function (p) { byId[p.id] = p; });

  $$("[data-store-name]").forEach(function (el, i) { el.textContent = i === 0 ? S.name.split(" ")[0] : S.name; });

  /* Refracción líquida: solo Chrome/Edge la dibujan bien */
  var chromium = !!(navigator.userAgentData && navigator.userAgentData.brands);
  if (chromium) document.documentElement.classList.add("has-refract", "has-lens");

  /* ---------- Laptop dibujada ---------- */
  function lapHTML(p, colorIdx, ui) {
    var c = p.colors[colorIdx || 0][1];
    return '<div class="lap" style="--c:' + c + ';--s1:' + p.screen[0] + ';--s2:' + p.screen[1] + ';--s3:' + p.screen[2] + '">' +
      '<div class="lap__lid"><div class="lap__screen">' +
      (ui ? '<div class="lap__ui"><span class="ui-win w1"></span><span class="ui-win w2"></span><span class="ui-dock"></span></div>' : "") +
      '</div></div><div class="lap__base"></div></div>';
  }

  /* ---------- Catálogo ---------- */
  var grid = $("[data-grid]");
  grid.innerHTML = S.products.map(function (p, i) {
    var hot = p.badge && /oferta/i.test(p.badge);
    return '<article class="card glass rv" style="--i:' + (i % 4) + ';--s1:' + p.screen[0] + '" data-id="' + p.id + '" data-cats="' + p.cats.join(" ") + '">' +
      '<button class="card__vis" type="button" data-view="' + p.id + '" aria-label="Ver detalles de ' + p.name + '">' +
      (p.badge ? '<span class="badge' + (hot ? " badge--hot" : "") + '">' + p.badge + "</span>" : "") +
      lapHTML(p, 0, true) + "</button>" +
      '<div class="card__body">' +
      '<span class="card__brand">' + p.brand + "</span>" +
      "<h3>" + p.name + "</h3>" +
      '<span class="card__mem">' + p.mem + "</span>" +
      '<div class="swatches" aria-label="Colores">' + p.colors.map(function (c) { return '<i style="--c:' + c[1] + '" title="' + c[0] + '"></i>'; }).join("") + "</div>" +
      '<div class="specs">' + p.specs.map(function (s) { return "<span>" + s + "</span>"; }).join("") + "</div>" +
      '<div class="price"><div><span class="price__now">' + soles(p.price) + (p.oldPrice ? '<span class="price__old">' + soles(p.oldPrice) + "</span>" : "") + "</span>" +
      '<span class="price__cuota">o ' + S.installments + " cuotas de " + cuota(p.price) + "</span></div>" +
      '<button class="add" type="button" data-add="' + p.id + '" aria-label="Agregar ' + p.name + ' al carrito">+</button></div>' +
      "</div></article>";
  }).join("");

  /* Filtros */
  var filters = $("[data-filters]");
  var cats = [["todas", "Todas"]].concat(Object.keys(S.categories).map(function (k) { return [k, S.categories[k]]; }));
  filters.insertAdjacentHTML("beforeend", cats.map(function (c, i) {
    return '<button type="button" role="tab" data-cat="' + c[0] + '" aria-selected="' + (i === 0) + '">' + c[1] + "</button>";
  }).join(""));
  filters.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cat]");
    if (!b || b.getAttribute("aria-selected") === "true") return;
    $$("[data-cat]", filters).forEach(function (x) { x.setAttribute("aria-selected", String(x === b)); });
    var cat = b.dataset.cat, k = 0;
    $$(".card", grid).forEach(function (card) {
      var show = cat === "todas" || card.dataset.cats.split(" ").indexOf(cat) > -1;
      card.classList.toggle("hide", !show);
      card.classList.remove("pop");
      if (show) {
        card.classList.add("on");
        card.style.setProperty("--k", k++);
        void card.offsetWidth;
        if (!reduce) card.classList.add("pop");
      }
    });
    b.scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" });
  });

  /* ---------- Carrito ---------- */
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem("kallpa-cart") || "[]").filter(function (l) { return byId[l.id]; }); } catch (e) { cart = []; }
  function save() { try { localStorage.setItem("kallpa-cart", JSON.stringify(cart)); } catch (e) {} }
  function lineUnit(l) {
    return byId[l.id].price + (l.extras || []).reduce(function (s, x) {
      var ex = S.extras.filter(function (e) { return e.id === x; })[0];
      return s + (ex ? ex.price : 0);
    }, 0);
  }
  function total() { return cart.reduce(function (s, l) { return s + lineUnit(l) * l.qty; }, 0); }
  function count() { return cart.reduce(function (s, l) { return s + l.qty; }, 0); }

  function addToCart(id, colorIdx, extras) {
    colorIdx = colorIdx || 0; extras = extras || [];
    var key = id + "|" + colorIdx + "|" + extras.slice().sort().join(",");
    var found = cart.filter(function (l) { return l.key === key; })[0];
    if (found) found.qty++;
    else cart.push({ key: key, id: id, color: colorIdx, extras: extras, qty: 1 });
    save(); renderCart(true);
    toast("✓ " + byId[id].name + " en tu pedido");
  }

  var itemsEl = $("[data-cart-items]");
  function renderCart(bump) {
    var n = count();
    $$("[data-cart-count]").forEach(function (el) {
      el.textContent = n;
      el.classList.toggle("has", n > 0);
      if (bump && !reduce) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    });
    if (!cart.length) {
      itemsEl.innerHTML = '<div class="empty"><b>Tu pedido está vacío</b>Agrega una laptop desde el catálogo.</div>';
    } else {
      itemsEl.innerHTML = cart.map(function (l, i) {
        var p = byId[l.id];
        var ex = (l.extras || []).map(function (x) { return S.extras.filter(function (e) { return e.id === x; })[0]; }).filter(Boolean);
        return '<div class="line">' + lapHTML(p, l.color) +
          "<div><b>" + p.name + "</b><small>" + p.mem + " · " + p.colors[l.color][0] + "</small>" +
          (ex.length ? "<small>+ " + ex.map(function (e) { return e.name; }).join(", ") + "</small>" : "") +
          '<div class="qty"><button type="button" data-dec="' + i + '" aria-label="Quitar uno">−</button><span>' + l.qty + '</span><button type="button" data-inc="' + i + '" aria-label="Agregar uno">+</button></div></div>' +
          '<span class="line__price">' + soles(lineUnit(l) * l.qty) + "</span></div>";
      }).join("");
    }
    var t = total();
    $("[data-cart-total]").textContent = soles(t);
    $("[data-cart-cuotas]").textContent = t ? "o " + S.installments + " cuotas sin intereses de " + cuota(t) : "";
  }
  itemsEl.addEventListener("click", function (e) {
    var inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]");
    if (inc) cart[+inc.dataset.inc].qty++;
    else if (dec) { var i = +dec.dataset.dec; cart[i].qty--; if (cart[i].qty < 1) cart.splice(i, 1); }
    else return;
    save(); renderCart();
  });

  /* ---------- Abrir / cerrar paneles ---------- */
  var lastFocus = null;
  function openLayer(el, focusSel) {
    lastFocus = document.activeElement;
    el.hidden = false;
    el.classList.remove("closing");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add("open"); }); });
    var f = $(focusSel, el); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 60);
  }
  function closeLayer(el) {
    if (el.hidden) return;
    el.classList.add("closing");
    el.classList.remove("open");
    setTimeout(function () { el.hidden = true; el.classList.remove("closing"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus({ preventScroll: true }); }, reduce ? 0 : 190);
  }
  var drawer = $("[data-drawer]"), sheet = $("[data-sheet]");
  $$("[data-open-cart]").forEach(function (b) { b.addEventListener("click", function () { closeLayer(sheet); renderCart(); openLayer(drawer, ".x"); }); });
  $$("[data-close-cart]").forEach(function (b) { b.addEventListener("click", function () { closeLayer(drawer); }); });
  sheet.addEventListener("click", function (e) { if (e.target.closest("[data-close-sheet]")) closeLayer(sheet); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeLayer(sheet); closeLayer(drawer); } });

  /* ---------- Detalle de laptop ---------- */
  var panel = $("[data-sheet-panel]");
  function openDetail(id) {
    var p = byId[id], color = 0;
    panel.innerHTML =
      '<button class="x" type="button" data-close-sheet aria-label="Cerrar">✕</button>' +
      '<div class="detail" style="--s1:' + p.screen[0] + '">' +
      '<div class="detail__vis" data-dvis>' + lapHTML(p, 0, true) + "</div>" +
      "<div>" +
      '<span class="card__brand">' + p.brand + "</span>" +
      '<h2 id="sheetTitle">' + p.name + "</h2>" +
      '<span class="card__mem">' + p.mem + "</span>" +
      "<ul>" + p.detail.map(function (d) { return "<li>" + d + "</li>"; }).join("") + "</ul>" +
      (p.colors.length > 1 ? '<p class="label">Color</p><div class="colors">' + p.colors.map(function (c, i) {
        return '<button type="button" data-color="' + i + '" aria-pressed="' + (i === 0) + '"><i style="--c:' + c[1] + '"></i>' + c[0] + "</button>";
      }).join("") + "</div>" : '<p class="label">Color: ' + p.colors[0][0] + "</p>") +
      '<p class="label">Agrega a tu compra</p><div class="extras">' + S.extras.map(function (x) {
        return '<label><input type="checkbox" value="' + x.id + '"><span>' + x.name + "</span><em>+ " + soles(x.price) + "</em></label>";
      }).join("") + "</div>" +
      "</div></div>" +
      '<div class="detail__buy"><div><b data-dtotal></b><small data-dcuota></small></div><button class="btn btn--dark" type="button" data-dadd>Agregar al pedido</button></div>';

    function update() {
      var ex = $$(".extras input:checked", panel).map(function (i) { return i.value; });
      var t = p.price + ex.reduce(function (s, x) { return s + S.extras.filter(function (e) { return e.id === x; })[0].price; }, 0);
      $("[data-dtotal]", panel).textContent = soles(t);
      $("[data-dcuota]", panel).textContent = "o " + S.installments + " cuotas de " + cuota(t) + " sin intereses";
      return ex;
    }
    update();
    panel.onchange = update;
    panel.onclick = function (e) {
      var cb = e.target.closest("[data-color]");
      if (cb) {
        color = +cb.dataset.color;
        $$("[data-color]", panel).forEach(function (b) { b.setAttribute("aria-pressed", String(b === cb)); });
        $("[data-dvis] .lap", panel).style.setProperty("--c", p.colors[color][1]);
      }
      if (e.target.closest("[data-dadd]")) { addToCart(p.id, color, update()); closeLayer(sheet); }
    };
    panel.scrollTop = 0;
    openLayer(sheet, ".x");
  }

  document.addEventListener("click", function (e) {
    var v = e.target.closest("[data-view]"), a = e.target.closest("[data-add]");
    if (v) openDetail(v.dataset.view);
    if (a) addToCart(a.dataset.add);
  });

  /* ---------- Pedido por WhatsApp ---------- */
  function wa(text) { return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(text); }
  $$("[data-wa]").forEach(function (a) { a.href = wa(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });
  $("[data-order]").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!cart.length) { toast("Agrega una laptop primero"); return; }
    var f = new FormData(e.target);
    var lines = cart.map(function (l) {
      var p = byId[l.id];
      var ex = (l.extras || []).map(function (x) { return S.extras.filter(function (z) { return z.id === x; })[0].name; });
      return "• " + l.qty + " × " + p.brand + " " + p.name + " (" + p.mem + ", " + p.colors[l.color][0] + ")" +
        (ex.length ? "\n   + " + ex.join("\n   + ") : "") + "\n   " + soles(lineUnit(l) * l.qty);
    });
    var msg = "Hola " + S.name + ", quiero hacer este pedido:\n\n" + lines.join("\n") +
      "\n\nTotal: " + soles(total()) +
      "\nNombre: " + f.get("nombre") + "\nCiudad: " + f.get("ciudad") +
      "\nEntrega: " + f.get("entrega") + "\nPago: " + f.get("pago");
    window.open(wa(msg), "_blank", "noopener");
  });

  /* ---------- Asesor ---------- */
  var usesEl = $("[data-uses]");
  var useMap = [["estudios", "📚 Estudios"], ["trabajo", "💼 Trabajo"], ["gamer", "🎮 Juegos"], ["creadores", "🎨 Diseño y video"]];
  usesEl.insertAdjacentHTML("beforeend", useMap.map(function (u, i) {
    return '<label><input type="radio" name="uso" value="' + u[0] + '"' + (i === 0 ? " checked" : "") + "><span>" + u[1] + "</span></label>";
  }).join(""));
  var budget = $("[data-budget]"), out = $("[data-budget-out]"), result = $("[data-result]");
  var reasons = {
    estudios: "Rinde para clases, Office y videollamadas todo el día sin que pagues de más.",
    trabajo: "Liviana, rápida y con batería para toda tu jornada fuera de la oficina.",
    gamer: "La mejor tarjeta gráfica que entra en tu presupuesto para jugar fluido.",
    creadores: "Pantalla con colores fieles y potencia para Photoshop, Premiere o AutoCAD."
  };
  var lastPick = null;
  function runFinder() {
    var use = ($("input[name=uso]:checked", usesEl) || {}).value || "estudios";
    var max = +budget.value;
    out.textContent = soles(max);
    budget.style.setProperty("--p", ((max - budget.min) / (budget.max - budget.min) * 100) + "%");
    var pool = S.products.filter(function (p) { return p.cats.indexOf(use) > -1; }).sort(function (a, b) { return a.price - b.price; });
    var within = pool.filter(function (p) { return p.price <= max; });
    var p = within.length ? within[within.length - 1] : pool[0];
    var over = !within.length;
    var key = p.id + over;
    if (key === lastPick) return;
    lastPick = key;
    result.innerHTML = '<div class="pick" style="--s1:' + p.screen[0] + '">' +
      '<div class="pick__vis">' + lapHTML(p, 0, true) + "</div>" +
      '<span class="pick__tag">' + (over ? "Lo más cercano a tu presupuesto" : "Te recomendamos") + "</span>" +
      "<h3>" + p.brand + " " + p.name + "</h3>" +
      "<p>" + reasons[use] + "</p>" +
      '<div class="pick__row"><div><span class="price__now">' + soles(p.price) + '</span><span class="price__cuota">o ' + S.installments + " cuotas de " + cuota(p.price) + "</span></div>" +
      '<div style="display:flex;gap:8px"><button class="btn btn--sm glass" type="button" data-view="' + p.id + '">Ver</button><button class="btn btn--sm btn--dark" type="button" data-add="' + p.id + '">Agregar</button></div></div></div>';
  }
  usesEl.addEventListener("change", runFinder);
  budget.addEventListener("input", runFinder);
  runFinder();

  /* ---------- Aviso ---------- */
  var toastEl = $("[data-toast]"), tt;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
  }

  /* ---------- Aparición al hacer scroll ---------- */
  $$(".cuotas span").forEach(function (s, i) { s.style.setProperty("--n", i); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("on"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    $$(".rv").forEach(function (el) { io.observe(el); });
  } else {
    $$(".rv").forEach(function (el) { el.classList.add("on"); });
  }

  /* Contador */
  $$("[data-count]").forEach(function (el) {
    var end = +el.dataset.count, pre = el.dataset.prefix || "";
    if (reduce || !("IntersectionObserver" in window)) return;
    el.textContent = pre + "0";
    var o = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      o.disconnect();
      var t0 = performance.now();
      (function tick(t) {
        var k = Math.min(1, (t - t0) / 1200), e = 1 - Math.pow(1 - k, 3);
        el.textContent = pre + Math.round(end * e).toLocaleString("en-US");
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    }, { threshold: 0.4 });
    o.observe(el);
  });

  /* ---------- Portada: tapa que se abre, inclinación y lupa ---------- */
  requestAnimationFrame(function () { document.body.classList.add("is-ready"); });

  var stage = $("[data-stage]"), tilt = $("[data-tilt]");
  if (!reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = "rotateY(" + (x * 10) + "deg) rotateX(" + (-y * 8) + "deg)";
    });
    stage.addEventListener("pointerleave", function () { tilt.style.transform = ""; });
  }

  var lens = $("[data-lens]");
  // Mapa de desplazamiento: hace que la lupa "doble" la luz como un vidrio grueso
  function buildLensMap() {
    var size = lens.offsetWidth || 120;
    var cv = document.createElement("canvas");
    cv.width = cv.height = size;
    var ctx = cv.getContext("2d"), img = ctx.createImageData(size, size), d = img.data, r = size / 2;
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        var dx = (x - r) / r, dy = (y - r) / r, dist = Math.sqrt(dx * dx + dy * dy), i = (y * size + x) * 4;
        var m = dist < 1 ? 0.28 + 0.72 * Math.pow(dist, 3) : 0;
        d[i] = 128 + dx * m * 127 * 0.9;
        d[i + 1] = 128 + dy * m * 127 * 0.9;
        d[i + 2] = 128; d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    var fe = document.getElementById("lensMap");
    fe.setAttribute("width", size); fe.setAttribute("height", size);
    fe.setAttribute("href", cv.toDataURL());
    fe.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", cv.toDataURL());
  }

  var lx = 0, ly = 0;
  function placeLens(x, y) {
    var r = stage.getBoundingClientRect(), s = lens.offsetWidth;
    lx = Math.max(-s * 0.2, Math.min(r.width - s * 0.8, x));
    ly = Math.max(-s * 0.2, Math.min(r.height - s * 0.8, y));
    lens.style.transform = "translate(" + lx + "px," + ly + "px)";
  }
  function homeLens() {
    var r = stage.getBoundingClientRect(), s = lens.offsetWidth;
    placeLens(r.width * 0.56 - s / 2, r.height * 0.36 - s / 2);
  }
  if (chromium) buildLensMap();
  homeLens();
  window.addEventListener("resize", function () { if (chromium) buildLensMap(); homeLens(); });

  var drag = null;
  lens.addEventListener("pointerdown", function (e) {
    drag = { x: e.clientX - lx, y: e.clientY - ly };
    lens.setPointerCapture(e.pointerId);
    lens.classList.add("grabbing", "dragged");
  });
  lens.addEventListener("pointermove", function (e) { if (drag) placeLens(e.clientX - drag.x, e.clientY - drag.y); });
  function endDrag() { drag = null; lens.classList.remove("grabbing"); }
  lens.addEventListener("pointerup", endDrag);
  lens.addEventListener("pointercancel", endDrag);

  renderCart();
})();
