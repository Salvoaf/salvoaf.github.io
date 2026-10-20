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

- `images/profile.png`: ritratto già presente nel repository (verificare se coincide con la foto LinkedIn desiderata; sostituire solo quando disponibile l'originale autorizzato in alta risoluzione).
- `documents/cv.pdf`: CV.
- `documents/embodying-swarm-coordination.pdf`: pubblicazione scientifica.

## Note editoriali

- Non sono stati inventati nomi di startup, clienti, fatturati o risultati quantitativi.
- Le descrizioni dei progetti sono di livello sintetico per non diffondere informazioni riservate.
- Verificare il testo finale e i collegamenti prima di fare merge su `main`.
- Contatti: `salvoaranciofebbo@gmail.com`; LinkedIn: https://www.linkedin.com/in/salvatore-arancio-febbo-43b61a180/

## Anteprima locale

Aprire `index.html` direttamente nel browser oppure usare `python -m http.server 8000` dalla root e visitare http://localhost:8000.
