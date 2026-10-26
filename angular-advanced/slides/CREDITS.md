# Credits

Third-party work in the slides tool and the deck, and the terms it comes under. Libraries installed by npm carry their own license files in `node_modules/`; the production build collects them into `dist/slides/3rdpartylicenses.txt`.

## In the tool

| What | Where | License |
|------|-------|---------|
| Angular, RxJS, tslib | npm | MIT, Apache-2.0, 0BSD |
| reveal.js 6 | npm | MIT |
| highlight.js 10.0.3 | npm | BSD-3-Clause |
| Overpass 2.0 webfonts, Red Hat and Delve Fonts | `src/fonts/overpass/` (vendored, with `OFL.txt`) | SIL Open Font License 1.1 |
| IBM Plex Sans and Mono (editor) | npm `@fontsource/ibm-plex-*` | SIL Open Font License 1.1 |
| Dark code colors: Seti syntax palette, Jesse Weed | `src/theme/code-dark.css` | MIT |
| Monokai code colors: Wimer Hazenberg, via highlight.js's monokai style | `src/theme/code-monokai.css` | BSD-3-Clause |

Build and test tools (Angular CLI, Vitest, Playwright and their dependencies) are development-only and are not part of what the tool serves.

## In the slides

Most images are our own screenshots and drawings (`working-with-signals-graph.svg`, `guards-shield.svg` and `you-are-already-testing-browser.svg` were drawn for this deck). These come from others; the slides that show them carry a credit line, and the last slide (`courses/state-management/slides/credits.html`) lists them with the trademark notice:

| What | Where | Terms |
|------|-------|-------|
| Architecture icon from onlinewebfonts.com | `courses/components/slides/images/angular-architecture-*.svg` | CC BY 3.0: credit "Icon from onlinewebfonts.com" |
| Emoji from Twemoji, Twitter | `courses/signals/slides/images/signals-2.svg` | CC BY 4.0: credit "Twemoji by Twitter" |
| Logos of Angular, RxJS, NgRx, NGXS, Jasmine, Karma, Vitest | various `images/` | Trademarks of their owners, shown to name the tools |
