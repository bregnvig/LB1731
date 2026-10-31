# House style — clone, don't invent

The style contract is the sibling courses in this repo, not this file. Sample before you write. Signals is the current standard for exercise slides and speaker notes.

## Sample these

From **three** sibling courses (prefer `signals`, plus one older module, plus one with a rich demo README):

| Artifact | Open |
|----------|------|
| Theory slide | A slide with code on the right and claims on the left, plus notes |
| Exercise slide | `exercise-1-getting-started.html` and a later `exercise-N-*.html` |
| Speaker notes | An `<aside class="notes">` that has a cue, a blank line, and a talk script |
| Lab delta | `diff -rq courses/<c>/step-1 courses/<c>/step-2` — the exercise is that diff |
| Demo | The matching `demo/README.md` section and `demo/src/app/<topic>/` |

Copy voice, density, orange, screenshot habit, and note shape from those files. If your draft would not sit in that folder unnoticed, rewrite it.

## Layout

```
courses/<course>/slides/deck.json     order; "hidden": true is allowed
courses/<course>/slides/*.html        one <section> per file
courses/<course>/slides/images/       screenshots for that course
courses/<course>/step-N/              lab N; step-(N+1) = solution N
demo/src/app/<topic>/                 live demo
demo/README.md                        presenter walkthrough (not in demo.zip)
slides/deck.json                      intro + course order
slides/README.md                      HTML/animation contract (source of truth)
courses/README.md                     module blurb and exercise list
```

rxjs is the exception: `labs/` + `solutions/` instead of `step-N`.

## Slide HTML

Follow `slides/README.md`. Canvas is 1280×720. Blocks are absolutely positioned. Unique `data-name` per slide. Types: `text`, `code`, `shape`, `line`, `image`, `table`, `drawing`, `group`. Never use `table` or an HTML `<table>`; see SKILL.md, No tables.

House habits sampled from signals:

- Title `h2` at ~left 64 / top 108, or exercise title at ~left 38 / top 86
- Body text ~0.7em on exercise slides so a screenshot fits
- APIs, paths, commands: `<span style="color:#FF8C00">` or `<code>` in that orange
- Code blocks: `data-type="code"` `data-theme="dark"` `data-auto-height`, playground names (`Byggepladsen`), `data-line-numbers`
- Exercise screenshot on the right, `data-keep-ratio`
- End of module: `time-for-questions.html` with `h1` "Time for questions" (🤓 is in the house)

Do not add "Learning objectives", "Agenda", or "By the end of this module". Title slide is the course name plus a short italic line.

House slides (title, `time-for-questions.html`, exercise time) are copied from a sibling under the same file name and changed only where the course name or screenshot differs. A content slide copied from a sibling counts as new: its code, names, and screenshots come from this course's steps.

## Images

- App screenshots: JPEG, quality 85, from the playground app at a 1280×720 viewport, cropped to what the slide talks about.
- Diagrams, terminal output, flat UI with few colours: PNG. Drawn diagrams: SVG.
- 300 kB per new image at most. Convert with `magick in.png -quality 85 out.jpg`.
- Text the slide quotes (build output, console lines) is kept as `.txt` next to the image, so the number can be checked.
- Name images after what they show (`app-detail.jpg`, `build-step-3.txt`), not `image-1.png`.

## Speaker notes

```
short cue (what to click, the number to watch, the trap)

Talk script in the instructor's voice. Name the demo route. Ask the room something concrete.
```

Thin notes ("Explain the slide") fail Explicit. Corporate notes ("In this lesson we will explore…") fail style.

Demo cue shape, from signals:

```
Demo: /signals/computed-vs-effect. Console open, click Rename: logs "computed: Grace Hopper | copy: Ada Lovelace".
```

## Exercise slides

Canonical: `courses/signals/slides/exercise-*.html`.

Getting started:

- Path `labs/<course>/exercise-N` in orange
- `npm install` then `npm start` (some older slides say `ng serve`; new slides always say `npm start` to match `package.json`)
- Screenshot of the running app
- Location permission if the list waits on geolocation, including how to recover if they blocked it
- What the exercise is *for*, in one short paragraph, then "take the next slides as your checklist"

Later exercises:

- "Not happy with the result of the previous exercise? Go to the `labs/<course>/exercise-N` directory and run `npm install`…"
- Named files (`home.component.ts`, `sidebar.component.ts`)
- CLI they should run, exactly (`npx ng g c sidebar/sidebar-list-item -t -s`)
- What should happen (loader appears, terminal clean, NG8109, blank page means missing `()`)
- Optional `?` gist link, as in components — only if the gist matches the lab

An exercise is a run of slides, one step each, each slide one of the exercise types in slide-types.md.

## Labs

```
lab N        = courses/<course>/step-N
solution N   = courses/<course>/step-(N+1)
students get = labs/<course>/exercise-N  and  solutions/<course>/exercise-N
```

The diff is the teaching. A solution that also refactors, renames, or "cleans up" fails Sense.

Keep:

- Playground-finder (Copenhagen/Aarhus, geolocation, Leaflet, sidebar, footer)
- Root `package.json` for dependencies; step `package.json` is scripts-only
- Angular version already in the repo

Seed a problem the student can **measure** the way the slides tell them to (profiler bars, bundle line, heap size, frozen footer). If they cannot see the before, the lab is theatre.

## Demos

Presenter file: `demo/README.md`. Pattern from the state-management section:

```
### N. Title — `/route`

**Files:** …

**What it shows:** one sentence.

**Demo flow:**
1. Click **X** — Y happens.
2. …

**Talking point:** the Monday sentence.
```

Order the demos the way you will click them in class. The demo app runs on **http://localhost:4201** (`npm start` in `demo/`).

A demo that needs a lecture to understand has failed Intuitive: simplify the UI or add labels on screen.

## Voice

Instructor talking to working Angular developers. Short sentences. "The catch is…". "If you remember one slide…". "Ask the room…". Emoji is rare and already in the house (🤓, 😍). Danish playground names stay.

Write English the siblings write: contractions, direct address, no marketing.

## Monday test

Write this sentence for each lab during diagnosis. Lab slides do not print it. The wrap slide prints a short form of it (at most 12 words, e.g. "Start with the slow your users feel. Measure it before you fix it."), and the notes read out the full sentence:

> In your own app, you would __. The first thing you measure is __.

If you cannot fill those blanks, the lab is a tutorial of the playground app, not a course.
