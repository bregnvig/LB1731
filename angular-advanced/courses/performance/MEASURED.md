# Performance: measured log

Re-run: build sizes with `npx ng build` in the step folder (add `--stats-json` for the analyzer); runtime counts in a dev build (`npm start`) in Chromium 156 (Playwright, headless, 1280x800, geolocation granted at 55.6761, 12.5683), counting one "bar" per `ChangeDetectionStart`..`ChangeDetectionEnd` pair from `ng.ɵsetProfiler` and the components whose template ran in that pair (what the Angular DevTools Profiler shows). "Each change alone/cumulative" = a copy of step-3 with only those edits. Measured 2026-10-31, Angular 22.2.3, after the lab changes of that day. Format: claim | step/route | command or clicks | result (all runs).

## Exercise 1: leave the zone

- 10 quiet s, bars | step-1 `/` | `npm start`, wait for the list, record 10 s, no input | 10, 10, 10 bars; each: 6 components, 133 list rows
- 5 s mouse moves, bars | step-1 `/` | record 5 s of mouse moves over the map (about 1 move per 16 ms, 293-296 moves), no clicks | 298, 301, 300, 301 bars; each: 6 components (App, Home, Leaflet, Sidebar, SidebarListItem, Footer), 133 rows
- 5 s mouse moves, bars (after exercise 1) | step-2 `/` | same | 5, 5, 5 bars (the footer's 1 s timer), each still 6 components / 133 rows
- one list click (still in the zone) | step-1 `/` | click the first row, record 3 s | 47, 47, 47 bars (first second after the click: 43, 42, 42)
- one list click (after exercise 1) | step-2 `/` | click the first row, record 3 s | 46, 47, 46 bars (first second: 41, 42, 41); all 6 components / 133 rows each
- milliseconds, mouse | step-1 vs step-2 `/` | CPU 4x slowdown (CDP `Emulation.setCPUThrottlingRate` 4), 5 s mouse moves; ms = sum of ChangeDetectionStart..End; script = CDP `Performance.getMetrics` ScriptDuration delta (dev build, profiler attached) | step-1: 284/282/283 bars, CD 222.9/229.1/232.4 ms, script 243.3/247.3/254.5 ms. step-2: 5/5/5 bars, CD 6.5/6.2/6.2 ms, script 16.0/15.6/13.0 ms. Median: 229 ms -> 6 ms of change detection per 5 s
- milliseconds, list click | step-1 vs step-2 `/` | CPU 4x, one click, 3 s | step-1: CD 103.3/116.0/102.3 ms; step-2: 111.4/148.0/102.0 ms (no difference: exercise 1 does not touch the click path)
- no CPU slowdown, for reference | step-1 vs step-2 | 5 s mouse moves | CD 66.2/70.2/71.5 ms vs 1.6/1.5/2.1 ms

## Exercise 2: zoneless and signals

- polyfills before | step-2 | `npx ng build` | polyfills 35.09 kB raw / 11.52 kB transfer; main 1.53 MB / 357.55 kB; styles 242.57 kB / 25.55 kB; Initial total 1.81 MB (1,810,264 B) / 394.62 kB
- (step-1 build, for reference) | step-1 | `npx ng build` | Initial total 1.81 MB (1,810,215 B) / 394.71 kB
- before: 10 quiet s | step-2 `/` | record 10 s | 10, 10, 10 bars; each 6 components / 133 rows
- before: 5 s mouse | step-2 `/` | as exercise 1 | 5, 5, 5 bars; each 6 / 133
- before: one list click | step-2 `/` | click first row, record 3 s | 46, 47, 46 bars (41, 42, 41 in the first second; the rest are timer bars, about 2 per second after the click)
- state (a): zoneless + footer signal, Eager everywhere | copy of step-2: zone.js out of polyfills, `provideZonelessChangeDetection()`, footer `seconds = signal(0)`, `.set()`, `seconds()`; every `ChangeDetectionStrategy.Eager` kept | 10 quiet s: 10, 10, 10 bars, each 6 components / 133 rows. 5 s mouse: 5, 5, 5 bars, each 6 / 133. One list click, 3 s: 5, 5, 5 bars = 2 from the click (at ~46 ms and ~61 ms) + 3 timer bars; all 6 / 133
- state (b): Eager removed = step-3 | step-3 `/` | same | 10 quiet s: 10, 10, 10 bars, each FooterComponent only (1 component, 0 rows). 5 s mouse: 5, 5, 5 bars, Footer only. One list click, 3 s: 5, 5, 5 bars = 2 from the click (1st: 6 components / 133 rows, the new Home; 2nd: 5 components (no App) / 133 rows) + 3 Footer-only timer bars
- second click, ':id' -> ':id' | step-3 | click row 2 after row 1, 3 s | 4, 4, 4 bars = 1 click bar (6 components, 2 rows) + 3 Footer-only
- second click in state (a) | copy as above | same | 4, 4, 4 bars, all 6 / 133
- polyfills after | step-3 | `npx ng build` | polyfills 494 bytes / 494 bytes; main 1.53 MB / 357.12 kB; Initial total 1.77 MB (1,772,519 B) / 383.17 kB
- 2026-11-03, refreshed vs visited, how counted | step-2, state (a) copy, step-3; dev build `npm start`, Chromium 156 headless shell, setup as in the header | per ChangeDetectionStart..End: "refreshed" = component instances with `TemplateUpdateStart` (2), "visited" = instances with `ComponentEnd` (19), split into the sync pass (inside ChangeDetectionSyncStart..End) and the dev-mode `checkNoChanges` pass that `ApplicationRef.tick` runs after it, inside the same bar; rows = `SidebarListItem` template updates. 3 runs each, every run identical | (see the rows below)
- 2026-11-03, quiet timer bar, step-2 (zone.js) | step-2 `/` | wait for the list, record 10 s | 10, 10, 10 bars; each: sync refreshes 6 components (App, Home, Leaflet, Sidebar, SidebarListItem, Footer) / 133 rows, visits the same 6 / 133; checkNoChanges pass runs the same 6 / 133 again
- 2026-11-03, quiet timer bar, state (a) (zoneless + footer signal, Eager kept) | copy of step-2 as in the state (a) row | same | 10, 10, 10 bars; each: sync refreshes Footer only (1 component, 0 rows) and visits 5 (App, Home, Leaflet, Sidebar, Footer; no rows); checkNoChanges pass then runs all 6 templates / 133 rows (Eager views are checked in that pass). Total template runs in the bar = 6 components / 133 rows, the number the Angular DevTools Profiler shows in a dev build: not a visit count, but 5 of the 6 come from the dev-only check
- 2026-11-03, quiet timer bar, step-3 | step-3 `/` | same | 10, 10, 10 bars; each: sync refreshes Footer only (1, 0 rows), visits 5 (App, Home, Leaflet, Sidebar, Footer); checkNoChanges pass runs no templates. Footer-only in DevTools
- 2026-11-03, first click, state (a) and step-3 | state (a) copy, step-3 | click the first row, record 3 s | both: 5, 5, 5 bars = click bar 1 (sync 6 refreshed / 133 rows), click bar 2 ~15 ms later (sync 5 refreshed, no App / 133 rows; 6 visited) + 3 timer bars as above. state (a) also runs 6 / 133 in checkNoChanges in every bar; step-3 none
- 2026-11-03, first click, step-2 | step-2 `/` | same | 47, 47, 46 bars; each 6 / 133 in sync and again in checkNoChanges
- 2026-11-03, second click (row 2 after row 1) | step-2, state (a) copy, step-3 | click row 2, record 3 s | step-2: 50, 50, 50 bars, each 6 / 133 (both passes). state (a): 4, 4, 4 bars = 1 click bar (sync 6 refreshed / 133 rows, checkNoChanges 6 / 133) + 3 timer bars (sync Footer only, checkNoChanges 6 / 133). step-3: 4, 4, 4 bars = 1 click bar (sync 6 refreshed / 2 rows, 6 visited / 133 rows visited; checkNoChanges none) + 3 Footer-only
- 2026-11-03, what Angular DevTools lists in a bar | angular/angular main @ 37563fc3, `devtools/projects/ng-devtools-backend/src/lib/profiling/profiler/native.ts` and `../capture.ts` | read | components come from `TemplateUpdateStart`/`End` only (`onChangeDetectionStart`/`End`); the `ComponentStart`/`ComponentEnd` handlers are `// todo: implement`. A frame is flushed in a microtask after the first template update, so the dev-mode checkNoChanges pass lands in the same frame, keyed by instance (a component run twice is listed once)

## Exercise 3: the first download (`npx ng build`; raw / estimated transfer)

- start | step-3 | `npx ng build` | Initial total 1,772.52 kB (1.77 MB) / 383.17 kB; main 1,529,450 B (1.53 MB) / 357.12 kB
- lazy route alone | copy of step-3 | `loadComponent` for `legeplads/:id` | 1,770.24 kB (1.77 MB) / 383.58 kB; lazy playground-detail-component 959 B
- @defer map alone | copy of step-3 | `@defer (on idle)` + placeholder | 1,625.17 kB (1.63 MB) / 346.71 kB; lazy leaflet-component 154.78 kB / 40.94 kB
- @defer footer alone | copy of step-3 | `@defer (on viewport)` + `<footer>&nbsp;</footer>` | 1,780.20 kB (1.78 MB) / 386.79 kB; lazy footer-component 1.04 kB / 559 B. Up by 7,678 B raw, 3.62 kB transfer
- only faSpinner alone | copy of step-3 | main.ts as in step-4 | 760.93 kB / 161.12 kB
- cumulative, slide order: route | copy | route | 1,770.24 kB / 383.58 kB
- cumulative: + map | copy | route + map | 1,624.62 kB (1.62 MB) / 346.92 kB (this is the 1.62; the map alone is 1.63: both are right)
- cumulative: + footer (try, measure, revert) | copy | route + map + footer | 1,639.49 kB (1.64 MB) / 347.37 kB
- cumulative: + icons (footer reverted) | copy | route + map + icons | 615.00 kB / 125.46 kB
- cumulative with the footer kept, for reference | copy | route + map + footer + icons | 618.31 kB / 125.59 kB
- the solution (route + map + icons, no footer defer), 2026-11-01 after removing the Om appen panel | step-4 | `npx ng build` | 615.00 kB / 125.42 kB; main 103.44 kB / 23.83 kB, chunks 149.83 + 118.65 kB, styles 242.57 kB; lazy: leaflet-component 154.78 kB / 40.94 kB, playground-detail-component 996 B
- solution + footer defer, for reference | copy of step-4, still with the Om appen panel | + footer defer | 621.38 kB / 126.17 kB; footer-component 1.58 kB
- step-5, 2026-11-01 after removing the Om appen panel | step-5 | `npx ng build` | 615.05 kB / 125.41 kB
- why the footer defer costs bytes | metafile of the builds above (`--stats-json`), outputs reachable from main by static import | On the start: the first `@defer` brings the defer runtime + the viewport trigger: input `@angular/core/fesm2022/_debug_node-chunk.mjs` grows by 9,604 B (pre-minify) while `footer.component.ts` leaves main (-920 B); net +7,678 B initial JS. `IntersectionObserver` appears in initial JS only in the footer builds (0 hits in start, M, RMI, step-4; 1 hit in F, RMFI, step4F). On top of the map defer (runtime already there): core grows 2,477 B (viewport trigger only), footer leaves (-1,545 B in step-4, which has the Om appen button); net +885 B raw (step-4 -> step-4+footer), +3,317 B raw (RMI -> RMFI). Also: with a lazy chunk esbuild moves shared code into initial `chunk-*.js` files, so `main` shrinks but Initial total is the number to read
- what is in main | step-3 | `npm run build -- --stats-json`, then https://esbuild.github.io/analyze/ (page runs locally, the file is not uploaded), "Import your metafile...", pick `dist/performance/browser-stats.json` | main-*.js 1.5 mb; @fortawesome 1.1 mb: free-solid-svg-icons 872.7 kb, free-regular-svg-icons 115.5 kb, fontawesome-svg-core 88.1 kb; @angular 229.7 kb; leaflet 146.5 kb; rxjs 19.6 kb (analyzer units are KiB: 872.7 kb = 893,607 B). Screenshot: slides/images/esbuild-analyzer-main-icon-packs.jpg (built with `--preserve-symlinks` so paths read `node_modules/...` as in a student's lab; same sizes)
- source-map-explorer, tried | step-3 | `npx ng build --source-map`, `npx source-map-explorer dist/performance/browser/main-*.js` | fails ("generated column Infinity"); works only with `--no-border-checks` (free-solid 893,607 B, leaflet 149,994 B, free-regular 118,283 B), downloads an old package with deprecation warnings. Not used
- cold load, ms | step-3 vs step-4, production builds | `npx ng build`, `npx serve@14.2.4 -s dist/performance/browser` (gzip), fresh context, cache off, CPU 4x, DevTools presets via CDP: Slow 4G = 562.5 ms RTT, 180 kB/s down; Fast 4G = 165 ms RTT, 1.125 MB/s down; tiles from openstreetmap.org (internet) | Slow 4G: FCP 4424/4424/4420 -> 2304/2308/2352 ms; load 4378/4388/4388 -> 2276/2278/2314 ms; LCP 9380/9256/9540 -> 7184/7440/7484 ms. Fast 4G: FCP 1100/1108/1088 -> 652/644/648 ms; load 1056/1069/1053 -> 626/616/618 ms; LCP 4668/4676/4656 -> 4232/4212/4200 ms. JS transferred 477 kB -> 160 kB. Medians, Slow 4G: FCP 4.4 s -> 2.3 s, LCP 9.4 s -> 7.4 s
- LCP element | same | PerformanceObserver `largest-contentful-paint` | always a map tile `img.leaflet-tile` (candidates: footer `<p>` at FCP, then the first list `h6` after the 3 s backend delay, then a tile)
- does the map defer delay LCP? (C1) | step-4 vs copy of step-4 without the map `@defer` | same setup | Slow 4G LCP 7184/7440/7484 (deferred) vs 7736/7484/7520 ms (eager); Fast 4G 4232/4212/4200 vs 4288/4296/4304 ms; FCP Slow 4G 2308 vs 2620 ms median. No delay: with the defer LCP is 80 ms (Slow 4G) and 84 ms (Fast 4G) earlier (median). Without the map defer Initial total is 765.70 kB / 164.56 kB

## Exercise 4: leaks (dev build, `npm start`, CDP heap snapshot after forced GC; counts as in the DevTools Summary rows)

- before, snapshot 1 | step-4 `/` | wait for the list | FooterComponent 1, HomeComponent 1, LeafletComponent 1 (3 runs)
- before, after 5 rounds | step-4 | 5 x (click row k, Detaljer, Tilbage til kortet), snapshot 2 | 3 of 3 runs: Detached <leaflet> 10, FooterComponent 11, Detached <loop-sidebar-list-item> 1,330, Detached <loop-home> 10, Detached <loop-footer> 10, Detached <footer> 10; HomeComponent 1, LeafletComponent 1
- after | step-5 | same | 3 of 3 runs: no Detached <leaflet>, <loop-sidebar-list-item>, <loop-home>, <loop-footer> or <footer> rows; FooterComponent 1, HomeComponent 1, LeafletComponent 1. (The old "one Detached <footer>" was the footer @defer placeholder; with no footer defer it is gone)

## Lists (scratch copies of step-3, dev build, CPU 4x; not in the labs)

- step-1 list | step-1 `sidebar.component.html` | read | `@for (playground of playgrounds(); track playground.id)`; bindings `playground`, `location()`, `playground === selectedPlayground()`; rows read the computed signals `description()`, `distance()`; no plain method calls in templates (the pipes in `src/app/pipe` are unused)
- server list replaces the cached list (new objects, same ids) | reload with localStorage filled; the server answer after 3 s | `track playground.id`: 25.6/25.9/25.3 ms, 0 rows created. `track $index`: 27.6/32.4/25.8 ms, 0 created. `track playground` (object identity): 63.7/48.2/58.0 ms, 133 rows destroyed + 133 created
- new location re-sorts the same objects | `context.setGeolocation(55.70, 12.50)` | `track playground.id`: 9.0/12.8/9.3 ms, 123 rows moved in the DOM; `track $index`: 5.7/6.0/5.7 ms, no DOM moves (each row's text rewritten); identity: 10.7/8.3/10.0 ms, 123 moved

## Chrome Performance panel, Angular track

- `ng.enableProfiling()` exists and fills the track | step-3 dev server | console `ng.enableProfiling()`, record a list click | `typeof ng.enableProfiling` = function; 1,561 `console.timeStamp` events on track "🅰️ Angular" in 2.5 s; Chromium 156 DevTools Performance panel (trace loaded) lists the 🅰️ Angular track. Colours Angular passes: primary-dark "Change detection N", primary-light component names, secondary/secondary-dark "*_Template (create/update)" and HostBindings, tertiary lifecycle hooks, tertiary-light listeners, tertiary-dark DI (Injector, DestroyRef). Colour names on screen not checked

## Change detection demo (2026-11-03, headless Chromium 1155 via Playwright, fresh page per line)

`demo`, `npm run start:no-hmr`, `/performance/change-detection` (zoneless) and `/performance/change-detection?zone` (zone.js). **All Eager** / **All OnPush** rebuild the tree, so counters start at 1; the numbers below are the increase per node. Both modes gave the same counts on every line unless it says otherwise.

- All Eager, **click** on B1 | A, B, B1, B2, C, C1, C2 +1 each
- All OnPush, **click** on B1 | A, B, B1 +1; B2, C, C1, C2 +0
- All OnPush, **primitive +1** or **signal +1** on A | A, B, C +1; leaves +0
- All OnPush, **start signal interval** on B1, 3.2 s | B1 +4 (the click + 3 ticks); A, B +1 (the click); B2, C, C1, C2 +0; B1 shows signal ticks 3
- All Eager, **start signal interval** on B1, 3.2 s | every node +4
- All OnPush, **start primitive interval** on B1, 3.2 s | A, B, B1 +1 (the click), the rest +0; B1 shows primitive ticks 0, after **stop primitive interval** 3. Same in both modes
- All Eager, **start primitive interval** on B1, 3.2 s | zone.js: every node +4, B1 shows 3. Zoneless: every node +1 (the click), B1 shows 0, after **stop** 3. The only line where the modes differ

## Screenshots (2026-10-31, Chromium 156, DevTools frontend served from `--remote-debugging-port`)

- Network chunks | step-4, `npm run start:no-hmr` (port 4304) | Network, JS, filter `/main\.js|component/`, load `/`, click the first row, **Detaljer** | 3 rows: main.js (initiator (index):14), leaflet.component-….js (main.js), playground-detail.component-….js (app.routes.ts:11); no footer chunk. slides/images/devtools-network-chunks.jpg
- Retainers | step-4, `npm run start:no-hmr` | 5 rounds as in exercise 4, **Take snapshot**, class filter `Detached <leaflet>` | ×10; Retainers of one: [11] in Detached div.leaflet-container <- _container in NewClass (the map) <- context <- handler() <- resize… <- _leaflet_events in Window. slides/images/devtools-retainers-leaflet.jpg
- CD tree | demo, `npm run start:no-hmr`, `/performance/change-detection`, viewport 766 wide | **All OnPush**, **click** on B1 twice, element screenshot of the tree 150 ms after the second click | A, B, B1 flash, checks 3; B2, C, C1, C2 checks 1. slides/images/demo-cd-tree.jpg (718×438)
