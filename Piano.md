# Piano.md — Sito vetrina b&bLaVilla

## Contesto

**b&bLaVilla** è un bed & breakfast a **Forlì** (Emilia-Romagna), vicino all'autostrada.
Serve un **sito vetrina** (one-page) che valorizzi le foto e la struttura. Nessun
sistema di prenotazione: la prenotazione sarà un **link/widget esterno** (booking engine,
oppure WhatsApp/telefono nel frattempo) da integrare dopo, tramite una singola costante `BOOKING_URL`.

Il pezzo forte è una **hero scroll-driven (scrollytelling)** con 4 scene in crossfade.
Il sito deve sembrare fatto da un'agenzia, non un template: design deliberato, foto protagoniste, testo scarno e ben scritto.

Camere note (dalla scheda Booking, contenuto iniziale della sezione Camere):
1. **Camera Matrimoniale Deluxe** — 1 letto matrimoniale alla francese — 2 ospiti
2. **Camera Matrimoniale Deluxe con Balcone** — 1 letto matrimoniale — 2 (+1) ospiti
3. **Camera Matrimoniale con Vista Giardino** — 1 letto matrimoniale — 2 ospiti

## Decisioni prese

- **Tipo**: sito one-page; le voci di menu sono ancore alle sezioni.
- **Lingua**: solo italiano ora (i18n/EN aggiungibile dopo).
- **Stack**: HTML + CSS + JS vanilla, mobile-first. Nessun framework, nessun build step.
- **Animazioni**: Motion JS via CDN ESM con **versione fissata** (es. `motion@11.x.x`, non `@latest`), API `scroll()`.
- **Deploy**: GitHub Pages dal branch `main`, cartella root. Commit direttamente su `main` (Pages lo richiede).
- **Font**: Fraunces (display serif) + Manrope (sans testo), **self-hosted** (GDPR, non da Google CDN).
- **Palette**: "Villa di Romagna" (sotto) — niente crema+terracotta generico.
- **Cookie**: nessun tracking/analytics nella demo → **nessun cookie banner**.
- **Hero**: **300vh** sia desktop che mobile (4 schermate a 400vh sono troppe per chi cerca solo un contatto).
- **Contatti**: solo `tel:`/`mailto:`/WhatsApp, **nessun form** (Pages è statico, non invia email) → Privacy minimale (nessun dato raccolto).
- **Testi**: **reali e plausibili**, niente lorem ipsum (la demo va mostrata al cliente). Solo le *immagini* restano placeholder.
- **Indicizzazione**: demo **`noindex`** finché non approvata; SEO/JSON-LD scritti completi comunque.
- **Robustezza**: **progressive enhancement** — il sito funziona pienamente anche se Motion non carica.

## Design system (definito PRIMA del codice)

### Palette — "Villa di Romagna"
Colori caldi e naturali, radicati nel paesaggio romagnolo (cipressi, calce, ottone, salvia).
Deliberatamente lontani dal crema+terracotta da template.

| Token | Hex | Uso |
|---|---|---|
| `--ink` | `#211C16` | testo principale, near-black caldo |
| `--bone` | `#EFE9DE` | sfondo chiaro (calce/pietra) |
| `--sand` | `#E4DAC8` | superfici/card calde |
| `--bosco` | `#2E382F` | verde bosco profondo — header solido, footer, testi forti |
| `--salvia` | `#7E8B76` | verde salvia — dettagli, hover, bordi |
| `--ottone` | `#A87D3D` | ottone/ocra — accento, CTA piene |
| `--ottone-scuro` | `#8C6631` | hover CTA |
| `--velo` | `rgba(33,28,22,0.40)` | overlay gradiente su foto (max 40%) |

Tema chiaro come default. Testo `--ink` su `--bone`; sezioni scure (hero text, footer) usano `--bone`/bianco caldo su `--bosco`.

### Tipografia
- **Display / titoli**: **Fraunces** (variabile, `opsz` alta, `soft`), pesi 300–500, corsivo per occhielli editoriali.
- **Testo / UI**: **Manrope**, pesi 400/500/600.
- *Alternativa se non piace*: Cormorant Garamond + Work Sans.
- **Self-hosted (GDPR)**: scarico solo i `.woff2` dei pesi effettivamente usati in `/assets/fonts/`, servo con `@font-face` e `font-display: swap`. Nessun caricamento da Google Fonts CDN (che trasmetterebbe l'IP dell'utente a server terzi — problematico sotto GDPR per un sito italiano).
- **Scala** (clamp, mobile-first):
  - Hero title: `clamp(2.5rem, 8vw, 5rem)`, line-height ~1.05
  - H2 sezione: `clamp(1.8rem, 4vw, 3rem)`
  - Body: 1–1.125rem, line-height 1.6, misura ~65ch
  - Eyebrow/occhiello: 0.8rem, `letter-spacing: 0.15em`, uppercase, Manrope 600, colore `--ottone`

### Spaziatura & layout
- Base 8px. Sezioni: padding verticale `clamp(5rem, 12vh, 9rem)`.
- Contenitore max-width ~1200px, gutter laterali generosi.
- Gerarchia chiara, molta aria, asimmetria voluta (testo a destra su hero, foto full-bleed).

### Come evito il "look da template" (checklist anti-generico)
- Niente hero centrato con overlay nero pieno + bottone piatto.
- Contrasto tipografico forte: display serif grande + eyebrow spaziato in ottone.
- Asimmetria e foto a tutta pagina, non card con box-shadow generiche.
- Micro-dettagli d'autore: indicatore a trattini, filetti in ottone, numerazione scene "01–04".
- Palette specifica e coerente (filtro CSS uniforme sulle foto).
- Verifica finale a occhio prima di consegnare: se somiglia a un template Bootstrap, si rivede.

## Struttura file

```
/index.html
/css/style.css
/js/main.js          # module: import Motion (versione fissata); costanti SCENES + BOOKING_URL; init animazioni
/assets/img/         # placeholder: hero (esterno, camera, colazione, giardino), camere/*, dove-siamo
/assets/img/og-image.jpg   # 1200x630 per anteprima social/WhatsApp
/assets/fonts/       # Fraunces + Manrope self-hosted (.woff2, solo pesi usati)
/assets/icons/       # svg servizi, social, telefono, mail
/assets/favicon/     # favicon.ico, apple-touch-icon.png, icone PWA
/site.webmanifest    # manifest per favicon/PWA
/privacy.html        # Privacy Policy minimale (nessun dato raccolto)
/robots.txt          # Disallow: / finché la demo non è approvata
/.nojekyll           # evita il processing Jekyll su GitHub Pages
/README.md
/Piano.md            # questo documento
```

## Struttura pagina (sezioni)

### 1. Header (fisso)
- Trasparente sopra la hero → **solido con blur** al primo scroll (soglia ~40px). Solo `background`/`backdrop-filter`/colore in transizione.
- Sinistra: logo/nome B&B. Destra: **menu a panino** (mobile *e* desktop, stile boutique) + **CTA "Prenota"** (outline sulla hero, pieno dopo lo scroll).
- Contatti rapidi cliccabili: telefono (`tel:`) ed email (`mailto:`) con icone.
- Menu aperto (overlay): Camere · La Villa · Servizi · Dove Siamo · Contatti.

### 2. Hero scroll-driven (scrollytelling) — pezzo forte
- Contenitore alto **300vh** (desktop e mobile); contenuto interno `position: sticky; top: 0; height: 100svh` (fallback per la barra URL di iOS) con `100dvh` dove serve.
- **Progressive enhancement**: di default (senza JS) le 4 scene sono **impilate e leggibili** in scroll normale. Il JS aggiunge `.js-scrollytelling` all'`<html>` **solo dopo** che Motion è importato con successo (import in `try/catch`); solo quella classe attiva lo sticky e il crossfade. Se Motion non carica, il sito resta pienamente funzionante in versione statica.
- Sfondo: foto full-bleed. A destra: blocco testo (titolo breve + 1–2 righe).
- **4 scene**: (1) esterno villa, (2) camera, (3) colazione/sala comune, (4) giardino/vista.
- Transizioni collegate al progresso di scroll con Motion `scroll()`:
  - Foto in **crossfade** (opacity), mai taglio netto.
  - Testo: fade + `translateY(20px)` in entrata/uscita.
  - Foto attiva con **scale 1.05 → 1** per profondità.
  - Anima **solo `transform` e `opacity`**.
- **Indicatore di progresso** discreto a lato: 4 trattini, quello attivo si allunga.
- Numerazione scena "01–04" come dettaglio editoriale.
- `prefers-reduced-motion`: scene mostrate statiche, senza animazione/scale.

### 3. Sezioni successive (scroll normale)
- **Le camere**: griglia editoriale, foto + descrizione breve (le 3 camere sopra). Animazione d'entrata al viewport (fade + `translateY`, con **stagger**) via `inView`/`scroll`.
- **Servizi**: icone SVG + testo, layout pulito.
- **Dove siamo**: foto della zona/mappa statica + testo sui dintorni (Forlì, vicinanza autostrada).
- **CTA prenotazione** grande a fine sezione camere.

### 4. Footer
- Contatti completi: indirizzo, telefono, email. Link social.
- **Solo Privacy Policy minimale** (il sito non raccoglie dati: nessun form, solo `tel:`/`mailto:`/WhatsApp) + nota "Questo sito non utilizza cookie di profilazione." Niente Cookie Policy/Termini né banner.
- **CIN** (Codice Identificativo Nazionale, obbligatorio): placeholder **evidentemente finto** `CIN: DA DEFINIRE` (mai un numero plausibile).
- Copyright. CTA "Prenota".

## Call to Action — 4 punti + destinazione configurabile
Unica costante `BOOKING_URL` all'inizio di `main.js`, usata da tutti e 4 i punti:
1. **Header** (accanto al menu): outline sulla hero, pieno dopo lo scroll.
2. **Fine sezione camere**: grande, centrato, con occhiello sopra. Testo "Verifica disponibilità".
3. **Barra fissa in basso — solo mobile**: appare **quando l'utente supera la sezione hero (fine dei 300vh)** con fade-in, telefono (icona) a sinistra + "Prenota" a destra. Sfondo con blur, rispetta `safe-area-inset-bottom`; `body` con `padding-bottom` per non coprire contenuto.
4. **Footer**.

Testo base "Prenota"; variante "Verifica disponibilità" nel punto 2. Finché `BOOKING_URL` non è definito, punterà a `tel:`/WhatsApp come fallback.

## Gestione foto
- **Config centralizzata** in `main.js`: `const SCENES = [{ img, imgMobile, title, text, objectPosition, alt }, ...]` (+ analogo per le camere). Un commento chiaro spiega come sostituire foto e testi. Nessun path sparso nell'HTML.
- Overlay a **gradiente** (nero→trasparente, opacità max 40%) sul lato del testo, per leggibilità e uniformità.
- `object-fit: cover` + `object-position` regolabile per foto, per correggere inquadrature senza ri-croppare.
- **Filtro CSS uniforme** su tutte le foto: `saturate(1.05) contrast(1.03)` per coerenza visiva.
- Varianti crop **mobile (verticale) / desktop (orizzontale)** via `<picture>`/`srcset` o campo `imgMobile`.
- `loading="lazy"` su tutte tranne la prima (LCP); immagini responsive.

### Ottimizzazione immagini (critico per la demo mobile)
- Tutte le foto in **WebP** con **fallback JPEG** via `<picture>`.
- Larghezza max **1920px** desktop / **900px** mobile, qualità **80**.
- `<link rel="preload">` sulla **prima immagine della hero** (LCP).
- Budget: **nessuna immagine sopra i 300KB**; obiettivo prima schermata utilizzabile **< 2s in 4G**.

## SEO & metadata (skill `fixing-metadata`)
- `<title>` e `meta description` ottimizzati per **ricerca locale** ("B&B a Forlì" e varianti).
- **Open Graph + Twitter card** complete, con `og:image` dedicata (`/assets/img/og-image.jpg`, 1200×630, foto migliore della villa) — per l'anteprima quando il link è condiviso su **WhatsApp**.
- **Favicon completa**: `favicon.ico` + `apple-touch-icon` + `site.webmanifest`.
- **Canonical URL**.
- **JSON-LD** structured data, schema **`BedAndBreakfast`**: `name`, `address`, `telephone`, `geo` (coordinate), `priceRange`, `amenityFeature` (dai servizi).
- `lang="it"` sull'`<html>` e attributi **`hreflang`** predisposti per la futura versione EN.

### Demo non indicizzabile (finché non approvata dal cliente)
- `<meta name="robots" content="noindex, nofollow">` nell'`<head>`.
- `robots.txt` con `Disallow: /`.
- Il markup SEO/JSON-LD resta **scritto completo** (serve mostrarlo al cliente), ma il sito non è indicizzabile finché non approvato/pubblicato in produzione.
- **Commento nel codice** che segnala di rimuovere il `noindex` al go-live.

## Performance & accessibilità
- Solo `transform`/`opacity` animati (mai `top/left/width/height`).
- `100svh` come base per lo sticky (evita i salti dovuti alla barra URL di iOS Safari), `100dvh` dove appropriato; `env(safe-area-inset-*)` per iPhone.
- `<link rel="preload">` sulla prima immagine hero; immagini WebP entro budget (≤300KB).
- `prefers-reduced-motion` rispettato ovunque.
- HTML semantico, `alt` su tutte le immagini, focus states visibili, menu accessibile da tastiera, target touch ≥44px.
- Nessun blocco render: Motion caricato come modulo async, font self-hosted con `font-display: swap`.

## Passata finale di qualità (prima della consegna)
- **`fixing-metadata`**: applicata durante la costruzione dei meta (vedi sopra) e verificata a fine lavoro.
- **`fixing-accessibility`**: revisione contrasti, navigazione da tastiera, focus, ARIA del menu/overlay, `alt`.
- **`fixing-motion-performance`**: verifica che le animazioni scroll-driven non causino layout thrashing (solo compositing, niente reflow), e reggano su mobile.

## Deploy — GitHub Pages
- Commit su `main`, cartella **root**. File `.nojekyll` presente.
- Attivazione Pages: Settings → Pages → Source "Deploy from a branch" → `main` / `root`.
  (L'attivazione delle Pages potrebbe richiedere un tuo click nelle impostazioni del repo se i permessi dell'app non bastano — te lo indico.)

## Cosa mi serve da te (dopo, per il contenuto reale)
- Foto reali (le sostituisco ai placeholder aggiornando solo `SCENES`/config camere).
- Testi definitivi (titoli hero, descrizioni), dati contatto (indirizzo, tel, email), profili social.
- `BOOKING_URL` quando definito (o preferenza WhatsApp/telefono nel frattempo).
- Numero **CIN** reale, geo-coordinate e `priceRange` per il JSON-LD.
- Immagine OG (o mi indichi quale foto usare per l'anteprima 1200×630).
- **Test su iPhone fisico**: dal mio ambiente in cloud posso verificare con l'emulazione mobile di Chromium, ma **non riproduco il comportamento della barra URL di iOS Safari**. Implemento i fallback `svh`/`dvh` correttamente; la verifica finale dello sticky su un iPhone reale resta a te.

## Piano di esecuzione (dopo approvazione)
1. Scaffold repo: `Piano.md`, `.nojekyll`, `robots.txt` (Disallow), struttura cartelle, immagini placeholder **ottimizzate WebP+JPEG** entro budget, **font `.woff2` self-hosted** in `/assets/fonts/`.
2. `index.html`: markup semantico di tutte le sezioni con **testi reali**, scene hero impilate di default (progressive enhancement) + **metadata SEO/OG/JSON-LD `BedAndBreakfast`** (skill `fixing-metadata`), `noindex` demo, favicon, `lang="it"`/hreflang, preload LCP.
3. `css/style.css`: design system (variabili, `@font-face`, scala tipografica), layout mobile-first, componenti, stati header/CTA, filtri/overlay foto, `svh`/safe-area.
4. `js/main.js`: costanti `BOOKING_URL` + `SCENES`, import Motion **versione fissata in `try/catch`**, `.js-scrollytelling` solo a import riuscito, header scroll-state, hero scrollytelling con `scroll()`, stagger camere, barra CTA mobile, guardia `prefers-reduced-motion`.
5. `privacy.html` minimale + nota no-cookie nel footer.
6. **Passata finale**: `fixing-metadata`, `fixing-accessibility`, `fixing-motion-performance`. Verifica anti-template + responsive (Chromium mobile/desktop) + reduced-motion + fallback senza JS.
7. Commit e push su `main`; indicazioni per attivare GitHub Pages e per la verifica su iPhone reale.

## Verifica
- Apertura locale del sito: header trasparente→solido allo scroll; hero che attraversa le 4 scene in crossfade con testo in fade/translate e progress a trattini; camere in stagger al viewport; barra CTA mobile che appare superata la hero (fine 300vh).
- Test responsive a viewport mobile (300vh hero, safe-area, barra CTA) e desktop (300vh hero).
- Test `prefers-reduced-motion: reduce`: scene statiche, nessuna animazione.
- Controllo che tutti e 4 i CTA puntino alla stessa `BOOKING_URL` e che cambiarla in un punto aggiorni tutto.
- Verifica che nessun CTA copra contenuto (padding-bottom su mobile).
- **Fallback senza JS / Motion non caricato**: scene impilate e leggibili, sito pienamente navigabile.
- **SEO/metadata**: `noindex` presente, `robots.txt` con Disallow, JSON-LD valido, OG image corretta (anteprima WhatsApp).
- **Peso**: nessuna immagine >300KB, prima schermata < 2s in 4G (throttling).
- **Da fare a te**: verifica dello sticky hero su **iPhone reale** (barra URL iOS).
