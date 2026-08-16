/* ============================================================
   b&b La Villa — main.js
   Scrollytelling (Motion) + interazioni. Progressive enhancement:
   se Motion non carica, il sito resta pienamente usabile in statico.
   Anima SOLO transform/opacity (compositing) — nessun layout thrashing.
   ============================================================ */

/* ============================================================
   1) CONFIGURAZIONE — MODIFICA QUI
   ============================================================ */

/* -------- Destinazione UNICA del pulsante "Prenota" --------
   Usata da TUTTI e 4 i punti (header, fine camere, barra mobile, footer).
   Finché è "" (vuota), i pulsanti restano sul fallback tel:/WhatsApp già
   presente nell'HTML. Basta cambiarla QUI per aggiornarli tutti. Esempi:
     const BOOKING_URL = "https://booking.mioengine.com/lavilla";
     const BOOKING_URL = "https://wa.me/393000000000";   // WhatsApp
     const BOOKING_URL = "tel:+390543000000";            // solo telefono   */
const BOOKING_URL = "";

/* -------- Foto e testi delle 4 scene della hero --------
   Per cambiare foto o testi modifica SOLO questo blocco: non toccare
   l'HTML né la logica di animazione.
   Ogni scena ha 4 varianti immagine (in assets/img/):
     webp / jpg           → desktop (orizzontale)
     webpMobile / jpgMobile → mobile (verticale)
   Se hai una sola immagine, metti lo stesso percorso in tutti e 4 i campi.
   objectPosition regola l'inquadratura senza rifare il crop
     (es. "center", "top", "50% 30%", "left center").                      */
const SCENES = [
  {
    img: {
      webp: "assets/img/hero-1-esterno.webp",
      jpg:  "assets/img/hero-1-esterno.jpg",
      webpMobile: "assets/img/hero-1-esterno-mobile.webp",
      jpgMobile:  "assets/img/hero-1-esterno-mobile.jpg",
    },
    objectPosition: "center 40%",
    alt: "Vista aerea della villa con il tetto e la terrazza, immersa nel verde",
    num: "01",
    eyebrow: "Bed & Breakfast · Forlì",
    title: "La Villa",
    text: "Una casa di famiglia a Forlì, tra il verde della campagna e la comodità dell'autostrada.",
  },
  {
    img: {
      webp: "assets/img/hero-2-camera.webp",
      jpg:  "assets/img/hero-2-camera.jpg",
      webpMobile: "assets/img/hero-2-camera-mobile.webp",
      jpgMobile:  "assets/img/hero-2-camera-mobile.jpg",
    },
    objectPosition: "38% center",
    alt: "Camera matrimoniale con parquet, letto in ferro battuto e finestra sul giardino",
    num: "02",
    eyebrow: "Le stanze",
    title: "Le Camere",
    text: "Tre matrimoniali luminose, ognuna con il suo carattere e il suo silenzio.",
  },
  {
    img: {
      webp: "assets/img/hero-3-colazione.webp",
      jpg:  "assets/img/hero-3-colazione.jpg",
      webpMobile: "assets/img/hero-3-colazione-mobile.webp",
      jpgMobile:  "assets/img/hero-3-colazione-mobile.jpg",
    },
    objectPosition: "center 45%",
    alt: "Colazione servita in terrazza, con vista sul verde",
    num: "03",
    eyebrow: "Il buongiorno",
    title: "La Colazione",
    text: "Ogni mattina prodotti del territorio e dolci fatti in casa, nella sala comune.",
  },
  {
    img: {
      webp: "assets/img/hero-4-giardino.webp",
      jpg:  "assets/img/hero-4-giardino.jpg",
      webpMobile: "assets/img/hero-4-giardino-mobile.webp",
      jpgMobile:  "assets/img/hero-4-giardino-mobile.jpg",
    },
    objectPosition: "center 42%",
    alt: "La villa vista dall'alto tra il giardino, gli alberi d'autunno e il vigneto",
    num: "04",
    eyebrow: "All'aperto",
    title: "Il Giardino",
    text: "Uno spazio dove rallentare all'ombra, lontano dal traffico.",
  },
];

/* -------- Versione di Motion FISSATA (non @latest) --------
   Pin esplicito: un aggiornamento upstream non può rompere il sito.
   Per aggiornare, cambia il numero di versione qui e ritesta.            */
const MOTION_URL = "https://cdn.jsdelivr.net/npm/motion@11.18.2/+esm";

/* -------- Foto delle camere (card + galleria/lightbox) --------
   Ogni camera ha un array "photos": la PRIMA è la copertina della card,
   TUTTE compaiono nel lightbox quando si clicca la card.
   Per aggiungere foto a una stanza, aggiungi oggetti { webp, jpg, alt }.
   Se hai solo il JPG, metti lo stesso percorso anche in "webp".
   coverPosition regola l'inquadratura della copertina (es. "center", "50% 30%"). */
const CAMERE = [
  {
    name: "Matrimoniale Deluxe",
    coverPosition: "center",
    photos: [
      { webp: "assets/img/camera-deluxe.webp", jpg: "assets/img/camera-deluxe.jpg", alt: "Camera Matrimoniale Deluxe" },
    ],
  },
  {
    name: "Deluxe con Balcone",
    coverPosition: "center",
    photos: [
      { webp: "assets/img/camera-balcone.webp", jpg: "assets/img/camera-balcone.jpg", alt: "Camera Deluxe con Balcone" },
    ],
  },
  {
    name: "Vista Giardino",
    coverPosition: "center",
    photos: [
      { webp: "assets/img/camera-giardino.webp", jpg: "assets/img/camera-giardino.jpg", alt: "Camera con Vista Giardino" },
    ],
  },
];


/* ============================================================
   2) AVVIO
   ============================================================ */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Enhancements che NON dipendono da Motion: partono sempre.
setYear();
applyScenes();
applyCamere();
applyBooking();
initMenu();
initScrollUI();
initGallery();

// Scrollytelling e reveal: richiedono Motion. Import in try/catch.
(async () => {
  let motion = null;
  try {
    motion = await import(MOTION_URL);
  } catch (err) {
    // Motion non disponibile (offline, CDN irraggiungibile, ecc.):
    // il sito resta nella versione statica impilata. Nessun errore fatale.
    console.warn("[La Villa] Motion non caricato — versione statica.", err);
    return;
  }

  // Attiva la modalità scrollytelling (lo stage sticky/crossfade è in CSS).
  document.documentElement.classList.add("js-scrollytelling");

  if (!reduceMotion) {
    initHero(motion);
    initStagger(motion);
  }
  // Con reduced-motion le scene restano statiche (gestito dal CSS).
})();


/* ============================================================
   3) FUNZIONI
   ============================================================ */

function setYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = new Date().getFullYear();
}

/* Scrive foto/testi delle SCENES nel DOM (l'HTML resta come fallback). */
function applyScenes() {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;
  const scenes = [...hero.querySelectorAll(".scene")];
  SCENES.forEach((cfg, i) => {
    const el = scenes[i];
    if (!el) return;
    const img = el.querySelector("img");
    const sources = [...el.querySelectorAll("picture source")];
    // Ordine sorgenti nell'HTML: [0] mobile webp, [1] mobile jpg, [2] desktop webp
    if (cfg.img) {
      if (sources[0]) sources[0].srcset = cfg.img.webpMobile;
      if (sources[1]) sources[1].srcset = cfg.img.jpgMobile;
      if (sources[2]) sources[2].srcset = cfg.img.webp;
      if (img) img.src = cfg.img.jpg;
    }
    if (img) {
      if (cfg.objectPosition) img.style.objectPosition = cfg.objectPosition;
      if (cfg.alt) img.alt = cfg.alt;
    }
    const eyebrow = el.querySelector(".eyebrow");
    if (eyebrow) {
      eyebrow.textContent = "";
      const span = document.createElement("span");
      span.className = "scene-num";
      span.textContent = cfg.num ?? "";
      eyebrow.append(span, document.createTextNode(" " + (cfg.eyebrow ?? "")));
    }
    const title = el.querySelector(".scene-title");
    if (title && cfg.title) title.textContent = cfg.title;
    const text = el.querySelector(".scene-text");
    if (text && cfg.text) text.textContent = cfg.text;
  });
}

/* Applica BOOKING_URL a tutti i pulsanti [data-booking]. */
function applyBooking() {
  if (!BOOKING_URL) return; // resta il fallback tel: dell'HTML
  const external = /^https?:\/\//i.test(BOOKING_URL);
  document.querySelectorAll("[data-booking]").forEach((a) => {
    a.href = BOOKING_URL;
    if (external) {
      a.target = "_blank";
      a.rel = "noopener";
    }
  });
}

/* Copertina + conteggio foto delle card camere, da CAMERE. */
function applyCamere() {
  document.querySelectorAll(".camera-media[data-gallery]").forEach((btn) => {
    const cam = CAMERE[+btn.dataset.gallery];
    if (!cam || !cam.photos || !cam.photos.length) return;
    const cover = cam.photos[0];
    const source = btn.querySelector("source");
    const img = btn.querySelector("img");
    if (source && cover.webp) source.srcset = cover.webp;
    if (img) {
      if (cover.jpg) img.src = cover.jpg;
      if (cover.alt) img.alt = cover.alt;
      if (cam.coverPosition) img.style.objectPosition = cam.coverPosition;
    }
    const count = btn.querySelector("[data-count]");
    if (count) count.textContent = cam.photos.length;
  });
}

/* Lightbox galleria: frecce, tastiera, swipe, thumbnail, focus-trap. */
function initGallery() {
  const triggers = [...document.querySelectorAll(".camera-media[data-gallery]")];
  if (!triggers.length) return;

  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Galleria foto della camera");
  lb.innerHTML =
    '<div class="lb-stage">' +
      '<button class="lb-close" type="button" aria-label="Chiudi galleria">×</button>' +
      '<button class="lb-nav lb-prev" type="button" aria-label="Foto precedente">‹</button>' +
      '<figure class="lb-figure"><img class="lb-img" alt=""></figure>' +
      '<button class="lb-nav lb-next" type="button" aria-label="Foto successiva">›</button>' +
    '</div>' +
    '<div class="lb-footer">' +
      '<p class="lb-caption"></p>' +
      '<div class="lb-counter"><span class="lb-index">1</span> / <span class="lb-total">1</span></div>' +
      '<div class="lb-thumbs"></div>' +
    '</div>';
  document.body.appendChild(lb);

  const imgEl = lb.querySelector(".lb-img");
  const capEl = lb.querySelector(".lb-caption");
  const idxEl = lb.querySelector(".lb-index");
  const totEl = lb.querySelector(".lb-total");
  const counterEl = lb.querySelector(".lb-counter");
  const prevBtn = lb.querySelector(".lb-prev");
  const nextBtn = lb.querySelector(".lb-next");
  const closeBtn = lb.querySelector(".lb-close");
  const thumbsEl = lb.querySelector(".lb-thumbs");

  let photos = [], i = 0, lastFocus = null, camName = "";

  const preload = (n) => {
    const ph = photos[(n + photos.length) % photos.length];
    if (ph) { const im = new Image(); im.src = ph.webp || ph.jpg; }
  };

  const show = (n) => {
    i = (n + photos.length) % photos.length;
    const ph = photos[i];
    const url = ph.webp || ph.jpg;
    imgEl.classList.add("is-swapping");
    const tmp = new Image();
    tmp.onload = () => { imgEl.src = url; imgEl.alt = ph.alt || camName; imgEl.classList.remove("is-swapping"); };
    tmp.onerror = () => { imgEl.src = ph.jpg; imgEl.alt = ph.alt || camName; imgEl.classList.remove("is-swapping"); };
    tmp.src = url;
    idxEl.textContent = i + 1;
    capEl.textContent = camName;
    thumbsEl.querySelectorAll(".lb-thumb").forEach((t, k) => t.classList.toggle("is-current", k === i));
    if (photos.length > 1) { preload(i + 1); preload(i - 1); }
  };

  const buildThumbs = () => {
    thumbsEl.innerHTML = "";
    if (photos.length < 2) return;
    photos.forEach((ph, k) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "lb-thumb"; b.setAttribute("aria-label", "Vai alla foto " + (k + 1));
      const im = document.createElement("img");
      im.src = ph.webp || ph.jpg; im.alt = ""; im.loading = "lazy";
      b.appendChild(im);
      b.addEventListener("click", () => show(k));
      thumbsEl.appendChild(b);
    });
  };

  const open = (camIndex) => {
    const cam = CAMERE[camIndex];
    if (!cam || !cam.photos || !cam.photos.length) return;
    photos = cam.photos; camName = cam.name;
    totEl.textContent = photos.length;
    const single = photos.length < 2;
    prevBtn.hidden = single; nextBtn.hidden = single;
    counterEl.style.display = single ? "none" : "";
    buildThumbs();
    lastFocus = document.activeElement;
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
    show(0);
    closeBtn.focus();
  };

  const close = () => {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  triggers.forEach((btn) => btn.addEventListener("click", () => open(+btn.dataset.gallery)));
  prevBtn.addEventListener("click", () => show(i - 1));
  nextBtn.addEventListener("click", () => show(i + 1));
  closeBtn.addEventListener("click", close);
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target.classList.contains("lb-stage") || e.target.classList.contains("lb-figure")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") { close(); return; }
    if (photos.length > 1 && e.key === "ArrowRight") { show(i + 1); return; }
    if (photos.length > 1 && e.key === "ArrowLeft") { show(i - 1); return; }
    if (e.key === "Tab") {
      const f = [closeBtn, prevBtn, nextBtn, ...thumbsEl.querySelectorAll(".lb-thumb")]
        .filter((el) => !el.hidden && el.offsetParent !== null);
      if (!f.length) return;
      const idx = f.indexOf(document.activeElement);
      if (e.shiftKey && idx <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && idx === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });

  // swipe su mobile
  let sx = 0, sy = 0;
  lb.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (photos.length < 2) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(dx < 0 ? i + 1 : i - 1);
  }, { passive: true });
}

/* Menu overlay boutique: apertura/chiusura, ESC, focus trap, scroll lock. */
function initMenu() {
  const btn = document.querySelector(".menu-toggle");
  const overlay = document.getElementById("menu-overlay");
  if (!btn || !overlay) return;
  overlay.removeAttribute("hidden");
  const links = [...overlay.querySelectorAll("a")];
  let open = false;

  const setOpen = (v) => {
    open = v;
    overlay.classList.toggle("is-open", v);
    btn.setAttribute("aria-expanded", String(v));
    btn.setAttribute("aria-label", v ? "Chiudi il menu" : "Apri il menu");
    document.body.style.overflow = v ? "hidden" : "";
    if (v) (links[0] || overlay).focus?.();
    else btn.focus();
  };

  btn.addEventListener("click", () => setOpen(!open));
  overlay.addEventListener("click", (e) => { if (e.target === overlay) setOpen(false); });
  links.forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (!open) return;
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key === "Tab") {
      const f = [btn, ...links];
      const idx = f.indexOf(document.activeElement);
      if (e.shiftKey && idx <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && idx === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
}

/* Stato header (trasparente per TUTTA la hero) + barra CTA mobile (dopo la hero). */
function initScrollUI() {
  const header = document.querySelector("[data-header]");
  const hero = document.querySelector("[data-hero]");
  const bar = document.querySelector("[data-mobile-cta]");

  let headerH = header ? header.offsetHeight : 76;
  window.addEventListener("resize", () => { headerH = header ? header.offsetHeight : 76; }, { passive: true });

  let ticking = false;
  const update = () => {
    ticking = false;
    if (!hero) return;
    // una sola lettura di layout per frame, poi solo scritture (niente thrashing).
    // bottom = bordo inferiore della hero rispetto al top del viewport.
    const bottom = hero.getBoundingClientRect().bottom;
    // trasparente finché la hero copre ancora l'header
    if (header) header.classList.toggle("is-transparent", bottom > headerH + 4);
    // barra mobile: compare quando la hero sta lasciando lo schermo
    if (bar) bar.classList.toggle("is-visible", bottom < window.innerHeight * 0.85);
  };
  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
}

/* Hero scrollytelling: crossfade 4 scene guidato dal progresso di scroll.
   Il crossfade è mappato sul tratto in cui la hero resta "pinned"
   (heroHeight - viewport), così tutte e 4 le scene hanno il loro momento
   pieno prima che la hero si sganci e scorra via. */
function initHero({ scroll }) {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;
  const scenes = [...hero.querySelectorAll(".scene")];
  const medias = scenes.map((s) => s.querySelector(".scene-media"));
  const bodies = scenes.map((s) => s.querySelector(".scene-body"));
  const dashes = [...hero.querySelectorAll("[data-progress] span")];
  const N = scenes.length;
  if (N < 2) return;

  const render = (raw) => {
    const progress = Math.min(1, Math.max(0, raw));
    const t = progress * (N - 1);                 // posizione continua 0..N-1
    const active = Math.min(N - 1, Math.max(0, Math.round(t)));
    for (let i = 0; i < N; i++) {
      const d = Math.abs(t - i);
      const dClamped = Math.min(d, 1);
      const op = Math.max(0, 1 - d);              // crossfade opacity
      scenes[i].style.opacity = op.toFixed(3);
      scenes[i].classList.toggle("is-active", i === active);
      if (medias[i]) medias[i].style.transform = `scale(${(1 + 0.05 * dClamped).toFixed(4)})`;
      if (bodies[i]) {
        const y = Math.max(-1, Math.min(1, i - t)) * 18; // ±18px
        bodies[i].style.transform = `translateY(${y.toFixed(1)}px)`;
      }
    }
    dashes.forEach((el, i) => el.classList.toggle("is-active", i === active));
  };

  render(0);
  // Motion notifica lo scroll (rAF interno). Ricavo il progresso dalla
  // geometria live della hero: una lettura di layout, poi solo scritture.
  // Il crossfade si completa all'85% del tratto pinned, così l'ultima
  // scena è piena mentre la hero è ancora ferma.
  scroll(() => {
    const rect = hero.getBoundingClientRect();
    const pinned = Math.max(1, (rect.height - window.innerHeight) * 0.85);
    render(-rect.top / pinned);
  }, { target: hero, offset: ["start start", "end end"] });
}

/* Reveal in stagger degli elementi [data-stagger] all'ingresso nel viewport. */
function initStagger({ animate, inView, stagger }) {
  document.querySelectorAll("[data-stagger]").forEach((grid) => {
    const kids = [...grid.children];
    let done = false;
    inView(grid, () => {
      if (done) return;
      done = true;
      grid.classList.add("is-inview");
      animate(
        kids,
        { opacity: [0, 1], transform: ["translateY(26px)", "translateY(0px)"] },
        { delay: stagger(0.08), duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }
      );
    }, { amount: 0.2 });
  });
}
