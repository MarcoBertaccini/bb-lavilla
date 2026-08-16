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
    objectPosition: "center",
    alt: "L'esterno della villa immersa nel verde",
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
    objectPosition: "center",
    alt: "Interno di una camera matrimoniale luminosa",
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
    objectPosition: "center",
    alt: "Tavolo della colazione nella sala comune",
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
    objectPosition: "center",
    alt: "Il giardino della villa, con alberi e zona d'ombra",
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


/* ============================================================
   2) AVVIO
   ============================================================ */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Enhancements che NON dipendono da Motion: partono sempre.
setYear();
applyScenes();
applyBooking();
initMenu();
initScrollUI();

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

/* Stato header (trasparente solo in cima) + barra CTA mobile (dopo la hero). */
function initScrollUI() {
  const header = document.querySelector("[data-header]");
  const hero = document.querySelector("[data-hero]");
  const bar = document.querySelector("[data-mobile-cta]");

  const barThreshold = () =>
    hero ? hero.offsetTop + hero.offsetHeight - window.innerHeight - 40 : Infinity;
  let threshold = barThreshold();

  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-transparent", y <= 40);
    if (bar) bar.classList.toggle("is-visible", y > threshold);
  };
  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { threshold = barThreshold(); update(); }, { passive: true });
  update();
}

/* Hero scrollytelling: crossfade 4 scene guidato dal progresso di scroll. */
function initHero({ scroll }) {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;
  const scenes = [...hero.querySelectorAll(".scene")];
  const medias = scenes.map((s) => s.querySelector(".scene-media"));
  const bodies = scenes.map((s) => s.querySelector(".scene-body"));
  const dashes = [...hero.querySelectorAll("[data-progress] span")];
  const N = scenes.length;
  if (N < 2) return;

  const render = (progress) => {
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
  scroll(render, { target: hero, offset: ["start start", "end end"] });
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
