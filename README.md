# Salvatore Arancio Febbo — Personal website

Sito personale statico per GitHub Pages. Nuova versione editoriale orientata a software engineering, AI, collaborazioni freelance e startup.

## Pubblicazione

Il sito funziona direttamente da root su GitHub Pages, senza build, dipendenze o workflow aggiuntivi. I file del sito precedente restano nel branch `main` finché questa proposta non viene approvata e unita.

## Pagine

- `index.html` — Homepage
- `progetti.html` — Ambiti e progetti
- `startup.html` — Visione imprenditoriale
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
- Contatti: `salvoaranciofebbo@gmail.com`; LinkedIn: https://www.linkedin.com/in/salvatore-arancio-febbo-43b61a180/

## Anteprima locale

Aprire `index.html` direttamente nel browser oppure usare `python -m http.server 8000` dalla root e visitare http://localhost:8000.

## Identità visiva 2026 — portrait-led

L'identità visiva prende i colori dalla fotografia professionale: grafite, grigio neutro, porcellana calda e rame sottile. Il design è volutamente sobrio, editorial e centrato sulla figura professionale. I token sono all'inizio di `assets/site.css` e le regole di rifinitura sono raggruppate nella sezione `PORTRAIT-LED EDITORIAL IDENTITY` in fondo al file.
