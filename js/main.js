/* ==========================================================
   MISIÓN YUPAY — comportamiento compartido
   ========================================================== */
(() => {
  const PAGES = [
    { id: "inicio", href: "index.html", label: "Inicio" },
    { id: "agenda-1", href: "agenda-1.html", label: "Agenda 1" },
    { id: "agenda-2", href: "agenda-2.html", label: "Agenda 2" },
    { id: "agenda-3", href: "agenda-3.html", label: "Agenda 3" },
    { id: "agenda-4", href: "agenda-4.html", label: "Agenda 4" },
    { id: "agenda-5", href: "agenda-5.html", label: "Agenda 5" },
  ];
  const current = document.body.dataset.page;

  const store = {
    get(k, d) { try { const v = localStorage.getItem("yupay:" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem("yupay:" + k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } },
  };
  window.YupayStore = store;

  const knotSVG = `<svg class="brand-knot" viewBox="0 0 40 40" aria-hidden="true">
    <path d="M4 8h32" stroke="#ffb627" stroke-width="4" stroke-linecap="round"/>
    <path d="M10 8v26M20 8v22M30 8v28" stroke="#1fb5a8" stroke-width="3" stroke-linecap="round"/>
    <circle cx="10" cy="18" r="3.5" fill="#e8483b"/><circle cx="20" cy="15" r="3.5" fill="#f25c9a"/>
    <circle cx="20" cy="24" r="3.5" fill="#f25c9a"/><circle cx="30" cy="20" r="3.5" fill="#6c4ab6"/>
    <circle cx="30" cy="29" r="3.5" fill="#6c4ab6"/></svg>`;

  const GRADES = [
    { id: "agenda-1", n: "1°", name: "1.er grado", info: "Fichas y 12 clases", c: "var(--teal)" },
    { id: "agenda-2", n: "2°", name: "2.do grado", info: "8 clases · juegos", c: "var(--pink)" },
    { id: "agenda-3", n: "3°", name: "3.er grado", info: "Fichas de trabajo", c: "var(--violet)" },
    { id: "agenda-4", n: "4°", name: "4.to grado", info: "4 clases · GeoGebra", c: "var(--red)" },
    { id: "agenda-5", n: "5°", name: "5.to grado", info: "Fichas de trabajo", c: "#e09100" },
  ];
  const cur = id => (id === current ? ' aria-current="page"' : "");
  const links = PAGES.map(p => `<a href="${p.href}"${cur(p.id)}>${p.label}</a>`).join("");
  const brand = `<a class="brand" href="index.html" aria-label="Yupay, ir al inicio">${knotSVG}
    <span class="brand-text"><span>Yu<b>pay</b></span><small>Misión matemática</small></span></a>`;

  /* ---------- Header ---------- */
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <a class="skip" href="#main">Saltar al contenido</a>
    <div class="container hbar">
      ${brand}
      <nav class="nav" aria-label="Principal">
        <a class="nav-link" href="index.html"${cur("inicio")}>🏠 Inicio</a>
        <div class="grades" role="group" aria-label="Agendas por grado">
          <span class="grades-label">Agendas</span>
          ${GRADES.map(g => `<a class="g" style="--c:${g.c}" href="${g.id}.html" data-tip="${g.name} · ${g.info}" aria-label="Agenda ${g.n[0]}: ${g.name}"${cur(g.id)}>${g.n}</a>`).join("")}
        </div>
        <a class="nav-link" href="index.html#ruta">🗺️ Hoja de ruta</a>
        <a class="nav-link" href="agenda-2.html#tendencia">🎮 Juegos</a>
      </nav>
      <a class="mision-chip" href="index.html#ruta" title="Progreso de tu misión de hoy">
        <span class="ring" aria-hidden="true"></span><span><span class="cnt">0/4</span> <span class="txt">misión</span></span>
      </a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="drawer">
        <span class="burger" aria-hidden="true"><i></i><i></i><i></i></span><span class="lbl">Menú</span>
      </button>
    </div>
    <div class="drawer" id="drawer">
      <div class="container">
        <h2>Elige tu agenda</h2>
        <div class="drawer-grades">
          ${GRADES.map(g => `<a class="dg" style="--c:${g.c}" href="${g.id}.html"${cur(g.id)}>
            <span class="n">${g.n}</span><span><b>${g.name}</b><small>${g.info}</small></span></a>`).join("")}
        </div>
        <h2>Accesos rápidos</h2>
        <div class="drawer-links">
          <a href="index.html"${cur("inicio")}><span>🏠</span>Inicio</a>
          <a href="index.html#ruta"><span>🗺️</span>Hoja de ruta</a>
          <a href="agenda-2.html#tendencia"><span>🎮</span>Juegos</a>
        </div>
      </div>
    </div>`;
  document.body.prepend(header);
  const backdrop = document.createElement("div");
  backdrop.className = "drawer-backdrop";
  header.after(backdrop);

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="container">
      ${brand}
      <p>Cada número es un nudo de conocimiento. ¡Sigue anudando! 🧶</p>
      <nav aria-label="Pie de página">${links}</nav>
      <small>Misión Yupay · Matemática para secundaria · ${new Date().getFullYear()}</small>
    </div>`;
  document.body.append(footer);

  /* Menú móvil */
  const menuBtn = header.querySelector(".menu-btn");
  const drawer = header.querySelector(".drawer");
  const setMenu = open => {
    drawer.classList.toggle("open", open);
    backdrop.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    if (open) drawer.querySelector("a").focus();
  };
  menuBtn.addEventListener("click", () => setMenu(!drawer.classList.contains("open")));
  backdrop.addEventListener("click", () => setMenu(false));
  drawer.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && drawer.classList.contains("open")) { setMenu(false); menuBtn.focus(); }
  });
  matchMedia("(min-width: 1021px)").addEventListener("change", e => { if (e.matches) setMenu(false); });

  /* Sombra al desplazarse */
  const onScroll = () => header.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Indicador de progreso de la misión */
  const chip = header.querySelector(".mision-chip");
  const updateChip = () => {
    const n = store.get("ruta", []).length;
    chip.querySelector(".cnt").textContent = `${n}/4`;
    chip.style.setProperty("--p", n / 4 * 100);
    chip.classList.toggle("done", n >= 4);
    chip.setAttribute("aria-label", `Progreso de la misión: ${n} de 4 pasos`);
  };
  addEventListener("yupay:ruta", updateChip);
  addEventListener("storage", updateChip);
  updateChip();

  /* ---------- Estrellas y números flotantes del hero ---------- */
  document.querySelectorAll(".stars").forEach(el => {
    for (let i = 0; i < 60; i++) {
      const s = document.createElement("i");
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.animationDelay = (Math.random() * 3).toFixed(2) + "s";
      s.style.opacity = (0.3 + Math.random() * 0.7).toFixed(2);
      el.append(s);
    }
    const glyphs = ["π", "x²", "√", "∑", "÷", "7", "3", "∞", "+", "%", "△", "y"];
    glyphs.forEach((g, i) => {
      const n = document.createElement("span");
      n.className = "float-num";
      n.textContent = g;
      n.style.left = (i * 8.3 + Math.random() * 4) + "%";
      n.style.top = (10 + Math.random() * 75) + "%";
      n.style.fontSize = (1.8 + Math.random() * 3) + "rem";
      n.style.animationDelay = (-Math.random() * 9).toFixed(2) + "s";
      el.append(n);
    });
  });

  /* ---------- Aparición al hacer scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  /* ---------- Modal (documentos e imágenes) ---------- */
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML = `<div class="modal-box"><div class="modal-bar"><h3></h3><a target="_blank" rel="noopener">Abrir en Drive ↗</a><button type="button" aria-label="Cerrar">✕ Cerrar</button></div><div class="modal-body" style="display:contents"></div></div>`;
  document.body.append(modal);
  const mBox = modal.querySelector(".modal-box");
  const mTitle = modal.querySelector("h3");
  const mLink = modal.querySelector("a");
  const mBody = modal.querySelector(".modal-body");
  let lastFocus = null;

  function openModal({ title, src, img, href }) {
    lastFocus = document.activeElement;
    mTitle.textContent = title;
    mBox.classList.toggle("img", !!img);
    mLink.hidden = !href;
    if (href) mLink.href = href;
    mBody.innerHTML = img
      ? `<img src="${img}" alt="${title}">`
      : `<iframe src="${src}" title="${title}" allow="autoplay" loading="lazy"></iframe>`;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    modal.querySelector("button").focus();
  }
  function closeModal() {
    modal.classList.remove("open");
    mBody.innerHTML = "";
    document.body.style.overflow = "";
    lastFocus && lastFocus.focus();
  }
  modal.addEventListener("click", e => { if (e.target === modal || e.target.closest(".modal-bar button")) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });

  /* Recursos de Google Drive: <button class="recurso" data-drive="ID" data-tipo="FICHA" data-name="archivo.pdf"> */
  document.querySelectorAll("[data-drive]").forEach(el => {
    const id = el.dataset.drive;
    const name = el.dataset.name || "Documento";
    if (el.classList.contains("recurso")) {
      const ext = (name.split(".").pop() || "pdf").toLowerCase();
      el.dataset.ext = ext;
      el.type = "button";
      el.innerHTML = `<span class="ext">${ext.toUpperCase()}</span><span><b>${el.dataset.tipo || "VER"}</b><span class="name">${name}</span></span>`;
      el.title = name;
    }
    el.addEventListener("click", e => {
      e.preventDefault();
      openModal({
        title: name,
        src: `https://drive.google.com/file/d/${id}/preview`,
        href: `https://drive.google.com/file/d/${id}/view`,
      });
    });
  });

  /* Imágenes ampliables */
  document.querySelectorAll(".figura img, img[data-zoom]").forEach(img => {
    img.addEventListener("click", () => openModal({ title: img.alt, img: img.src }));
  });

  /* ---------- Embeds de YouTube / GeoGebra con carga al clic ---------- */
  document.querySelectorAll(".embed[data-yt], .embed[data-geo]").forEach(el => {
    const yt = el.dataset.yt;
    const geo = el.dataset.geo;
    const title = el.dataset.title || (yt ? "Video" : "Applet GeoGebra");
    const btn = document.createElement("button");
    btn.className = "poster";
    btn.type = "button";
    btn.setAttribute("aria-label", (yt ? "Reproducir video: " : "Abrir applet: ") + title);
    if (yt) btn.style.backgroundImage = `url(https://i.ytimg.com/vi/${yt}/hqdefault.jpg)`;
    const thumb = el.dataset.img ? `<img src="${el.dataset.img}" alt="">` : "";
    btn.innerHTML = `${thumb}<span class="play">${yt ? "▶" : "🧊"}</span><span class="label">${title}</span>`;
    btn.addEventListener("click", () => {
      const src = yt
        ? `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`
        : `https://www.geogebra.org/material/iframe/id/${geo}/width/800/height/600/border/888888/rc/false/ai/false/sdz/true/smb/false/stb/false/stbh/false/ld/false/sri/true`;
      el.innerHTML = `<iframe src="${src}" title="${title}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    });
    el.append(btn);
    if (geo) {
      const a = document.createElement("a");
      a.href = `https://www.geogebra.org/classic/${geo}`;
      a.target = "_blank";
      a.rel = "noopener";
      a.className = "ext-link";
      a.textContent = `Abrir “${title}” en GeoGebra ↗`;
      const wrap = document.createElement("div");
      wrap.className = "geo-wrap";
      el.replaceWith(wrap);
      wrap.append(el, a);
    }
  });

  /* ---------- Reacciones con emoji ---------- */
  document.querySelectorAll(".reaccion[data-key]").forEach(box => {
    const key = "reaccion:" + box.dataset.key;
    const chosen = store.get(key, null);
    const countEl = box.querySelector(".count");
    box.querySelectorAll("button").forEach(b => {
      if (b.textContent.trim() === chosen) b.classList.add("on");
      b.addEventListener("click", () => {
        box.querySelectorAll("button").forEach(x => x.classList.remove("on"));
        b.classList.add("on");
        store.set(key, b.textContent.trim());
        if (countEl) countEl.textContent = "¡Gracias por tu " + b.textContent.trim() + "!";
        burst([b.textContent.trim()], 14);
      });
    });
    if (chosen && countEl) countEl.textContent = "Dejaste un " + chosen;
  });

  /* ---------- Confeti ---------- */
  function burst(items = ["🎉", "⭐", "🧶", "✨", "🔢"], n = 40) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 0; i < n; i++) {
      const c = document.createElement("span");
      c.className = "confetti";
      c.textContent = items[i % items.length];
      c.style.left = Math.random() * 100 + "vw";
      c.style.animationDuration = (2 + Math.random() * 2.5) + "s";
      c.style.animationDelay = (Math.random() * 0.6) + "s";
      document.body.append(c);
      setTimeout(() => c.remove(), 5500);
    }
  }
  window.YupayBurst = burst;

  /* ---------- Hoja de ruta (inicio) ---------- */
  const ruta = document.querySelector(".ruta");
  if (ruta) {
    const pasos = [...ruta.querySelectorAll(".paso")];
    const bar = document.querySelector(".progress .bar > i");
    const txt = document.querySelector(".progress p");
    const done = new Set(store.get("ruta", []));
    const render = (celebrate) => {
      pasos.forEach((p, i) => {
        const on = done.has(i);
        p.classList.toggle("done", on);
        const b = p.querySelector(".check");
        b.setAttribute("aria-pressed", on);
        b.textContent = on ? "✓ ¡Listo!" : "Marcar como hecho";
      });
      const pct = Math.round(done.size / pasos.length * 100);
      bar.style.width = pct + "%";
      txt.textContent = done.size === pasos.length
        ? "🏆 ¡Misión cumplida, Quipucamayoc! Has anudado un nuevo conocimiento."
        : `Progreso de la misión: ${done.size} de ${pasos.length} pasos (${pct}%)`;
      if (celebrate && done.size === pasos.length) burst();
    };
    pasos.forEach((p, i) => p.querySelector(".check").addEventListener("click", () => {
      done.has(i) ? done.delete(i) : done.add(i);
      store.set("ruta", [...done]);
      dispatchEvent(new Event("yupay:ruta"));
      render(true);
    }));
    render(false);
  }

  /* ---------- Índice de clases: resaltar la sección visible ---------- */
  const tocLinks = [...document.querySelectorAll(".toc a")];
  if (tocLinks.length) {
    const map = new Map(tocLinks.map(a => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        tocLinks.forEach(a => a.classList.remove("active"));
        const a = map.get(e.target.id);
        if (!a) return;
        a.classList.add("active");
        const list = a.closest("ol");
        if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: a.offsetLeft - 16, behavior: "smooth" });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); s && spy.observe(s); });
  }
})();
