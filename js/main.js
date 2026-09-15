/* ============================================================
   b&b La Villa — main.js
   Scrollytelling (Motion) + interazioni + i18n IT/EN/DE.
   Progressive enhancement: senza Motion il sito resta usabile.
   Anima SOLO transform/opacity (compositing).
   ============================================================ */

/* ============================================================
   1) CONFIGURAZIONE — MODIFICA QUI
   ============================================================ */

/* Destinazione del pulsante "Prenota". Se vuota, i CTA usano WhatsApp. */
const BOOKING_URL = "";

/* Contatto WhatsApp: usato da header, barra mobile, footer e CTA (fallback). */
const WHATSAPP_URL = "https://wa.me/393355925880";

/* Mappa: embed di Google Maps (caricata SOLO al click dell'utente). */
const MAP_EMBED = "https://www.google.com/maps?q=Via+Zampeschi+109%2FB+Forl%C3%AC&output=embed";

/* Versione di Motion FISSATA (non @latest). */
const MOTION_URL = "https://cdn.jsdelivr.net/npm/motion@11.18.2/+esm";

/* -------- Foto e testi delle 3 scene della hero --------
   Testi multilingua { it, en, de }. Per cambiare foto modifica "img";
   objectPosition regola l'inquadratura senza rifare il crop. */
const SCENES = [
  {
    img: {
      webp: "assets/img/hero-1-esterno.webp",
      jpg:  "assets/img/hero-1-esterno.jpg",
      webpMobile: "assets/img/hero-1-esterno-mobile.webp",
      jpgMobile:  "assets/img/hero-1-esterno-mobile.jpg",
    },
    objectPosition: "center 38%",
    alt: "La villa vista dal giardino, con il pergolato d'ingresso e gli ulivi sotto il cielo azzurro",
    num: "01",
    eyebrow: { it: "Bed & Breakfast · Forlì", en: "Bed & Breakfast · Forlì", de: "Bed & Breakfast · Forlì" },
    title:   { it: "La Villa", en: "The Villa", de: "Die Villa" },
    text: {
      it: "Una base comoda a Forlì, a due passi dall'A14 — per chi viaggia e vuole ripartire riposato.",
      en: "A handy base in Forlì, minutes from the A14 — for those who travel and want to leave well rested.",
      de: "Eine praktische Basis in Forlì, wenige Minuten von der A14 — für alle, die reisen und ausgeruht weiterfahren möchten.",
    },
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
    eyebrow: { it: "Le stanze", en: "The rooms", de: "Die Zimmer" },
    title:   { it: "Le Camere", en: "The Rooms", de: "Die Zimmer" },
    text: {
      it: "Tre matrimoniali silenziose, ognuna con il suo carattere: per dormire bene e ripartire presto.",
      en: "Three quiet double rooms, each with its own character: to sleep well and leave early.",
      de: "Drei ruhige Doppelzimmer, jedes mit eigenem Charakter: gut schlafen und früh aufbrechen.",
    },
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
    eyebrow: { it: "Il buongiorno", en: "Good morning", de: "Guten Morgen" },
    title:   { it: "La Colazione", en: "Breakfast", de: "Frühstück" },
    text: {
      it: "Ogni mattina una colazione dolce e salata, servita nella sala comune.",
      en: "A sweet and savoury breakfast every morning, served in the common room.",
      de: "Jeden Morgen ein süßes und herzhaftes Frühstück, serviert im Gemeinschaftsraum.",
    },
  },
];

/* -------- Foto delle camere (card + galleria/lightbox) --------
   "name" multilingua (usato nel lightbox). La PRIMA foto è la copertina. */
const CAMERE = [
  {
    name: { it: "Matrimoniale Deluxe", en: "Deluxe Double", de: "Deluxe-Doppelzimmer" },
    coverPosition: "center",
    photos: [
      { webp: "assets/img/camere/deluxe-1.webp", jpg: "assets/img/camere/deluxe-1.jpg", alt: "Matrimoniale Deluxe: la camera con letto matrimoniale e divano" },
      { webp: "assets/img/camere/deluxe-2.webp", jpg: "assets/img/camere/deluxe-2.jpg", alt: "Matrimoniale Deluxe: la camera con parquet e tappeto" },
      { webp: "assets/img/camere/deluxe-3.webp", jpg: "assets/img/camere/deluxe-3.jpg", alt: "Matrimoniale Deluxe: il bagno con doccia" },
      { webp: "assets/img/camere/deluxe-4.webp", jpg: "assets/img/camere/deluxe-4.jpg", alt: "Matrimoniale Deluxe: il bagno" },
    ],
  },
  {
    name: { it: "Deluxe con Balcone", en: "Deluxe with Balcony", de: "Deluxe mit Balkon" },
    coverPosition: "center",
    photos: [
      { webp: "assets/img/camere/balcone-1.webp", jpg: "assets/img/camere/balcone-1.jpg", alt: "Deluxe con Balcone: la camera con parete blu" },
      { webp: "assets/img/camere/balcone-2.webp", jpg: "assets/img/camere/balcone-2.jpg", alt: "Deluxe con Balcone: la camera matrimoniale" },
      { webp: "assets/img/camere/balcone-3.webp", jpg: "assets/img/camere/balcone-3.jpg", alt: "Deluxe con Balcone: il balcone con vista sul giardino" },
      { webp: "assets/img/camere/balcone-4.webp", jpg: "assets/img/camere/balcone-4.jpg", alt: "Deluxe con Balcone: il balcone privato" },
      { webp: "assets/img/camere/balcone-5.webp", jpg: "assets/img/camere/balcone-5.jpg", alt: "Deluxe con Balcone: il bagno con vasca idromassaggio" },
      { webp: "assets/img/camere/balcone-6.webp", jpg: "assets/img/camere/balcone-6.jpg", alt: "Deluxe con Balcone: il bagno" },
      { webp: "assets/img/camere/balcone-7.webp", jpg: "assets/img/camere/balcone-7.jpg", alt: "Deluxe con Balcone: la doccia" },
    ],
  },
  {
    name: { it: "Vista Giardino", en: "Garden View", de: "Gartenblick" },
    coverPosition: "center",
    photos: [
      { webp: "assets/img/camere/giardino-1.webp", jpg: "assets/img/camere/giardino-1.jpg", alt: "Vista Giardino: la camera luminosa" },
      { webp: "assets/img/camere/giardino-2.webp", jpg: "assets/img/camere/giardino-2.jpg", alt: "Vista Giardino: la camera con luce calda" },
      { webp: "assets/img/camere/giardino-3.webp", jpg: "assets/img/camere/giardino-3.jpg", alt: "Vista Giardino: il balcone affacciato sul giardino" },
      { webp: "assets/img/camere/giardino-4.webp", jpg: "assets/img/camere/giardino-4.jpg", alt: "Vista Giardino: il bagno" },
      { webp: "assets/img/camere/giardino-5.webp", jpg: "assets/img/camere/giardino-5.jpg", alt: "Vista Giardino: la doccia" },
      { webp: "assets/img/camere/giardino-6.webp", jpg: "assets/img/camere/giardino-6.jpg", alt: "Vista Giardino: camera e bagno" },
    ],
  },
];

/* -------- Traduzioni IT / EN / DE --------
   Chiavi usate da data-i18n / -html / -attr / -meta nell'HTML. */
const TRANSLATIONS = {
  it: {
    "title": "b&b La Villa — Bed & Breakfast a Forlì",
    "metaDescription": "b&b La Villa: bed & breakfast a Forlì, a due passi dall'autostrada A14. Ideale per chi viaggia per lavoro — parcheggio privato, Wi-Fi gratuito, camere silenziose e colazione dolce e salata.",
    "a11y.skip": "Salta al contenuto",
    "a11y.whatsapp": "Scrivici su WhatsApp",
    "a11y.email": "Scrivi al b&b La Villa",
    "a11y.menuOpen": "Apri il menu",
    "a11y.menuClose": "Chiudi il menu",
    "nav.camere": "Camere", "nav.villa": "La Villa", "nav.servizi": "Servizi", "nav.dove": "Dove Siamo", "nav.contatti": "Contatti",
    "cta.book": "Prenota", "cta.check": "Verifica disponibilità", "cta.check2": "Verifica disponibilità", "cta.datefree": "Date libere?",
    "contact.whatsapp": "WhatsApp: +39 335 592 5880",
    "villa.eyebrow": "La casa",
    "villa.title": "Comoda per il lavoro, tranquilla per riposare",
    "villa.lead": "La Villa è una casa alle porte di Forlì, a pochi minuti dal casello dell'A14: la base ideale per chi si sposta per lavoro e cerca una notte silenziosa, un parcheggio comodo e una colazione vera prima di ripartire.",
    "villa.p2": "Camere curate e lontane dal rumore del traffico, Wi-Fi gratuito e check-in serale su richiesta: tutto pensato per chi arriva la sera e riparte presto — senza rinunciare all'accoglienza di una famiglia che conosce il territorio.",
    "camere.eyebrow": "Le stanze", "camere.title": "Le Camere",
    "camere.sub": "Tre matrimoniali silenziose, tutte con bagno privato, aria condizionata e Wi-Fi.",
    "cam.deluxe.name": "Matrimoniale Deluxe",
    "cam.deluxe.meta": "1 letto matrimoniale alla francese · <span class=\"guests\">2 ospiti · senza balcone</span>",
    "cam.deluxe.desc": "La più raccolta: essenziale e luminosa, perfetta per una notte di lavoro.",
    "cam.deluxe.aria": "Apri la galleria — Matrimoniale Deluxe",
    "cam.balcone.name": "Deluxe con Balcone",
    "cam.balcone.meta": "1 letto matrimoniale · <span class=\"guests\">2 ospiti</span>",
    "cam.balcone.desc": "Con balcone privato affacciato sulla quiete: aria aperta appena sveglio.",
    "cam.balcone.aria": "Apri la galleria — Deluxe con Balcone",
    "cam.giardino.name": "Vista Giardino",
    "cam.giardino.meta": "1 letto matrimoniale · <span class=\"guests\">2 ospiti</span>",
    "cam.giardino.desc": "Finestre sul verde: la stanza più silenziosa, ideale per riposare davvero.",
    "cam.giardino.aria": "Apri la galleria — Vista Giardino",
    "serv.eyebrow": "Il necessario, fatto bene", "serv.title": "Servizi",
    "serv.colazione.t": "Colazione inclusa", "serv.colazione.d": "Colazione dolce e salata, servita ogni mattina.",
    "serv.wifi.t": "Wi-Fi gratuito", "serv.wifi.d": "Connessione gratuita in tutta la struttura, anche in giardino.",
    "serv.park.t": "Parcheggio privato", "serv.park.d": "Posto auto gratuito all'interno della proprietà.",
    "serv.aria.t": "Aria condizionata", "serv.aria.d": "Clima regolabile in ogni camera, estate e inverno.",
    "serv.giardino.t": "Giardino", "serv.giardino.d": "Uno spazio verde all'aperto per rilassarsi all'ombra.",
    "serv.checkin.t": "Check-in & check-out", "serv.checkin.d": "Check-in 16:00–21:00 · check-out entro le 11:00. Check-in flessibile possibile con chiamata in anticipo.",
    "dove.eyebrow": "Dove siamo", "dove.title": "A Forlì, a due passi dall'autostrada",
    "dove.p": "Ci trovi in Via Zampeschi 109/B, alle porte di Forlì: in pochi minuti raggiungi il casello dell'A14 e il centro città, e in poco più di mezz'ora la costa romagnola.",
    "dist.1": "<strong>5 min</strong> — casello A14 Forlì",
    "dist.2": "<strong>10 min</strong> — centro storico e Piazza Saffi",
    "dist.3": "<strong>10 min</strong> — Aeroporto di Forlì",
    "dist.4": "<strong>35 min</strong> — mare (Cesenatico / Cervia)",
    "map.show": "Mostra la mappa", "map.hint": "Si carica solo al tuo click (Google Maps)",
    "map.aria": "Mostra la mappa (carica Google Maps)", "map.open": "Apri in Google Maps",
    "footer.tag": "Bed & breakfast · Forlì", "footer.contatti": "Contatti", "footer.info": "Informazioni",
    "footer.privacy": "Privacy Policy", "footer.cookie": "Cookie Policy",
    "footer.note": "Nessun cookie di profilazione. La mappa carica Google solo su tua richiesta.",
    "footer.rights": "Tutti i diritti riservati",
    "lb.close": "Chiudi galleria", "lb.prev": "Foto precedente", "lb.next": "Foto successiva",
  },
  en: {
    "title": "b&b La Villa — Bed & Breakfast in Forlì",
    "metaDescription": "b&b La Villa: bed & breakfast in Forlì, minutes from the A14 motorway. Ideal for business travellers — private parking, free Wi-Fi, quiet rooms and a sweet & savoury breakfast.",
    "a11y.skip": "Skip to content",
    "a11y.whatsapp": "Message us on WhatsApp",
    "a11y.email": "Email b&b La Villa",
    "a11y.menuOpen": "Open menu",
    "a11y.menuClose": "Close menu",
    "nav.camere": "Rooms", "nav.villa": "The Villa", "nav.servizi": "Services", "nav.dove": "Location", "nav.contatti": "Contact",
    "cta.book": "Book now", "cta.check": "Check availability", "cta.check2": "Check availability", "cta.datefree": "Free dates?",
    "contact.whatsapp": "WhatsApp: +39 335 592 5880",
    "villa.eyebrow": "The house",
    "villa.title": "Handy for work, quiet for resting",
    "villa.lead": "La Villa is a house on the edge of Forlì, minutes from the A14 exit: the ideal base for those travelling for work who want a quiet night, easy parking and a real breakfast before setting off again.",
    "villa.p2": "Well-kept rooms away from traffic noise, free Wi-Fi and evening check-in on request: everything for those who arrive in the evening and leave early — with the warm welcome of a family that knows the area.",
    "camere.eyebrow": "The rooms", "camere.title": "The Rooms",
    "camere.sub": "Three quiet double rooms, all with private bathroom, air conditioning and Wi-Fi.",
    "cam.deluxe.name": "Deluxe Double",
    "cam.deluxe.meta": "One French-size double bed · <span class=\"guests\">2 guests · no balcony</span>",
    "cam.deluxe.desc": "The cosiest one: simple and bright, perfect for a work night.",
    "cam.deluxe.aria": "Open the gallery — Deluxe Double",
    "cam.balcone.name": "Deluxe with Balcony",
    "cam.balcone.meta": "One double bed · <span class=\"guests\">2 guests</span>",
    "cam.balcone.desc": "With a private balcony over the quiet garden: fresh air the moment you wake up.",
    "cam.balcone.aria": "Open the gallery — Deluxe with Balcony",
    "cam.giardino.name": "Garden View",
    "cam.giardino.meta": "One double bed · <span class=\"guests\">2 guests</span>",
    "cam.giardino.desc": "Windows onto the green: the quietest room, ideal for real rest.",
    "cam.giardino.aria": "Open the gallery — Garden View",
    "serv.eyebrow": "The essentials, done well", "serv.title": "Services",
    "serv.colazione.t": "Breakfast included", "serv.colazione.d": "Sweet and savoury breakfast, served every morning.",
    "serv.wifi.t": "Free Wi-Fi", "serv.wifi.d": "Free connection throughout the property, garden included.",
    "serv.park.t": "Private parking", "serv.park.d": "Free parking space within the property.",
    "serv.aria.t": "Air conditioning", "serv.aria.d": "Adjustable climate in every room, summer and winter.",
    "serv.giardino.t": "Garden", "serv.giardino.d": "A green outdoor space to relax in the shade.",
    "serv.checkin.t": "Check-in & check-out", "serv.checkin.d": "Check-in 4:00–9:00 pm · check-out by 11:00 am. Flexible check-in possible if you call ahead.",
    "dove.eyebrow": "Where we are", "dove.title": "In Forlì, minutes from the motorway",
    "dove.p": "You'll find us at Via Zampeschi 109/B, on the edge of Forlì: minutes from the A14 exit and the city centre, and just over half an hour from the Riviera.",
    "dist.1": "<strong>5 min</strong> — A14 Forlì exit",
    "dist.2": "<strong>10 min</strong> — old town and Piazza Saffi",
    "dist.3": "<strong>10 min</strong> — Forlì Airport",
    "dist.4": "<strong>35 min</strong> — the sea (Cesenatico / Cervia)",
    "map.show": "Show the map", "map.hint": "Loads only when you click (Google Maps)",
    "map.aria": "Show the map (loads Google Maps)", "map.open": "Open in Google Maps",
    "footer.tag": "Bed & breakfast · Forlì", "footer.contatti": "Contact", "footer.info": "Information",
    "footer.privacy": "Privacy Policy", "footer.cookie": "Cookie Policy",
    "footer.note": "No profiling cookies. The map loads Google only at your request.",
    "footer.rights": "All rights reserved",
    "lb.close": "Close gallery", "lb.prev": "Previous photo", "lb.next": "Next photo",
  },
  de: {
    "title": "b&b La Villa — Bed & Breakfast in Forlì",
    "metaDescription": "b&b La Villa: Bed & Breakfast in Forlì, wenige Minuten von der Autobahn A14. Ideal für Geschäftsreisende — privater Parkplatz, kostenloses WLAN, ruhige Zimmer und ein süßes & herzhaftes Frühstück.",
    "a11y.skip": "Zum Inhalt springen",
    "a11y.whatsapp": "Schreib uns auf WhatsApp",
    "a11y.email": "b&b La Villa eine E-Mail schreiben",
    "a11y.menuOpen": "Menü öffnen",
    "a11y.menuClose": "Menü schließen",
    "nav.camere": "Zimmer", "nav.villa": "Die Villa", "nav.servizi": "Ausstattung", "nav.dove": "Lage", "nav.contatti": "Kontakt",
    "cta.book": "Buchen", "cta.check": "Verfügbarkeit prüfen", "cta.check2": "Verfügbarkeit prüfen", "cta.datefree": "Freie Termine?",
    "contact.whatsapp": "WhatsApp: +39 335 592 5880",
    "villa.eyebrow": "Das Haus",
    "villa.title": "Praktisch für die Arbeit, ruhig zum Ausruhen",
    "villa.lead": "La Villa ist ein Haus am Rande von Forlì, nur wenige Minuten von der A14-Ausfahrt: die ideale Basis für Geschäftsreisende, die eine ruhige Nacht, bequemes Parken und ein richtiges Frühstück vor der Weiterfahrt suchen.",
    "villa.p2": "Gepflegte Zimmer fernab vom Verkehrslärm, kostenloses WLAN und Check-in am Abend auf Anfrage: alles für alle, die abends ankommen und früh wieder aufbrechen — mit der herzlichen Gastfreundschaft einer ortskundigen Familie.",
    "camere.eyebrow": "Die Zimmer", "camere.title": "Die Zimmer",
    "camere.sub": "Drei ruhige Doppelzimmer, alle mit eigenem Bad, Klimaanlage und WLAN.",
    "cam.deluxe.name": "Deluxe-Doppelzimmer",
    "cam.deluxe.meta": "Ein französisches Doppelbett · <span class=\"guests\">2 Gäste · ohne Balkon</span>",
    "cam.deluxe.desc": "Das gemütlichste Zimmer: schlicht und hell, ideal für eine Arbeitsnacht.",
    "cam.deluxe.aria": "Galerie öffnen — Deluxe-Doppelzimmer",
    "cam.balcone.name": "Deluxe mit Balkon",
    "cam.balcone.meta": "Ein Doppelbett · <span class=\"guests\">2 Gäste</span>",
    "cam.balcone.desc": "Mit privatem Balkon zur ruhigen Seite: frische Luft direkt nach dem Aufwachen.",
    "cam.balcone.aria": "Galerie öffnen — Deluxe mit Balkon",
    "cam.giardino.name": "Gartenblick",
    "cam.giardino.meta": "Ein Doppelbett · <span class=\"guests\">2 Gäste</span>",
    "cam.giardino.desc": "Fenster ins Grüne: das ruhigste Zimmer, ideal zum echten Ausruhen.",
    "cam.giardino.aria": "Galerie öffnen — Gartenblick",
    "serv.eyebrow": "Das Nötige, gut gemacht", "serv.title": "Ausstattung",
    "serv.colazione.t": "Frühstück inklusive", "serv.colazione.d": "Süßes und herzhaftes Frühstück, jeden Morgen serviert.",
    "serv.wifi.t": "Kostenloses WLAN", "serv.wifi.d": "Kostenlose Verbindung im ganzen Haus, auch im Garten.",
    "serv.park.t": "Privatparkplatz", "serv.park.d": "Kostenloser Stellplatz auf dem Grundstück.",
    "serv.aria.t": "Klimaanlage", "serv.aria.d": "Regelbare Temperatur in jedem Zimmer, Sommer wie Winter.",
    "serv.giardino.t": "Garten", "serv.giardino.d": "Eine grüne Außenfläche zum Entspannen im Schatten.",
    "serv.checkin.t": "Check-in & Check-out", "serv.checkin.d": "Check-in 16:00–21:00 Uhr · Check-out bis 11:00 Uhr. Flexibler Check-in nach vorheriger telefonischer Absprache möglich.",
    "dove.eyebrow": "Wo wir sind", "dove.title": "In Forlì, wenige Minuten von der Autobahn",
    "dove.p": "Sie finden uns in der Via Zampeschi 109/B am Rande von Forlì: wenige Minuten von der A14-Ausfahrt und dem Stadtzentrum, und gut eine halbe Stunde von der Adriaküste.",
    "dist.1": "<strong>5 Min.</strong> — Autobahnausfahrt A14 Forlì",
    "dist.2": "<strong>10 Min.</strong> — Altstadt und Piazza Saffi",
    "dist.3": "<strong>10 Min.</strong> — Flughafen Forlì",
    "dist.4": "<strong>35 Min.</strong> — Meer (Cesenatico / Cervia)",
    "map.show": "Karte anzeigen", "map.hint": "Wird erst beim Klick geladen (Google Maps)",
    "map.aria": "Karte anzeigen (lädt Google Maps)", "map.open": "In Google Maps öffnen",
    "footer.tag": "Bed & breakfast · Forlì", "footer.contatti": "Kontakt", "footer.info": "Informationen",
    "footer.privacy": "Datenschutz", "footer.cookie": "Cookie-Richtlinie",
    "footer.note": "Keine Profiling-Cookies. Die Karte lädt Google nur auf Ihre Anfrage.",
    "footer.rights": "Alle Rechte vorbehalten",
    "lb.close": "Galerie schließen", "lb.prev": "Vorheriges Foto", "lb.next": "Nächstes Foto",
  },
};


/* ============================================================
   2) AVVIO
   ============================================================ */
let LANG = detectLang();
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Enhancements che NON dipendono da Motion: partono sempre.
setYear();
applyWhatsApp();
applyBooking();
applyCamere();
initMenu();
initScrollUI();
initGallery();
initMap();
initI18n();        // imposta la lingua e applica tutti i testi (+ applyScenes)

// Scrollytelling e reveal: richiedono Motion. Import in try/catch.
(async () => {
  let motion = null;
  try {
    motion = await import(MOTION_URL);
  } catch (err) {
    console.warn("[La Villa] Motion non caricato — versione statica.", err);
    return;
  }
  document.documentElement.classList.add("js-scrollytelling");
  if (!reduceMotion) {
    initHero(motion);
    initStagger(motion);
  }
})();


/* ============================================================
   3) i18n
   ============================================================ */
function detectLang() {
  let stored = null;
  try { stored = localStorage.getItem("lang"); } catch (e) {}
  if (stored && TRANSLATIONS[stored]) return stored;
  const nav = (navigator.language || "it").slice(0, 2).toLowerCase();
  return TRANSLATIONS[nav] ? nav : "it";
}

function t(key) {
  return (TRANSLATIONS[LANG] && TRANSLATIONS[LANG][key]) || TRANSLATIONS.it[key] || key;
}

/* Testo multilingua da un oggetto { it, en, de }. */
function L(obj) {
  return (obj && (obj[LANG] || obj.it)) || "";
}

function setLang(lang) {
  if (!TRANSLATIONS[lang]) lang = "it";
  LANG = lang;
  try { localStorage.setItem("lang", lang); } catch (e) {}

  document.documentElement.lang = lang;
  document.title = t("title");

  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll("[data-i18n-meta]").forEach((el) => { el.setAttribute("content", t(el.dataset.i18nMeta)); });
  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    el.dataset.i18nAttr.split(";").forEach((pair) => {
      const [attr, key] = pair.split(":");
      if (attr && key) el.setAttribute(attr.trim(), t(key.trim()));
    });
  });

  applyScenes(); // ri-renderizza i testi della hero nella lingua attiva

  // Etichette del lightbox (se già creato)
  const lb = document.querySelector(".lightbox");
  if (lb) {
    const set = (sel, k) => { const e = lb.querySelector(sel); if (e) e.setAttribute("aria-label", t(k)); };
    set(".lb-close", "lb.close"); set(".lb-prev", "lb.prev"); set(".lb-next", "lb.next");
  }
  // Menu toggle (stato chiuso)
  const mt = document.querySelector(".menu-toggle");
  if (mt && mt.getAttribute("aria-expanded") !== "true") mt.setAttribute("aria-label", t("a11y.menuOpen"));

  // Bottoni lingua
  document.querySelectorAll("[data-lang]").forEach((b) => {
    const on = b.dataset.lang === lang;
    b.setAttribute("aria-pressed", String(on));
    b.classList.toggle("is-active", on);
  });
}

function initI18n() {
  document.querySelectorAll("[data-lang]").forEach((b) => {
    b.addEventListener("click", () => setLang(b.dataset.lang));
  });
  setLang(LANG);
}


/* ============================================================
   4) FUNZIONI
   ============================================================ */

function setYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = new Date().getFullYear();
}

/* Applica WHATSAPP_URL a tutti i link [data-whatsapp]. */
function applyWhatsApp() {
  if (!WHATSAPP_URL) return;
  document.querySelectorAll("[data-whatsapp]").forEach((a) => {
    a.href = WHATSAPP_URL; a.target = "_blank"; a.rel = "noopener";
  });
}

/* Applica la destinazione ai CTA [data-booking]: BOOKING_URL o, se vuoto, WhatsApp. */
function applyBooking() {
  const url = BOOKING_URL || WHATSAPP_URL;
  if (!url) return;
  const external = /^https?:\/\//i.test(url);
  document.querySelectorAll("[data-booking]").forEach((a) => {
    a.href = url;
    if (external) { a.target = "_blank"; a.rel = "noopener"; }
  });
}

/* Mappa Google caricata SOLO al click (nessuna richiesta a Google prima). */
function initMap() {
  const wrap = document.querySelector("[data-map]");
  const btn = wrap && wrap.querySelector("[data-map-load]");
  if (!wrap || !btn || !MAP_EMBED) return;
  btn.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = MAP_EMBED;
    iframe.title = "Mappa — b&b La Villa, Via Zampeschi 109/B, Forlì";
    iframe.loading = "lazy";
    iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    iframe.setAttribute("allowfullscreen", "");
    wrap.innerHTML = "";
    wrap.appendChild(iframe);
    wrap.classList.add("is-loaded");
  }, { once: true });
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
      eyebrow.append(span, document.createTextNode(" " + L(cfg.eyebrow)));
    }
    const title = el.querySelector(".scene-title");
    if (title) title.textContent = L(cfg.title);
    const text = el.querySelector(".scene-text");
    if (text) text.textContent = L(cfg.text);
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
      '<button class="lb-close" type="button">×</button>' +
      '<button class="lb-nav lb-prev" type="button">‹</button>' +
      '<figure class="lb-figure"><img class="lb-img" alt=""></figure>' +
      '<button class="lb-nav lb-next" type="button">›</button>' +
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
  // etichette accessibili (aggiornate anche da setLang)
  closeBtn.setAttribute("aria-label", t("lb.close"));
  prevBtn.setAttribute("aria-label", t("lb.prev"));
  nextBtn.setAttribute("aria-label", t("lb.next"));

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
    thumbsEl.querySelectorAll(".lb-thumb").forEach((tb, k) => tb.classList.toggle("is-current", k === i));
    if (photos.length > 1) { preload(i + 1); preload(i - 1); }
  };

  const buildThumbs = () => {
    thumbsEl.innerHTML = "";
    if (photos.length < 2) return;
    photos.forEach((ph, k) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "lb-thumb"; b.setAttribute("aria-label", (LANG === "it" ? "Foto " : "Photo ") + (k + 1));
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
    photos = cam.photos; camName = L(cam.name);
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
  const links = [...overlay.querySelectorAll("a, [data-lang]")];
  let open = false;

  const setOpen = (v) => {
    open = v;
    overlay.classList.toggle("is-open", v);
    btn.setAttribute("aria-expanded", String(v));
    btn.setAttribute("aria-label", v ? t("a11y.menuClose") : t("a11y.menuOpen"));
    document.body.style.overflow = v ? "hidden" : "";
    if (v) (links[0] || overlay).focus?.();
    else btn.focus();
  };

  btn.addEventListener("click", () => setOpen(!open));
  overlay.addEventListener("click", (e) => { if (e.target === overlay) setOpen(false); });
  // chiudi al click sui link di navigazione (non sui bottoni lingua)
  overlay.querySelectorAll(".menu-list a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
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
    const bottom = hero.getBoundingClientRect().bottom;
    if (header) header.classList.toggle("is-transparent", bottom > headerH + 4);
    if (bar) bar.classList.toggle("is-visible", bottom < window.innerHeight * 0.85);
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
}

/* Hero scrollytelling: crossfade delle scene guidato dal progresso di scroll.
   Il crossfade si completa all'85% del tratto in cui la hero resta "pinned",
   così l'ultima scena è piena mentre la hero è ancora ferma. */
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
    const t2 = progress * (N - 1);
    const active = Math.min(N - 1, Math.max(0, Math.round(t2)));
    for (let i = 0; i < N; i++) {
      const d = Math.abs(t2 - i);
      const dClamped = Math.min(d, 1);
      const op = Math.max(0, 1 - d);
      scenes[i].style.opacity = op.toFixed(3);
      scenes[i].classList.toggle("is-active", i === active);
      if (medias[i]) medias[i].style.transform = `scale(${(1 + 0.05 * dClamped).toFixed(4)})`;
      if (bodies[i]) {
        const y = Math.max(-1, Math.min(1, i - t2)) * 18;
        bodies[i].style.transform = `translateY(${y.toFixed(1)}px)`;
      }
    }
    dashes.forEach((el, i) => el.classList.toggle("is-active", i === active));
  };

  render(0);
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
