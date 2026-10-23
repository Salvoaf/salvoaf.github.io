# Salvatore Arancio Febbo — Personal website

Sito personale statico per GitHub Pages. Nuova versione editoriale orientata a software engineering, AI, collaborazioni freelance e startup.

## Pubblicazione

Il sito funziona direttamente da root su GitHub Pages, senza build, dipendenze o workflow aggiuntivi. I file del sito precedente restano nel branch `main` finché questa proposta non viene approvata e unita.

## Pagine

- `index.html` — Homepage
- `progetti.html` — Ambiti e progetti
- `portfolio/index.html` — Portfolio: progetti realizzati con Digimark e ICOSE (stili in `assets/portfolio.css`, loghi in `images/portfolio/`)
- `startup/` — Redirect alla homepage (pagina Startup rimossa a ottobre 2026)
- `chi-sono.html` — Biografia e percorso
- `insights.html` — Ricerca e riflessioni
- `percorso.html` — Redirect per i link precedenti

Stili condivisi: `assets/site.css`. Menu mobile: `assets/site.js`.

## Asset esistenti riutilizzati

- `images/salvatore-portrait.avif`: nuova fotografia professionale fornita dall'utente, ottimizzata per il sito (500 × 625). Il vecchio `images/profile.png` resta come fallback per browser senza supporto AVIF e come immagine social di riserva.
- `documents/cv.pdf`: CV.
- `documents/embodying-swarm-coordination.pdf`: pubblicazione scientifica.

## Note editoriali

- Non sono stati inventati nomi di startup, clienti, fatturati o risultati quantitativi.
- Le descrizioni dei progetti sono di livello sintetico per non diffondere informazioni riservate.
- Verificare il testo finale e i collegamenti prima di fare merge su `main`.
- Contatti: `salvatore@aranciofebbo.it`; LinkedIn: https://www.linkedin.com/in/salvatore-arancio-febbo-43b61a180/

## Anteprima locale

Aprire `index.html` direttamente nel browser oppure usare `python -m http.server 8000` dalla root e visitare http://localhost:8000.

## Identità visiva 2026 — portrait-led

L'identità visiva prende i colori dalla fotografia professionale: grafite, grigio neutro, porcellana calda e rame sottile. Il design è volutamente sobrio, editorial e centrato sulla figura professionale. I token sono all'inizio di `assets/site.css` e le regole di rifinitura sono raggruppate nella sezione `PORTRAIT-LED EDITORIAL IDENTITY` in fondo al file.

## Asset ufficiali (Google Drive, 20 ottobre 2026)

- `images/salvatore-original.png`: ritratto originale 1122 × 1402, usato in Home e Chi sono (sostituisce l'AVIF precedente, di appena 5 KB).
- `images/salvatore-with-background.svg`: SVG sorgente con sfondo (contiene dati raster incorporati).
- `images/salvatore-no-background.svg`: versione SVG sorgente senza sfondo; da verificare nei diversi browser prima dell'uso come trasparenza.
- `images/saf-logo-original.png`: monogramma bronzo originale, usato in header, footer e favicon.

La cartella originali è disponibile su Google Drive; queste copie servono al sito su GitHub Pages, senza dipendere dai permessi di Drive. Gli asset precedenti sono mantenuti per compatibilità e rollback.

## Hero fotografica integrata · 20 ottobre 2026
La homepage usa `images/salvatore-cutout.svg`, un ritratto con maschera trasparente ricostruita dalle immagini incorporate nello SVG originale. La navbar usa `images/saf-mark-clean.svg`, monogramma autentico con fondo trasparente. La pagina Chi sono usa `images/salvatore-original.png` ad alta risoluzione. Tutte le risorse sono locali al repository, senza richieste a Drive. Gli override CSS finali gestiscono il layout integrato e responsive.
