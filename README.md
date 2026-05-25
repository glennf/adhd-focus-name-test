# ADHD/Fokus App — Navnetest

Datadrevet navnevalg for en voice-first fokusapp som gjør rotete tale om til struktur, prioritet og neste steg.

## Hva dette er

Dette repoet inneholder første statiske landingsside/testside for navnevalidering. Målet er å teste navn som:

- Klaro
- HodeRo
- Neste
- TankeFlyt
- FokusFlyt
- Lumo

Siden lagrer navnetest-svar i Google Sheets via et Vercel API-endepunkt, med lokal `localStorage`-backup i nettleseren hvis innsendingen feiler.

## Live-lenker

- Canonical testside: https://navnetest.datasmie.no/
- Vercel fallback: https://adhd-focus-name-test.vercel.app/
- GitHub Pages fallback: https://glennf.github.io/adhd-focus-name-test/
- Google Sheet for responser: https://docs.google.com/spreadsheets/d/1yX8FdD74uH8sKBObjVsaQ9zL856JM8rs2LE89ycD_dY/edit

## Testkriterier

Navnene bør vurderes på:

1. Forståelse — skjønner folk hva appen gjør?
2. Emosjon — gir navnet ro, tillit og lav skam?
3. Recall — husker folk navnet senere?
4. Stavbarhet — kan folk skrive det riktig etter å ha hørt det?
5. Distinkthet — skiller det seg fra task managers og AI-notatverktøy?
6. Søkbarhet — kan vi eie navnet i søk, domene, App Store og varemerke?

## Lokal kjøring

Åpne `index.html` direkte i nettleser, eller kjør en enkel lokal server:

```bash
python3 -m http.server 4173
```

Deretter: http://localhost:4173

## Vercel

Dette prosjektet er deployet på Vercel som statisk side.

- Production URL: https://navnetest.datasmie.no/
- Vercel fallback URL: https://adhd-focus-name-test.vercel.app/
- GitHub Pages fallback: https://glennf.github.io/adhd-focus-name-test/
- Google Sheet responses: https://docs.google.com/spreadsheets/d/1yX8FdD74uH8sKBObjVsaQ9zL856JM8rs2LE89ycD_dY/edit

Prosjektoppsett:

- Framework Preset: `Other`
- Build Command: tomt
- Output Directory: `.`
- Install Command: tomt
- Root Directory: `.`

Se også: [`docs/vercel-deploy.md`](docs/vercel-deploy.md)

## Neste steg

- Legge inn analytics/event tracking.
- Lage variant-URL-er per navn (`?variant=klaro`, `?variant=hodero`, osv.).
- Rydde test-/verifiseringsrader fra Google Sheet før ekstern deling hvis du vil ha helt rent datasett.
- Kjøre recall-test etter 10 min / 24 timer.
- Lage annonse-/landingssidevarianter for topp 2–3 navn.

## Notion

Prosjektnotat: https://www.notion.so/ADHD-Fokus-App-Voice-first-brain-dump-organisering-36b3fac2d68a81eabf31ebfd379da922
