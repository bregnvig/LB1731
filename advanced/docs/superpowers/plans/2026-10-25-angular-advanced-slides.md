# Angular Advanced Slides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the Angular Advanced deck into the repo as LLM-editable slide files, with a reveal.js player, a synced presenter view, PDF export and an Angular editor, proven pixel-identical to today's deck.

**Architecture:** A standalone Angular 22 app in `angular-advanced/slides/` (own `package.json`, outside the npm workspaces) is served by a dependency-free Node server that also exposes a small file API over the slide files in `angular-advanced/slides/intro/` and `angular-advanced/courses/<course>/slides/`. Slides are stored as one HTML `<section>` per file in our own block vocabulary. The player renders them with reveal.js plus our own block-animation plugin. A local-only importer and comparison test in `/.private/` migrate the old export and prove fidelity.

**Tech Stack:** Angular 22 (zoneless, signals, standalone), reveal.js 5 with its Notes and Highlight plugins, highlight.js, `@fontsource/overpass`, Node 24 `node:http`, Vitest via `@angular/build:unit-test`, Playwright (tests and PDF), pixelmatch + pngjs (private comparison only).

**Spec:** `docs/superpowers/specs/2026-10-25-angular-advanced-slides-design.md`

## Global Constraints

- Work in worktree `/home/johannes/projects/LB1731/.claude/worktrees/slides-editor`, branch `slides-editor`. **Never push, never open a PR.** Local commits only, each ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- **No trace of the old tool in anything committed:** no name, no export files, no screenshots of it, no copied CSS/theme/editor layout. Before every commit run `.private/no-trace.sh` (checks staged changes) and expect `no trace`.
- Everything touching the old export lives in `/.private/` (repo root, ignored via `.git/info/exclude`): `export/`, `export-notes.md`, `reference/`, `importer/`, `e2e/`.
- Slides render **pixel-identical** to today (black background, orange accents, Overpass, same code colors) using our own CSS written from computed values; fonts from `@fontsource/overpass`, never from the export.
- The editor is our own design; it must not resemble `.private/reference/*.png` in layout or styling.
- Student zips do not change: `adv test-zips` passes **without** `--bless` after every task.
- The slides app has its own `angular-advanced/slides/package.json` and `package-lock.json`, not listed in `angular-advanced/package.json` `workspaces`.
- Node 24 (mise), Angular 22, reveal.js config: width 1280, height 720, margin 0.05, `hash: true`, `slideNumber: true` (format `h.v`), `fragmentInURL: true`, `transition: "slide"`, `backgroundTransition: "slide"`, `center: false`, `controls: true`, `progress: true`, `mouseWheel: false`.
- Course order: rxjs, di, components, unit-test, reactive-forms, routing, pipes-and-directives, signals, state-management. Intro: 2 slides.
- Supported block types only: text, code, shape (rect, circle), line (incl. arrow), image, group, drawing, table. Effects only: fade-in, fade-out, scale-up, scale-down, slide-up, slide-down. Triggers: on slide entry, or click on a named block. Fragment styles: default, fade-down.
- Run `mise trust` once in `angular-advanced/` of the worktree before the first task.

## Review Focus

1. Saving a slide in the editor after an LLM (or git checkout) changed the same file on disk → the save must not silently overwrite; the server answers 409 and the editor shows a conflict with a reload action. Pinned in Task 1 (409 on stale `If-Match`) and Task 12 (conflict status).
2. A request path like `../../package.json` or `courses/x/slides/../../y` to the file API → rejected with 400, nothing outside the allowed slide paths is read or written. Pinned in Task 1.
3. A click-triggered block whose trigger name no longer exists (renamed or deleted block) → the block is shown, not stuck invisible, and a console warning names it; renaming a block in the editor updates triggers pointing at it, deleting one clears them. Pinned in Task 7 and Task 13.
4. One window reloaded or opened late during a talk → it catches up to the other window's slide, fragment and clicked animations within a second. Pinned in Task 9 (hello/reply).
5. Re-running the importer after the owner edited slides in the new editor → the importer refuses to overwrite files with uncommitted changes unless `--force`. Pinned in Task 4.

## Slide file format (decided here; the spec left it to the builder)

One file per slide, e.g. `courses/rxjs/slides/switchmap-example.html`:

```html
<section data-auto-animate>
  <div class="block" data-type="text" data-name="title" style="left:102px;top:43px;width:1076px;height:auto;z-index:10">
    <h2>Example using switchMap</h2>
  </div>
  <div class="block" data-type="text" data-name="answer" style="left:296px;top:395px;width:600px;height:auto;z-index:15"
       data-animate="fade-in" data-animate-duration="0.6" data-animate-delay="0" data-animate-on="code-2">
    <p>…</p>
  </div>
  <div class="block fragment fade-down" data-fragment-index="1" data-type="code" data-name="code-1"
       data-theme="dark" data-frame="macos" data-auto-height style="left:247px;top:199px;width:786px;height:159px;z-index:14">
    <pre style="font-size:20px;line-height:24px"><code class="language-typescript" data-line-numbers="2,3">…</code></pre>
  </div>
  <div class="block" data-type="shape" data-name="box-1" data-shape="rect" data-fill="#222" data-stroke="#fff" data-stroke-width="2" data-radius="0" style="…"></div>
  <div class="block" data-type="line" data-name="arrow-1" data-x1="0" data-y1="0" data-x2="140" data-y2="120"
       data-color="#ff0000" data-width="5" data-dashed data-start="arrow" data-end="none" style="left:…;top:…;width:…;height:…;z-index:…"></div>
  <div class="block" data-type="image" data-name="image-1" data-inline-svg style="…;--svg-color:#fff"><img src="images/rxjs-logo.svg" alt="" style="left:-7px;top:0;width:616px;height:648px"></div>
  <div class="block" data-type="group" data-name="group-1" style="…"> …child blocks, positioned relative to the group… </div>
  <div class="block" data-type="drawing" data-name="drawing-1" style="…"><svg viewBox="…"><path d="…" stroke="#fff" stroke-width="4" fill="none"/></svg></div>
  <div class="block" data-type="table" data-name="table-1" style="…"><table>…</table></div>
  <aside class="notes">…</aside>
</section>
```

- `data-animate-on` absent = play on slide entry; otherwise the `data-name` of the block whose click starts it.
- Optional on any block: `data-locked`, `style` border (`border:2px solid #fff;border-radius:4px`).
- Line endpoints are relative to the block box. Images resolve relative to the slide file's folder.
- `deck.json` in each course: `{ "title": "RxJS", "slides": [ { "file": "rxjs.html" }, { "file": "draft.html", "hidden": true } ] }`.
- `angular-advanced/slides/deck.json`: `{ "title": "Angular Advanced", "slides": [ { "file": "advanced.html" }, { "file": "exercises-and-pdf.html" } ], "courses": ["rxjs", "di", "components", "unit-test", "reactive-forms", "routing", "pipes-and-directives", "signals", "state-management"] }`; intro slide files in `angular-advanced/slides/intro/`.

## File structure

```
angular-advanced/slides/
  package.json, package-lock.json, angular.json, tsconfig*.json, .gitignore (+ /out)
  deck.json, intro/*.html                 # top-level deck + intro slides (content)
  server/server.mjs                       # static dist + API, --root, --port
  server/files.mjs                        # path allowlist, deck loading, etags
  server/server.test.mjs                  # node:test
  scripts/pdf.mjs                         # PDF export
  e2e/playwright.config.ts, e2e/*.spec.ts # committed browser tests
  e2e/fixture/                            # small own-content deck: slides/deck.json, slides/intro/, courses/demo/slides/
  src/styles.css                          # app chrome only
  src/theme/deck.css, code-dark.css, code-monokai.css
  src/app/app.routes.ts                   # /present, /presenter, /edit
  src/app/deck/model.ts, slide-format.ts, deck.service.ts
  src/app/player/render.ts, deck-html.ts, block-animations.ts, present.component.ts
  src/app/sync/sync.ts
  src/app/presenter/presenter.component.ts
  src/app/editor/…                        # Tasks 12–16
angular-advanced/courses/<course>/slides/ # deck.json, *.html, images/
angular-advanced/.bin/adv                 # + slides command
/.private/                                # never committed: export/, importer/, e2e/, reference/
```

---

### Task 1: Slides package, file server and `adv slides`

**Files:**
- Create: `angular-advanced/slides/` via `npx @angular/cli@22 new slides --directory slides --style css --routing --ssr false --skip-git --skip-install` run in `angular-advanced/`, then `npm install` inside `slides/`
- Create: `slides/server/files.mjs`, `slides/server/server.mjs`, `slides/server/server.test.mjs`
- Modify: `angular-advanced/.bin/adv` (new `slides` command, `install` also installs `slides/`), `slides/package.json` scripts, `slides/.gitignore` (add `/out`)
- Test: `slides/server/server.test.mjs`

**Interfaces:**
- Produces (HTTP, server root = `--root`, default `..` relative to `slides/`):
  - `GET /api/deck` → `{ title, slides: SlideFileJson[], courses: { id, title, slides: SlideFileJson[] }[] }` where `SlideFileJson = { path: string, hidden: boolean, html: string, etag: string }`; `path` is relative to root (e.g. `courses/rxjs/slides/rxjs.html`, `slides/intro/advanced.html`).
  - `PUT /api/files/<path>` raw body; header `If-Match: <etag>` optional; → 200 with `ETag`, 409 if `If-Match` differs from the file's current etag, 400 if path not allowed.
  - `DELETE /api/files/<path>` → 204 / 400 / 404.
  - `GET /content/<path>` → file bytes for allowed paths (images, html).
  - Everything else → files from `dist/slides/browser`, falling back to `index.html`.
- Produces (`files.mjs`): `isAllowedPath(rel: string): boolean`, `etagOf(buf: Buffer): string` (sha1 hex), `loadDeck(root: string): Promise<DeckJson>`.
- Allowed paths regex: `^(slides/(deck\.json|intro/([a-z0-9-]+\.html|images/[a-z0-9._-]+\.(png|svg|gif|jpe?g)))|courses/[a-z-]+/slides/(deck\.json|[a-z0-9-]+\.html|images/[a-z0-9._-]+\.(png|svg|gif|jpe?g)))$`, after rejecting any path containing `..` or a backslash.
- Produces (CLI): `adv slides` (build + serve on port 4300, prints URL), `adv slides pdf [out]` (Task 10), `adv install` also runs `npm install` in `slides/`.
- `slides/package.json` scripts: `start` = `ng build && node server/server.mjs`, `test` = `ng test --watch=false && node --test server/`, `e2e` = `playwright test -c e2e/playwright.config.ts`, `pdf` = `node scripts/pdf.mjs`.

- [ ] **Step 1: Generate the app, install, confirm `angular-advanced/package.json` and its lockfile are unchanged** (`git diff --stat angular-advanced/package*.json` empty) and `adv test-zips` passes.
- [ ] **Step 2: Write failing tests in `server/server.test.mjs`** using a temp root built in the test (`slides/deck.json`, `slides/intro/a.html`, `courses/demo/slides/deck.json`, `courses/demo/slides/one.html`):
  - `GET /api/deck` returns intro `[{path:'slides/intro/a.html', hidden:false}]` and course `demo` with title from its deck.json, each with `html` and a 40-char `etag`.
  - `PUT /api/files/courses/demo/slides/one.html` with the current etag → 200, file content replaced, new `ETag` header.
  - same PUT with a stale `If-Match` → 409, file unchanged.
  - `PUT /api/files/../package.json`, `PUT /api/files/courses/demo/slides/../../x.html`, `PUT /api/files/courses/demo/other/x.html` → 400, nothing written.
  - `DELETE` of an allowed missing file → 404.
- [ ] **Step 3: Run** `node --test server/` → FAIL (module missing).
- [ ] **Step 4: Implement `files.mjs` and `server.mjs`** with `node:http`, `node:fs/promises`, `node:crypto`; flags `--root <dir>` and `--port <n>` (default 4300).
- [ ] **Step 5: Run** `node --test server/` → PASS.
- [ ] **Step 6: Add the `slides` case to `.bin/adv`** (`"slides"|"s")` with optional sub-argument `pdf`) and help lines; run `adv slides` from `courses/` and `curl -s localhost:4300/api/deck` → JSON (empty courses are fine before Task 4).
- [ ] **Step 7: Run** `adv test-zips` → pass without bless; `scripts/check-packages.sh` → exit 0.
- [ ] **Step 8: Commit** (`Add slides app skeleton, file server and adv slides`).

### Task 2: Baseline capture of the current deck (private)

**Files:**
- Create: `/.private/package.json` (deps: `playwright`, `pixelmatch`, `pngjs`), `/.private/e2e/walk.mjs`, `/.private/e2e/capture-baseline.mjs`
- Output: `/.private/e2e/baseline/<h>-<v>-<step>.png`, `/.private/e2e/baseline/steps.json`

**Interfaces:**
- Produces: `walk(page, { clickSelector(name: string): string }) : AsyncGenerator<{ key: string, h: number, v: number, step: number, action: 'enter'|'fragment'|'click', target?: string }>` in `walk.mjs`; it drives `window.Reveal` in the page, one yield after each settled step. Shared by Task 8.
- Step order per slide: `enter` (step 0), then each fragment via `Reveal.nextFragment()`, then each click-triggered block's trigger target clicked once, in document order of the animated blocks.
- "Settled" = `document.fonts.ready`, two animation frames, then wait for the slide's longest `delay + duration` + 100 ms.
- `steps.json`: `[{ key, h, v, step, action, target }]` where `target` is the old block id for clicks.

- [ ] **Step 1: `npm install` in `/.private/`, `npx playwright install chromium`.**
- [ ] **Step 2: Implement `walk.mjs` and `capture-baseline.mjs`:** open `.private/export/index.html` at viewport 1280×720, `Reveal.configure({ transition: 'none', backgroundTransition: 'none', showHiddenSlides: true })`, iterate every slide (`Reveal.getHorizontalSlides()` and their vertical children), screenshot each step.
- [ ] **Step 3: Run** `node .private/e2e/capture-baseline.mjs` → screenshots written; `enter` steps = 452 and `fragment` steps = 73 (counts from the spec); `click` steps = number of distinct trigger targets per slide, summed (record it; Task 8 uses the same total). Run it twice and diff the two runs with pixelmatch → 0 differing pixels (proves capture is deterministic).
- [ ] **Step 4: No commit** (private). Record the counts in `/.private/export-notes.md`.

### Task 3: Slide model, parse and serialize

**Files:**
- Create: `slides/src/app/deck/model.ts`, `slides/src/app/deck/slide-format.ts`
- Test: `slides/src/app/deck/slide-format.spec.ts`

**Interfaces:**
- Produces (`model.ts`):
  ```ts
  export type Effect = 'fade-in'|'fade-out'|'scale-up'|'scale-down'|'slide-up'|'slide-down';
  export interface Animation { effect: Effect; duration: number; delay: number; on: string | null }
  export interface Fragment { index: number | null; style: '' | 'fade-down' }
  interface BlockBase { name: string; x: number; y: number; width: number; height: number | 'auto'; z: number;
    border?: { width: number; style: 'solid'|'dashed'; color: string; radius: number };
    locked?: boolean; animation?: Animation; fragment?: Fragment }
  export type Block = BlockBase & (
    | { type: 'text'; html: string; align?: 'left'|'center'|'right' }
    | { type: 'code'; code: string; lang: 'typescript'|'html'|'bash'|'plaintext'; theme: 'dark'|'monokai';
        frame: 'none'|'macos'; lines: string | null; autoHeight: boolean; preStyle: string }
    | { type: 'shape'; shape: 'rect'|'circle'; fill: string; stroke: string | null; strokeWidth: number; radius: number }
    | { type: 'line'; x1: number; y1: number; x2: number; y2: number; color: string; width: number;
        dashed: boolean; start: 'none'|'arrow'; end: 'none'|'arrow' }
    | { type: 'image'; src: string; alt: string; inlineSvg: boolean; svgColor: string | null; imgStyle: string; keepRatio: boolean }
    | { type: 'group'; children: Block[] }
    | { type: 'drawing'; svg: string }
    | { type: 'table'; html: string });
  export interface Slide { path: string; hidden: boolean; autoAnimate: boolean; blocks: Block[]; notes: string; etag: string }
  export interface Course { id: string; title: string; slides: Slide[] }
  export interface Deck { title: string; intro: Slide[]; courses: Course[] }
  ```
- Produces (`slide-format.ts`): `parseSlide(json: { path: string; hidden: boolean; html: string; etag: string }): Slide`, `serializeSlide(slide: Slide): string` (the file format above, 2-space indented, one block per line group, notes last), `blockNames(slide: Slide): string[]` (all names incl. group children).
- `lines`: value of `data-line-numbers` (`''` = line numbers only, `'2,3'` = highlight), `null` when absent.

- [ ] **Step 1: Write failing tests:**
  - `roundtrip`: for a fixture slide containing one block of every type plus animation, fragment, border, locked, notes and `data-auto-animate`, `serializeSlide(parseSlide(x)).trim() === x.trim()`.
  - `parses animation`: block with `data-animate="scale-down" data-animate-duration="0.4" data-animate-delay="0.2" data-animate-on="q"` → `{ effect:'scale-down', duration:0.4, delay:0.2, on:'q' }`; without `data-animate-on` → `on: null`.
  - `parses code`: `lang:'typescript'`, `theme:'dark'`, `lines:'2,3'`, `code` with `&lt;` decoded to `<`.
  - `parses group children` with child positions relative to the group.
  - `blockNames` returns names of nested children.
- [ ] **Step 2: Run** `npx ng test --watch=false` → FAIL.
- [ ] **Step 3: Implement** with `DOMParser` / `XMLSerializer`-free string building for output (deterministic attribute order: class, data-type, data-name, type attributes, animation, fragment, style).
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** (`Add slide model with parse and serialize`).

### Task 4: Importer (private) and migrated slide files

**Files:**
- Create: `/.private/importer/import.mjs` (Playwright-driven extraction from `.private/export/index.html` in the page context, files written from Node)
- Create (output, committed): `angular-advanced/slides/deck.json`, `angular-advanced/slides/intro/*.html`, `angular-advanced/courses/<course>/slides/{deck.json,*.html,images/*}`
- Output (private): `/.private/importer/map.json` = `{ "<old slide id>": { "path": "...", "blocks": { "<old block id>": "<name>" } } }`

**Interfaces:**
- Consumes: the file format (above) and `serializeSlide` semantics from Task 3 (the importer writes the same text form; it may import `slide-format.ts` via a small esbuild bundle or reimplement serialization; output must parse with `parseSlide` and round-trip).
- Rules:
  - Top-level sections 1–2 → intro; stacks 3–11 → courses in the order from Global Constraints; course title from the stack's first slide `h1` text.
  - Slide file name: slug of the first heading text (`h1`–`h3`), lowercase `[a-z0-9-]`, max 40 chars, deduped per course with `-2`, `-3`; fallback `slide-<n>`.
  - Block names: `title` for the first heading text block; otherwise `<type>-<n>` numbered per slide in document order (`code-1`, `arrow-1` for lines with an arrowhead, `line-1` otherwise).
  - Images: copied into the course's `images/` with name `<slide-file>-<n>.<ext>`; intro images into `slides/intro/images/`.
  - Notes: from the export's notes object by slide id; notes whose id matches no slide are dropped and counted.
  - Hidden: from `data-visibility="hidden"` into `deck.json`.
  - Drop placeholder attributes, ids, and wrapper elements; keep inner content HTML and inline styles on content.
  - Refuse to run if `git status --porcelain -- angular-advanced/slides/intro angular-advanced/slides/deck.json 'angular-advanced/courses/*/slides'` is non-empty, unless `--force`.

- [ ] **Step 1: Write a private check `/.private/importer/check.mjs`** that, after import, compares per slide: block count by type, each block's position/size/z, text content, code text, image byte size, animation effect/duration/delay/trigger, fragment index/style, notes text, hidden flag — export vs `parseSlide` of our files (via `map.json`). Expected after Step 3: 0 mismatches, 452 slides, 2288 blocks, 156 animations, 73 fragments, 10 hidden.
- [ ] **Step 2: Run** `node .private/importer/check.mjs` → FAIL (no files).
- [ ] **Step 3: Implement `import.mjs`, run it** → files written, prints dropped-notes count.
- [ ] **Step 4: Run check** → 0 mismatches. Run the importer again without `--force` after touching one slide file → refuses with a message listing the file.
- [ ] **Step 5: Run** `adv test-zips` → pass without bless.
- [ ] **Step 6: Run `.private/no-trace.sh`; commit** the migrated content (`Migrate Angular Advanced slides into course folders`).

### Task 5: Deck theme

**Files:**
- Create: `slides/src/theme/deck.css`, `slides/src/theme/code-dark.css`, `slides/src/theme/code-monokai.css`
- Modify: `slides/angular.json` (styles: reveal.js `reset.css` + `reveal.css`, `@fontsource/overpass` weights used, the three theme files)

**Interfaces:**
- Produces the custom property `--deck-accent` (the deck's orange, from computed styles) on `.reveal`, and CSS classes used by Task 6: `.reveal .block` (absolute, `box-sizing` as measured), `.block[data-type=code] pre` frames (`[data-frame=macos]`), `[data-theme=dark|monokai]` token colors for highlight.js classes (`.hljs-keyword`, `.hljs-string`, …), `.highlight-line` / dimmed lines matching reveal's `data-line-numbers` output.
- Values come from **computed styles read in the baseline browser** (fonts, sizes, colors, letter-spacing, text-transform of headings, code token colors, line-number colors); write them as our own rules. Do not open or copy the export's CSS files.

- [ ] **Step 1: Write `/.private/e2e/computed-styles.mjs`** that dumps computed styles for `h1,h2,h3,p,li,a,pre,code` and each highlight token class on representative slides to `/.private/e2e/computed.json`.
- [ ] **Step 2: Write the three CSS files from those values.** Verification of the look happens in Task 8.
- [ ] **Step 3: Commit** (`Add deck theme`), after `.private/no-trace.sh`.

### Task 6: Player (presentation view)

**Files:**
- Create: `slides/src/app/player/render.ts`, `slides/src/app/player/deck-html.ts`, `slides/src/app/player/present.component.ts`, `slides/src/app/deck/deck.service.ts`
- Modify: `slides/src/app/app.routes.ts`
- Test: `slides/src/app/player/render.spec.ts`, `slides/e2e/player.spec.ts`, fixture deck in `slides/e2e/fixture/`

**Interfaces:**
- Consumes: `Deck`, `Slide`, `Block`, `parseSlide` (Task 3); `GET /api/deck`, `/content/` (Task 1).
- Produces:
  - `DeckService` (`providedIn: 'root'`): `deck: Signal<Deck | null>`, `load(): Promise<Deck>`, `saveSlide(slide: Slide): Promise<Slide>` (PUT with `If-Match`, returns slide with new etag, throws `ConflictError` on 409), `saveOrder(courseId: string | null, slides: Slide[]): Promise<void>` (`null` = intro), `deleteSlide(slide: Slide): Promise<void>`, `uploadImage(dir: string, file: File): Promise<string>` (returns path relative to the slide folder, e.g. `images/x.png`).
  - `renderBlock(block: Block, baseUrl: string): string` and `renderSlide(slide: Slide, baseUrl: string): string` in `render.ts`: display HTML for one slide (`<section>` with `data-visibility="hidden"` when hidden, shapes and lines as inline SVG, code as `<pre><code class="language-…" data-line-numbers>`, image `src` prefixed with `/content/<slide folder>/`, notes as `<aside class="notes">`). Used by player, presenter and editor canvas.
  - `deckHtml(deck: Deck): string` in `deck-html.ts`: intro slides as top-level sections, then one `<section>` stack per course.
  - Route `/present` → `PresentComponent`; query params `embed=current|next`, `print-pdf`, `test` (test: transitions off, `showHiddenSlides: true`).
- reveal.js initialized with the config in Global Constraints and plugins `RevealNotes`, `RevealHighlight` (`highlight: { escapeHTML: false }`).

- [ ] **Step 1: Write failing unit tests** in `render.spec.ts`: line block `x1=0,y1=0,x2=140,y2=120,start=arrow` renders an `<svg>` with a `<line>` and one arrow marker at the start; circle shape renders `<ellipse>`/`<circle>` filling the box; image `images/a.png` in `courses/rxjs/slides/x.html` renders `src="/content/courses/rxjs/slides/images/a.png"`; hidden slide renders `data-visibility="hidden"`; `deckHtml` of 2 intro + 2 courses yields 4 top-level sections, the course ones containing nested sections.
- [ ] **Step 2: Run** `npx ng test --watch=false` → FAIL; implement; → PASS.
- [ ] **Step 3: Create the fixture deck** (own content: an intro slide; course `demo` with a slide with a fragment, a slide with an entry animation and a click-triggered animation, a slide with code highlighting lines `2,3`, a slide with a shape, a line with an arrow and an image, one hidden slide). Write `e2e/playwright.config.ts` with `webServer`: `npx ng build && node server/server.mjs --root e2e/fixture --port 4310`.
- [ ] **Step 4: Write e2e `player.spec.ts`:** `/present` shows slide number `1`; `ArrowRight` then `ArrowDown` navigates into course `demo`; the hidden slide is skipped; `#/1/1/0` deep link shows the fragment step. Run `npm run e2e` → FAIL; implement `PresentComponent`; → PASS.
- [ ] **Step 5: Commit** (`Add slide player`).

### Task 7: Block animations

**Files:**
- Create: `slides/src/app/player/block-animations.ts`
- Modify: `slides/src/theme/deck.css` (effect start states and transitions), `present.component.ts` (register plugin)
- Test: `slides/src/app/player/block-animations.spec.ts`, `slides/e2e/animations.spec.ts`

**Interfaces:**
- Produces: `createBlockAnimations(): BlockAnimationsPlugin` where `BlockAnimationsPlugin` is a reveal.js plugin (`id: 'block-animations'`, `init(reveal)`) plus `trigger(name: string): void`, `clicked(): string[]` (names triggered on the current slide, in order), `restore(names: string[]): void` (apply clicks without replaying delay), `finishAll(): void` (everything in end state; used by print and editor preview), and `onTrigger(fn: (name: string) => void): void`.
- Behavior: on `slidechanged`/`ready`, blocks with `data-animate` and no `data-animate-on` animate from their start state after `delay`; click-triggered blocks wait in the start state until a click on the block named by `data-animate-on`; leaving and re-entering a slide resets it. `fade-out` starts visible and ends hidden. Uses CSS transitions with `transition-duration`/`transition-delay` from the attributes.
- Missing trigger target → block is put in its end state immediately and `console.warn('block-animations: no block named "<name>" for "<block>"')`.

- [ ] **Step 1: Write failing unit tests:** entry `fade-in` block gets class `animate-start` then `animate-in` after a frame; click-triggered block stays in `animate-start` until `trigger('code-2')`; `clicked()` returns `['code-2']`; `restore(['code-2'])` sets end state with `transition: none`; missing target → end state + warning (spy `console.warn`); `finishAll()` sets all to end state.
- [ ] **Step 2: Run → FAIL; implement; run → PASS.**
- [ ] **Step 3: e2e `animations.spec.ts`** on the fixture: click-triggered block is invisible (`opacity 0`) before clicking its target and visible 1 s after. Run → PASS.
- [ ] **Step 4: Commit** (`Add block animations`).

### Task 8: Pixel comparison against the baseline (private)

**Files:**
- Create: `/.private/e2e/compare.mjs`
- Output: `/.private/e2e/diff/<key>.png` for failures, summary on stdout

**Interfaces:**
- Consumes: `walk()` (Task 2) with `clickSelector(name) = [data-name="<name>"]` via `map.json` (Task 4); our player at `http://localhost:4300/present?test` (`adv slides`).
- Pass criterion per step: pixelmatch `threshold: 0.1`, differing pixels ≤ 0.1 % of 1280×720 (≤ 922). Same step keys and order as `steps.json`.

- [ ] **Step 1: Run** `node .private/e2e/compare.mjs` → expect failures at first; prints `<n> of <total> steps differ` and writes diffs.
- [ ] **Step 2: Fix causes in our code** (theme CSS, render, animations) — never in the slide files by hand; importer fixes go in `import.mjs` followed by a re-import with `--force` and re-running `check.mjs`. Repeat until `0 of <total> steps differ`, total = the step count in `steps.json`.
- [ ] **Step 3: Run the committed suites** `npm test` and `npm run e2e` in `slides/` → PASS. Commit the code fixes (`Match deck rendering`), after `.private/no-trace.sh`.

### Task 9: Sync and presenter view

**Files:**
- Create: `slides/src/app/sync/sync.ts`, `slides/src/app/presenter/presenter.component.ts`
- Modify: `present.component.ts`, `app.routes.ts`
- Test: `slides/src/app/sync/sync.spec.ts`, `slides/e2e/sync.spec.ts`

**Interfaces:**
- Consumes: reveal API, `BlockAnimationsPlugin` (Task 7), `DeckService` (Task 6).
- Produces: `connectSync(reveal: RevealApi, animations: BlockAnimationsPlugin, opts?: { channel?: string; follower?: 'next' }): () => void` in `sync.ts`. Channel default `adv-slides` (`BroadcastChannel`). Messages: `{ type: 'state', from: string, state: { indexh, indexv, indexf }, clicks: string[] }` and `{ type: 'hello', from: string }`. Each window has a random `from` id, ignores its own messages and messages equal to its current state. On start it posts `hello`; any window receiving `hello` replies with `state`. `follower: 'next'` applies the state, then `reveal.next()` once, and never broadcasts.
- Route `/presenter` → `PresenterComponent`: iframe `/present?embed=current` (controller, broadcasts), iframe `/present?embed=next` (follower), notes of the current slide (from `DeckService` by indices, notes with line breaks preserved), elapsed time `hh:mm:ss` from first navigation with a reset button, wall clock `HH:MM`. Keyboard in the presenter window is forwarded to the current iframe's `Reveal` (`next`, `prev`, `up`, `down`, `left`, `right`).
- Embedded views hide reveal controls and progress.

- [ ] **Step 1: Write failing unit tests** with two fake reveal objects and a shared fake channel: navigating A moves B; B ignores echoes (no infinite loop: ≤ 2 messages per navigation); a third instance started late receives the current state after `hello`; a click in A calls `restore` on B with the same names; follower applies state then `next()` and never posts.
- [ ] **Step 2: Run → FAIL; implement; → PASS.**
- [ ] **Step 3: e2e `sync.spec.ts`** (two pages in one browser context): `/present` and `/presenter`; `ArrowRight` in the presenter page → presentation shows the same slide number within 1 s; clicking a trigger target in the presentation plays the animation in the presenter's current iframe; reloading the presentation page restores slide and clicked animations within 1 s; presenter shows the fixture slide's notes text.
- [ ] **Step 4: Run → PASS. Commit** (`Add synced presenter view`).

### Task 10: PDF export

**Files:**
- Create: `slides/scripts/pdf.mjs`
- Modify: `present.component.ts` (print mode), `.bin/adv` (`adv slides pdf [out]`)
- Test: `slides/e2e/pdf.spec.ts`

**Interfaces:**
- Produces: `node scripts/pdf.mjs [--out <file>] [--root <dir>]` → builds if `dist/` is missing, starts `server.mjs` on a free port, opens `/present?print-pdf` in Playwright Chromium, `page.pdf({ width: '1280px', height: '720px', printBackground: true })`. Default out: `slides/out/angular-advanced.pdf`. Hidden slides excluded, fragments and block animations in their end state (`finishAll()`), no speaker notes.
- `adv slides pdf [out]` runs it and prints the output path.
- Server route `POST /api/pdf` (in `server.mjs`) runs the same export to the default out path and responds `{ path }`; the editor's Export PDF button calls it (Task 12).

- [ ] **Step 1: Write e2e `pdf.spec.ts`:** run the script against the fixture root; the PDF exists and its page count (occurrences of `/Type /Page` not followed by `s`) equals the number of visible fixture slides; on `/present?print-pdf` the fixture's click-triggered block has computed `opacity: 1` (end state). `POST /api/pdf` returns `{ path }` of an existing file.
- [ ] **Step 2: Run → FAIL; implement; → PASS.**
- [ ] **Step 3: Run** `adv slides pdf` on the real deck → page count = 452 − 10 = 442. Do not commit the PDF.
- [ ] **Step 4: Commit** (`Add PDF export`).

### Task 11: Editor layout mockup (owner approval gate)

**Files:**
- Create: `/.private/mockups/editor-layout.html` (not committed)

- [ ] **Step 1: Design our own editor layout** covering every function in the spec's Editor section. It must differ from `.private/reference/*.png` in layout and styling (e.g. a different arrangement of block tools, settings and slide navigation, our own colors and typography). Show it to the owner in the browser through the brainstorming visual companion and iterate.
- [ ] **Step 2: Stop until the owner approves the layout.** Record the approved arrangement in a short note at the top of Task 12's component files' first commit message.

### Task 12: Editor shell: deck navigation, canvas render, notes, save and undo

**Files:**
- Create: `slides/src/app/editor/editor.store.ts`, `editor.component.ts`, `slide-list.component.ts` (overview, reorder by drag), `canvas.component.ts` (render only in this task), `notes.component.ts`
- Modify: `app.routes.ts` (`/edit`, `/edit/:course/:file`)
- Test: `slides/src/app/editor/editor.store.spec.ts`, `slides/e2e/editor-shell.spec.ts`

**Interfaces:**
- Consumes: `DeckService`, `renderSlide`, `serializeSlide`, `createBlockAnimations().finishAll()` (preview shows end state).
- Produces `EditorStore` (`providedIn: 'root'`, signals):
  - state: `deck`, `courseId: Signal<string | null>` (`null` = intro), `slideIndex`, `slide: Signal<Slide>`, `selection: Signal<string[]>`, `status: Signal<'saved'|'saving'|'conflict'|'error'>`.
  - `openCourse(id: string | null)`, `openSlide(index: number)`, `updateSlide(fn: (s: Slide) => Slide)` (pushes undo snapshot, schedules save 500 ms debounced), `undo()`, `redo()`, `setNotes(text: string)`, `addSlide()` (empty slide inserted after the current one in the same list, file name `slide-<n>.html`, saves file then order), `deleteSlide()`, `moveSlide(from: number, to: number)`, `setHidden(v: boolean)`, `setAutoAnimate(v: boolean)`, `reloadSlide()` (after conflict).
  - Undo history per slide, max 100 entries.
- Toolbar actions: open `/present` (new window, at current slide hash), open `/presenter`, Export PDF (`POST /api/pdf` from Task 10, then shows the file path; if Task 10's route is missing, the button is disabled).

- [ ] **Step 1: Write failing store tests** with a fake `DeckService`: `updateSlide` then `undo` restores the previous slide; `redo` re-applies; two quick updates cause one save after 500 ms; save rejecting with `ConflictError` sets `status` to `conflict` and stops further saves until `reloadSlide()`; `moveSlide(0,2)` calls `saveOrder` with the new order; `addSlide` inserts after current and selects it.
- [ ] **Step 2: Run → FAIL; implement store; → PASS.**
- [ ] **Step 3: Build the components per the approved mockup.** e2e `editor-shell.spec.ts` on a temp copy of the fixture root: open `/edit`, pick course `demo`, edit notes, wait for "Saved", the file on disk contains the new `<aside class="notes">`; modify the file on disk, edit again → conflict banner with reload.
- [ ] **Step 4: Run → PASS. Commit** (`Add editor shell`).

### Task 13: Canvas interactions

**Files:**
- Modify: `canvas.component.ts`, `editor.store.ts`
- Create: `slides/src/app/editor/guides.ts`, `layers.component.ts`
- Test: `slides/src/app/editor/guides.spec.ts`, store spec additions, `slides/e2e/editor-canvas.spec.ts`

**Interfaces:**
- Produces (store): `select(names: string[], additive?: boolean)`, `moveBlocks(names: string[], dx: number, dy: number)`, `resizeBlock(name: string, rect: { x; y; width; height })`, `setDepth(names: string[], op: 'back'|'backward'|'forward'|'front')`, `duplicate(names: string[])` (new names `<name>-copy`, offset 20 px), `deleteBlocks(names: string[])` (clears `animation.on` pointing at deleted names), `renameBlock(old: string, next: string)` (updates every `animation.on` equal to `old`; rejects duplicates), `setLocked(names, v)`.
- Produces (`guides.ts`): `snap(moving: Rect, others: Rect[], slide: { width: 1280; height: 720 }, tolerance = 5): { dx: number; dy: number; guides: { axis: 'x'|'y'; at: number }[] }` matching edges and centers of other blocks and the slide.
- Canvas: click/shift-click select, marquee select, drag (snapped), 8 resize handles with a `W × H` readout, arrow keys move 1 px (shift 10 px), Delete removes, locked blocks can't move. Line blocks show two endpoint handles instead of a box.
- Layers panel lists blocks top-down by `z`, click selects, drag reorders (sets `z`).

- [ ] **Step 1: Write failing tests:** `snap` returns `dx = -3` when a block's left edge is 3 px right of another's left edge; centers snap to slide center 640; `renameBlock('q','question')` updates `animation.on` in other blocks; `deleteBlocks(['q'])` sets their `animation.on` to `null`; `setDepth(['a'],'front')` gives `a` the highest `z`; locked block ignores `moveBlocks`.
- [ ] **Step 2: Run → FAIL; implement; → PASS.**
- [ ] **Step 3: e2e `editor-canvas.spec.ts`:** drag a block 100 px right → file on disk has `left` increased by 100 (± snapping); resize via handle updates width; endpoint drag on a line changes `data-x2`.
- [ ] **Step 4: Run → PASS. Commit** (`Add canvas editing`).

### Task 14: Adding blocks and settings for text, code, shape, line

**Files:**
- Create: `slides/src/app/editor/settings/text-settings.component.ts`, `code-settings.component.ts`, `shape-settings.component.ts`, `line-settings.component.ts`, `common-settings.component.ts` (X/Y/W/H, border, depth, duplicate, delete, lock, name), `block-tools.component.ts`, `slides/src/app/editor/new-block.ts`
- Test: `slides/src/app/editor/new-block.spec.ts`, `slides/e2e/editor-blocks.spec.ts`

**Interfaces:**
- Produces: `newBlock(type: Block['type'], existing: string[], at: { x: number; y: number }): Block` — defaults: text `<p>Text</p>` 600×auto; code `lang: 'typescript'`, `theme: 'dark'`, `frame: 'none'`, `preStyle: 'font-size:20px;line-height:24px'`, 786×159; shape rect 200×120, fill = the computed value of `--deck-accent` (Task 5), stroke none; line 200 px horizontal, width 5, color `#ffffff`; arrow = line with `end: 'arrow'`. Name = `<type>-<n>` with the first free `n`.
- Text editing: double-click enters `contenteditable` on the block; settings offer paragraph/H1/H2/H3, bold, text color, link, alignment (`text-align` on the content). `// ponytail: document.execCommand for inline formatting; replace if Chromium drops it`.
- Code settings: textarea for code, language, theme (`dark`, `monokai`), frame, text size (edits `preStyle` font-size, keeping line-height ratio 1.2), automatic height, highlighted lines (text input, validated `^(\d+(-\d+)?)(,\d+(-\d+)?)*$` or empty).
- Shape: rect/circle, fill, stroke color + width (0 = none), corner radius. Line: solid/dashed, start/end arrow, thickness, color.

- [ ] **Step 1: Failing unit tests for `newBlock`:** names don't collide (`code-1` exists → `code-2`); arrow has `end: 'arrow'`; positions clamp inside 1280×720.
- [ ] **Step 2: Run → FAIL; implement; → PASS.**
- [ ] **Step 3: e2e `editor-blocks.spec.ts`:** add a code block, type code, set highlighted lines `2` → file contains `data-line-numbers="2"`; change a text block to H2 and orange → file contains `<h2` and the color; invalid highlighted lines value is not saved and shows an error.
- [ ] **Step 4: Run → PASS. Commit** (`Add text, code, shape and line editing`).

### Task 15: Images, tables and drawings

**Files:**
- Create: `slides/src/app/editor/settings/image-settings.component.ts`, `table-settings.component.ts`, `drawing-settings.component.ts`, `slides/src/app/editor/pen.ts`
- Test: `slides/src/app/editor/pen.spec.ts`, `slides/e2e/editor-media.spec.ts`

**Interfaces:**
- Image: add/replace via file picker → `DeckService.uploadImage(slideFolder, file)`; file names sanitized to `[a-z0-9._-]`, deduped; keep aspect ratio toggle (resize handles keep ratio when on); crop mode (drag/resize the image inside the block frame, written to `imgStyle`); inline SVG toggle (only for `.svg`) with color; alt text. GIF/PNG/JPG/SVG accepted; others rejected with a message.
- Table: add/remove row and column, edit cells inline; new table 3×3.
- Pen: `pointsToPath(points: { x: number; y: number }[]): string` (SVG `d`, simplified with a 1 px tolerance), color and stroke width settings; drawing a stroke creates a `drawing` block sized to the stroke's bounds.

- [ ] **Step 1: Failing unit tests:** `pointsToPath` of 3 collinear points yields a single `M … L …` segment; upload name `My Logo.PNG` becomes `my-logo.png`, and `my-logo-2.png` when taken.
- [ ] **Step 2: Run → FAIL; implement; → PASS.**
- [ ] **Step 3: e2e `editor-media.spec.ts`:** upload a PNG → image block shows it and the file exists in the course `images/`; crop → `imgStyle` changed in file; add a table row → file has one more `<tr>`; draw with the pen → a `drawing` block with a `<path>` is saved.
- [ ] **Step 4: Run → PASS. Commit** (`Add image, table and drawing editing`).

### Task 16: Animation, fragment and slide settings

**Files:**
- Create: `slides/src/app/editor/settings/animation-settings.component.ts`, `fragment-settings.component.ts`, `slide-settings.component.ts`
- Test: store spec additions, `slides/e2e/editor-animation.spec.ts`

**Interfaces:**
- Animation panel: on/off; trigger "on slide entry" or "on click of" with a picker listing `blockNames(slide)` except the block itself; effect (the six effects); duration (0.1–5 s, default 0.6); delay (0–10 s, default 0); Preview plays the animation on the canvas using `createBlockAnimations()` on a detached copy, then returns to end state.
- Fragment panel: on/off, style (default, fade-down), step number (empty = document order).
- Slide settings: hidden, auto-animate (store methods from Task 12).

- [ ] **Step 1: Failing store tests:** enabling an animation with defaults gives `{ effect: 'fade-in', duration: 0.6, delay: 0, on: null }`; the trigger picker options exclude the block itself; turning fragment on sets `class` `fragment` in `serializeSlide` output.
- [ ] **Step 2: Run → FAIL; implement; → PASS.**
- [ ] **Step 3: e2e `editor-animation.spec.ts`:** set a text block to fade in on click of `code-1` → file contains `data-animate="fade-in"` and `data-animate-on="code-1"`; in `/present` the block is hidden until `code-1` is clicked.
- [ ] **Step 4: Run → PASS. Commit** (`Add animation, fragment and slide settings`).

### Task 17: Final checks and docs

**Files:**
- Modify: `angular-advanced/course-descriptions.md` (slides section: where slides live, `adv slides`, `adv slides pdf`, editor at `/edit`, presenter at `/presenter`, add packages to the slides tool in `slides/`), `.claude/worktrees/todo-list/TODO.md` (mark slides item; not committed)

- [ ] **Step 1: Run everything:** `npm test` and `npm run e2e` in `slides/` → PASS; `node .private/importer/check.mjs` → 0 mismatches; `node .private/e2e/compare.mjs` → `0 of <total> steps differ`; `adv test-zips` → pass without bless; `scripts/check-packages.sh` → exit 0; `adv verify all` → same results as before (32 build+serve, 4 unit-test PASS, 1 XFAIL).
- [ ] **Step 2: No-trace sweep of the whole branch:** `.private/no-trace.sh origin/adv-cli..HEAD` → `no trace`.
- [ ] **Step 3: Update docs; commit** (`Document the slides tool`). Do not push. Report to the owner for review.
