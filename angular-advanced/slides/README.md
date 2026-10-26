# Slides

The Angular Advanced deck and the tool to present and edit it. The slides are plain HTML files in this repo, so they can be edited in the editor, by hand, or by an LLM, and git is their history.

## Use it

```bash
adv slides            # builds and serves on http://localhost:4300
adv slides pdf [out]  # writes the student PDF (default slides/out/angular-advanced.pdf)
```

| Page | What it's for |
|------|---------------|
| `/edit` | The editor. Changes are saved to the slide files half a second after you stop. |
| `/present` | The presentation, full screen on the projector. |
| `/presenter` | Current slide, next step, notes, clock and timer. Keys typed here drive the presentation. |

Every open presentation window and the presenter view stay on the same slide, fragment and clicked animations. Open `/presenter` on your screen and `/present` on the projector. Reloading either one picks up where the others are.

The PDF has one page per slide, without hidden slides or notes, with every fragment and animation shown. The editor's Export PDF button writes the same file.

## Where the slides are

```
slides/deck.json                  deck title, intro slides, course order
slides/intro/*.html               intro slides
courses/<course>/slides/deck.json course title and slide order (a slide can be "hidden": true)
courses/<course>/slides/*.html    one slide per file
courses/<course>/slides/images/   images used by that course's slides
```

The intro slides come first, then each course as one vertical stack.

## Slide files

A slide is one `<section>` with absolutely positioned blocks on a 1280×720 canvas, and optional speaker notes:

```html
<section>
  <div class="block" data-type="text" data-name="title" style="left:102px;top:43px;width:1076px;height:auto;z-index:10">
    <h2>Click me</h2>
  </div>
  <div class="block" data-type="text" data-name="answer" data-animate="fade-in" data-animate-duration="0.4" data-animate-delay="0" data-animate-on="title" style="left:102px;top:300px;width:600px;height:auto;z-index:12">
    <p>The answer</p>
  </div>
  <aside class="notes">Ask before clicking.</aside>
</section>
```

- `data-name` is unique on the slide. Animations and the editor refer to blocks by it.
- `style` holds `left`, `top`, `width`, `height` (px or `auto`) and `z-index`, then any other CSS the block needs (rotation, color, font size).
- `data-type` is `text`, `code`, `shape`, `line`, `image`, `table`, `drawing` or `group`. Each has its own attributes. The editor writes them, and `src/app/deck/slide-format.ts` reads and writes them.
- Animations: `data-animate` (`fade-in`, `fade-out`, `scale-up`, `scale-down`, `slide-up`, `slide-down`), `data-animate-duration` and `data-animate-delay` in seconds, and `data-animate-on="<name>"` to start on a click of that block instead of on entry.
- Fragments: class `fragment` (plus `fade-down`), and optionally `data-fragment-index`.
- `<section data-auto-animate>` animates from the previous slide.

If a file changes on disk while it's open in the editor, the editor doesn't overwrite it. It stops saving and offers to reload.

## Credits

Third-party libraries, fonts, color palettes and images, and their licenses, are listed in [CREDITS.md](CREDITS.md).

## Working on the tool

The tool has its own `package.json` (not one of the workspace's projects): run `npm install` here.

```bash
npm test      # unit tests (Vitest) and server tests
npm run e2e   # Playwright: player, sync, PDF and editor, on the fixture deck in e2e/fixture
```

`server/server.mjs` serves the app and a small file API (`/api/deck`, `/api/files/<path>`, `/content/<path>`) that only reaches the slide files, the deck files and their images.
