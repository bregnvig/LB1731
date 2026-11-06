# Angular Advanced slides in the repo

Date: 2026-10-25
Status: design, awaiting approval

## Intent

The Angular Advanced slides live in a hosted slide tool today. The course code lives in this repo. We want the slides in the repo too, next to the courses they teach, so that:

- the slides are owned files, versioned with git, reviewed together with the code they describe;
- an LLM can edit them as easily as it edits code;
- we keep the functionality we rely on: an editor, a presentation view, a synced presenter view with notes, and PDF export.

The owner edits slides mostly through the editor or by asking an LLM. Hand-editing the files is possible but not the main path.

## Scope: one PR

Everything below is one PR on branch `slides-editor`, stacked on the current stack (#14 → #15 → #16 → #17). **Nothing is pushed and no PR is opened until the owner says they're satisfied.** Local commits only.

Build order, since each piece depends on the one before:

1. e2e baseline of the current deck (local, see "Private material")
2. importer: migrate the deck into our files
3. player: presentation view and presenter view
4. PDF export
5. editor

## Hard rules

- **No trace of the old tool in the repo.** No mention of its name, no files from its export, no screenshots of it, no copied CSS, theme code or editor layout. That goes for code, comments, tests, docs, commit messages and the eventual PR text.
- **The slides look exactly as they do today**, pixel for pixel: black background, orange accents, Overpass font, the same code highlighting. This is the owner's content and look. We reproduce it with our own CSS, written from scratch, and fonts/themes taken from open sources (e.g. Overpass from npm), never from the export.
- **The editor is our own design.** It keeps the functionality listed below but must not resemble the old tool's editor in layout or styling.
- **Student zips do not change.** `adv test-zips` passes without a re-bless.

## Private material (local only, never committed)

Everything that touches the old tool's export lives in `.private/` at the repo root. It's ignored through `.git/info/exclude`, so not even an ignore rule names it in the repo.

- `.private/export/`: the current HTML export of the deck (13 MB).
- `.private/export-notes.md`: the export's format, as found during research (block markup, notes storage, animation attributes, config).
- `.private/reference/`: screenshots of the editor the owner uses today. Functionality reference only.
- The **importer** and the **e2e comparison test**, plus their screenshots, also live here. The owner may keep editing in the old tool while this PR is open, so the importer must be re-runnable on a newer export, regenerating our slide files, and the comparison re-run after it.

## What the current deck contains

From the export (format details in `.private/export-notes.md`):

- 1280×720, margin 0.05, slide numbers, URL hash includes the fragment, horizontal "slide" transition, content not vertically centered.
- 452 slides in 11 top-level sections: 2 intro slides ("advanced", "Exercises & PDF") and 9 vertical stacks, one per course, matching the course folders 1:1, in this order: rxjs, di, components, unit-test, reactive-forms, routing, pipes-and-directives, signals, state-management.
- 10 hidden slides. Speaker notes on most slides (some stored notes belong to deleted slides).
- Every slide is a canvas of absolutely positioned blocks with pixel position, size and stacking order. 2288 blocks:
  - text 1387, shape 353 (rectangle 205, circle 148), group 345, code 320, line 224, image 76, freehand drawing 5, table 2.
  - Code: TypeScript 240, HTML 41, plain 32, bash 5. 216 code blocks highlight specific lines. Two code color themes (one on 299 blocks, the other, Monokai, on 21). A macOS-style window frame on 6. Automatic height on 119.
  - Lines: solid or dashed (20), arrowhead at start and/or end, thickness, color.
  - Images: 50 PNG, 24 SVG, 1 GIF, 1 JPG. 6 cropped, 4 SVGs inlined so their color can change. No alt text yet.
  - Borders on 22 blocks. 56 links inside text.
- Animations:
  - reveal.js-style fragments: 73 (default style 65, fade-down 8); auto-animate on 7 slides.
  - Block animations: 156 blocks with an enter/exit effect (fade-in 109, scale-down 37, slide-down 6, slide-up 2, scale-up 1, fade-out 1), with duration and delay. 75 start when another block is clicked; the rest play when the slide appears.

## Goals

1. **e2e baseline.** A test that opens the current export in a browser, steps through every slide and every animation step (each fragment, each click-triggered animation), and screenshots after each step.
2. **Faithful migration.** Our player produces pixel-identical screenshots at every step, within a small tolerance for anti-aliasing. Each animation has the same effect, duration, delay, trigger and order. Mid-animation frames are not compared.
3. **LLM-editable files.** Slides as plain files an LLM can read and change like code, with readable diffs.
4. **Presentation view and presenter view** as two independent browser windows kept in sync.
5. **PDF export** that replaces the students' PDF handout.
6. **Editor**, an Angular app with our own design, covering the functionality below.

## Non-goals

- Anything the deck doesn't use: math, video, iframes, charts, lightbox, per-slide transitions or backgrounds, custom CSS, block-level links, rotation, opacity, blur, shadow, blend mode, padding, text scale/line height/letter spacing, code word wrap, hover triggers.
- Collaboration, comments, sharing, analytics, AI features, PowerPoint export, live streaming, remote control, in-editor revision history (git is the history).
- Migrating the basic Angular course slides (repo root `slides/`, `slides-exercises/`).
- Hosting; this is a local tool.

## Anti-goals (failure even if it technically works)

- A migrated slide looks different from today or animates differently (wrong order, trigger or effect).
- The two windows drift out of sync while presenting, so the room sees something other than the presenter.
- Student zips change.
- Anything in the repo reveals or resembles the old tool (see Hard rules).

## Decisions made by the owner

- Slides are absolutely positioned blocks with pixel coordinates, not Markdown.
- The tool lives in `angular-advanced/slides/`; each course's slides live in `angular-advanced/courses/<course>/slides/`.
- The editor is an Angular app, our own design.
- Presenting: presentation view in one window, presenter view in another, synced.
- e2e bar: each step's end state, pixel-compared, plus animation settings.
- PDF: for students, the whole deck, hidden slides left out, generated on demand. It replaces the handout behind the "Exercises & PDF" slide's link. It isn't committed and isn't in the zips.
- The old tool may still be used for edits while the PR is open, so migration is re-runnable.
- Importer and comparison test are local only.
- One PR, not pushed until the owner is satisfied.

## File format (agreed with the owner)

- **One HTML file per slide** in `courses/<course>/slides/`, e.g. `switchmap-example.html`, containing one `<section>` with its blocks. Each block keeps position, size and stacking order. Content is ordinary HTML (`<h2>`, `<p>`, `<ul>`, `<pre><code>`, `<img>`, SVG for shapes, lines and drawings).
- Speaker notes in the same file, as reveal.js's standard `<aside class="notes">`.
- Animations, triggers and fragments are attributes on the block, in our own vocabulary. Blocks get short readable names (e.g. `question`, `arrow-1`) so triggers read as "fade in `answer` when `question` is clicked".
- **One order file per course**, `courses/<course>/slides/deck.json`, listing slide files in order and marking hidden slides.
- Images next to the course that uses them (e.g. `courses/rxjs/slides/images/`), with readable names.
- The 2 intro slides live in `angular-advanced/slides/`, with a top-level order file listing the intro slides and then the 9 courses in the order above, so the whole deck can be presented as one presentation like today, one vertical stack per course.

## Player

- reveal.js renders the files. It already provides fragments, auto-animate, vertical stacks, hidden slides, slide numbers, the slide transition, code highlighting and speaker notes.
- Our own small runtime adds block animations (the effects above, duration, delay, trigger on slide entry or on clicking a target block).
- Auto-animate on the 7 slides must move the same elements as today; the e2e comparison proves it.
- Our own CSS reproduces the look exactly (see Hard rules).

## Presentation and presenter view

- Two browser windows opened independently (e.g. presentation on the projector, presenter view on the laptop), kept in sync: current slide, fragment step and click-triggered animations. Navigating in either window moves both.
- Presenter view: current slide, next slide, speaker notes, elapsed time, clock.

## PDF export

- Whole deck, one slide per page, hidden slides left out, animations in their final state. Generated on demand (e.g. `adv slides pdf`).

## Editor

Angular app. Our own layout and styling; the functionality:

- **Deck level:** pick a course, add a slide after the current one or below it (vertical), reorder slides in an overview, delete a slide, mark a slide hidden, toggle auto-animate, undo, save state indicator, open presentation view, open presenter view, export PDF.
- **Adding blocks:** Text, Shape, Image, Pen (freehand), Line, Arrow, Table, Code.
- **Canvas:** the 1280×720 slide on a grid; drag, resize (with a size readout), multi-select, smart guides; navigate between slides.
- **Speaker notes** editable next to the canvas.
- **Layers:** list of blocks on the slide, select, reorder.
- **Settings for the selected block:**
  - Text: alignment, text color; headings, bold, inline color and links edited inline.
  - Code: code, language (TypeScript, HTML, bash, plain), color theme (the two in use), window frame (none, macOS), text size, automatic height, highlighted lines.
  - Shape: rectangle or circle, fill, stroke color and width, corner radius.
  - Line/Arrow: solid or dashed, arrowhead at start/end, thickness, color; endpoints dragged on the canvas.
  - Image: replace, keep aspect ratio, crop, inline SVG, alt text. GIFs work as images.
  - Table and Pen: enough to edit the 2 tables and 5 drawings.
  - All blocks: X/Y/W/H, border, depth (to back, back, forward, to front), duplicate, delete, lock.
  - Animation: on/off, trigger (on slide entry or on click), click target, effect, duration, delay, preview.
  - Fragment: on/off, style, step order.
- Saves straight to the files in the repo; they're the source of truth.
- Before building the editor UI, show the owner a mockup of our own layout for approval.

## Constraints

- Lives in `angular-advanced/`, Node 24 via mise, Angular 22 like the courses, started through the `adv` CLI (#17), e.g. `adv slides`.
- **Dependencies:** `scripts/student-packages.sh` copies the root `dependencies`/`devDependencies` and every hoisted package in the root lockfile into each student exercise. The slides tool therefore gets **its own `package.json` and lockfile in `angular-advanced/slides/`, outside the npm workspaces** (builder's call, made here so the student-zip rule holds). `scripts/check-packages.sh` and the workspace globs must keep working.
- `courses/<course>/slides/` must not reach the student zips (`scripts/stage-course.sh` copies only `step-*`, or `labs/`/`solutions/` for rxjs; keep it that way).
- PR text, when it's time: opens with a "Why" section, includes before/after trees.

## Left to the builder

- The HTML/attribute vocabulary for blocks, animations and triggers, and the `deck.json` schema.
- Slide file and image naming (readable, e.g. derived from titles).
- What happens to notes of deleted slides (dropping them is fine; report the count).
- Sync mechanism between windows; how the editor writes files (local server endpoint or similar).
- Test tooling (Playwright fits), screenshot tolerance, how the local baseline is stored.
- PDF mechanism.
- Editor internals: state, undo, component structure.
- Committed tests for the tool itself (player, sync, PDF, editor), with no reference to the old tool.
