# Changelog

All notable changes to the **Angular Foundation exercises** deck are
documented here. The lecture deck has its own changelog in `../slides`.

## [2026.09] - 2026-09-01

### Tooling

- Added `serve.mjs`: `npm start` serves the deck with live reload, so saving a
  slide refreshes the browser. The reload snippet is added to the HTTP response
  only - `index.html` on disk stays byte-identical for slides.com re-import.
  Watches `index.html`, `foundation-labs/` and `lib/`.
- Added `export-pdf.mjs`: `npm run pdf` renders the deck to
  `exercises-angular-foundation.pdf` by driving reveal's built-in `?print-pdf`
  mode in headless Chrome at the deck's own 1280x720 slide size.
  `npm run pdf:fragments` gives one page per build step.
- Both use `puppeteer-core` against the system Chrome; set `CHROME_PATH` to
  point at a different browser. Run `npm install` once before first use.
