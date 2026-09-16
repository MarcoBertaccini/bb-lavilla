# GO-LIVE — checklist prima di andare online (b&b La Villa)

> Questa è la checklist per portare il sito **davvero pubblico e indicizzabile** su Google.
> È separata da `Piano.md` (che è il piano di implementazione del sito).
> I passi sono divisi in **Blocco 1 — SUBITO** (non dipende dal dominio) e
> **Blocco 2 — POST ACQUISTO DOMINIO** (richiede il dominio definitivo).

## Context
Il sito è completo e pubblicato in **modalità demo** su `bblavilla.zenith-studio.it`
(GitHub Pages, branch `postincontro`). Oggi è volutamente **invisibile ai motori di ricerca**:

- `robots.txt` = `User-agent: * / Disallow: /` (blocca tutto)
- `<meta name="robots" content="noindex, nofollow">` su `index.html`, `privacy.html`, `cookie.html`

Vincoli decisi col cliente:
- **Dominio ancora da acquistare** (nome non deciso).
- **Email** da creare col dominio.
- **Prenotazioni solo via WhatsApp** (`BOOKING_URL` resta vuoto).
- **Nessun tracciamento** (niente analytics/cookie → nessun banner necessario).
  Google Search Console sì (dà i dati di ricerca senza cookie).

## Stato attuale (verificato nel repo)

| Elemento | Stato oggi | Azione |
|---|---|---|
| `robots.txt` | `Disallow: /` (blocca tutto) | invertire al go-live |
| `noindex,nofollow` | presente su tutte e 3 le pagine | rimuovere al go-live |
| `sitemap.xml` | **assente** | creare (URL col dominio) |
| `CNAME` | `bblavilla.zenith-studio.it` | aggiornare col dominio finale |
| canonical / hreflang / og:url / og:image / twitter:image / JSON-LD `url`+`image` | puntano a `bblavilla.zenith-studio.it` | aggiornare col dominio finale |
| email `info@bblavilla.it` | in mailto + JSON-LD + privacy | confermare/creare col dominio |
| `CIN: DA DEFINIRE` | **visibile in footer** (obbligo di legge) | inserire CIN reale |
| Google Search Console | non configurata | property sul dominio finale |
| `og-image.jpg` (1200×630), favicon completi, `.nojekyll` | presenti ✅ | ok |
| analytics / tracker | assenti ✅ (GDPR-clean) | lasciare così |
| `BOOKING_URL` | vuoto → CTA usano WhatsApp ✅ | lasciare così |

---

## BLOCCO 1 — Li posso fare SUBITO (senza dominio)

### 1. Contenuti e legale
- [ ] **CIN reale**: il cliente fornisce il Codice Identificativo Nazionale; sostituire
  `CIN: DA DEFINIRE` in `index.html` (~riga 402). È un **obbligo di legge** per le strutture
  ricettive: senza, non si va live.
- [ ] **Revisione copy**: far rileggere al cliente i testi IT riposizionati e soprattutto le
  **traduzioni DE** (idealmente un madrelingua).
- [ ] Confermare orari/servizi definitivi (check-in 16–21, check-out 11, Wi-Fi, colazione).

### 2. Qualità tecnica (QA)
- [ ] **Lighthouse / PageSpeed Insights** su desktop e mobile: Performance, Accessibilità,
  Best Practices, SEO. Correggere eventuali segnalazioni.
- [ ] Test su **iPhone reale** (hero scrollytelling, safe-area, barra CTA mobile, menu lingua).
- [ ] Console browser **senza errori**; verifica contrasti header sulle foto.
- [ ] Verifica pesi immagini (budget ≤300KB) e presenza `alt` su tutte.
- [ ] Test anteprima link (Open Graph) — l'`og-image` c'è; ricontrollare dopo il cambio dominio.

### 3. Preparare (ma NON attivare) gli asset SEO di produzione
- [ ] Scrivere la **versione di produzione di `robots.txt`** (pronta, da attivare al go-live):
  ```
  User-agent: *
  Allow: /
  Sitemap: https://IL-DOMINIO/sitemap.xml
  ```
- [ ] Preparare l'edit di **rimozione `noindex`** dalle 3 pagine (da applicare al go-live).
- [ ] Predisporre lo scheletro di **`sitemap.xml`** (home + privacy + cookie); gli URL assoluti
  si completano col dominio.

### 4. Presenza su Google (indipendente dal sito)
- [ ] Creare/preparare l'**account Google** che gestirà Search Console + Profilo attività.
- [ ] **Google Business Profile** (Profilo dell'attività): si può creare/rivendicare ORA con
  indirizzo Via Zampeschi 109/B, categoria "Bed & breakfast", orari, foto, telefono/WhatsApp.
  La verifica (cartolina/telefono) richiede giorni → meglio avviarla subito. Il campo "sito web"
  si aggiornerà col dominio.
- [ ] Preparare gli asset per il profilo (foto camere/esterni, descrizione, contatti).

### 5. Pronti per il go-live tecnico
- [ ] Rivedere l'intera differenza `postincontro` (eventuale **PR verso `main`**) così è pronta
  a fondere al go-live. Decidere la strategia: **fondere `postincontro`→`main` e pubblicare da
  `main`** (consigliato: `main` = produzione), oppure continuare a pubblicare da `postincontro`.

---

## BLOCCO 2 — Li devo fare POST ACQUISTO DOMINIO

### 6. Acquisto e DNS
- [ ] **Acquistare il dominio** dal registrar (es. `bblavilla.it`).
- [ ] Configurare i **DNS per GitHub Pages**:
  - Apex/root (`dominio.it`) → record **A**:
    `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
    (e opzionali **AAAA** IPv6: `2606:50c0:8000::153` … `2606:50c0:8003::153`).
  - `www.dominio.it` → record **CNAME** verso `marcobertaccini.github.io`.

### 7. GitHub Pages
- [ ] Aggiornare il file **`CNAME`** nel repo col dominio finale.
- [ ] In **Settings → Pages**: impostare il **Custom domain**, attendere il check DNS,
  poi attivare **"Enforce HTTPS"** (il certificato può richiedere fino a ~24h).

### 8. Aggiornare tutti gli URL assoluti al dominio finale
File `index.html` (e verifica `privacy.html`/`cookie.html`): aggiornare **canonical**,
**hreflang** (`it` + `x-default`), **og:url**, **og:image**, **twitter:image**, e nel
**JSON-LD** i campi `url` e `image`. Aggiornare **`sitemap.xml`** con gli URL definitivi.

### 9. Email
- [ ] Creare la casella **info@dominio** (o aggiornare l'indirizzo nel sito se diverso):
  `mailto:` nell'header e nel footer, `email` nel JSON-LD, riferimenti in `privacy.html`.

### 10. Attivare l'indicizzazione (IL "go-live" vero e proprio)
- [ ] Sostituire **`robots.txt`** con la versione di produzione (Allow + riga Sitemap).
- [ ] **Rimuovere `<meta name="robots" content="noindex, nofollow">`** da `index.html`
  (le pagine legali `privacy`/`cookie` possono restare `noindex`: scelta minore, consigliato
  indicizzare solo la home).
- [ ] **Go-live**: fondere `postincontro`→`main` (o confermare il branch pubblicato), così il
  dominio serve la versione definitiva. Bump `?v=` per il cache-busting.

### 11. Google Search Console
- [ ] Aggiungere la **property**: preferibile tipo **"Dominio"** con **verifica DNS (record TXT)**
  — copre http/https e www/non-www in un colpo solo. (Alternativa: property "Prefisso URL" con
  verifica via file HTML o meta tag.)
- [ ] **Inviare la sitemap** (`https://dominio/sitemap.xml`).
- [ ] **Controllo URL → Richiedi indicizzazione** per la home.
- [ ] (Opzionale) collegare Search Console al Business Profile.

### 12. Aggiornamenti finali e verifica end-to-end
- [ ] Aggiornare il **sito web nel Google Business Profile** col dominio.
- [ ] Aprire il dominio in **HTTPS**: verificare redirect www↔apex e assenza di "contenuto misto".
- [ ] Test anteprima link su **WhatsApp/social** (Open Graph aggiornato).
- [ ] **Rich Results Test** (JSON-LD `BedAndBreakfast`) e **Mobile-Friendly Test**.
- [ ] Riconfermare che il **CIN** sia visibile (obbligo di legge).

---

## Verifica (come collaudare)
- **Prima del go-live**: PageSpeed/Lighthouse ≥ soglie desiderate; nessun errore console;
  anteprima OG corretta; sito navigabile su mobile reale.
- **Dopo il go-live**: `https://dominio/robots.txt` mostra `Allow: /` + Sitemap; la home
  **non** contiene più `noindex`; Search Console verifica ok e sitemap "Riuscito"; Rich Results
  senza errori; certificato HTTPS attivo.

## Cosa mi serve da te (go-live)
- Il **CIN** reale (per il footer) — necessario a norma di legge.
- La scelta del **dominio** (quando comprato) e se l'**email** sarà `info@<dominio>` o altra.
- Ok a **fondere `postincontro`→`main`** al momento del go-live.
- Accesso o conferma dell'**account Google** per Search Console e Business Profile.
