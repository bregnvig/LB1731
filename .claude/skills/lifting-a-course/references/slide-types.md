# Slide types

Every slide is exactly one of the types below. A slide that fits none of them is two slides.

## How to make a slide

1. Pick the type from the table.
2. Copy `templates/<type>.html` into the course's `slides/` folder under the new name.
3. Replace the sample text. Keep every `data-name`, position, width, fragment and font size as the template has them.
4. Delete optional blocks (marked *) you don't need. Don't add blocks, move them, or resize text.
5. Run `python3 scripts/check-slides.py <course dir>`. It must print `0 problem(s)`.

The type is declared on the slide as `<section data-template="<type>">`, and the slide editor keeps it when it saves.

## Type scale

Every typed slide (`<section data-template>`) gets its text sizes from the theme (`slides/src/theme/deck.css`), never from inline styles:

| Style | How you write it | Size | Use it for |
|---|---|---|---|
| display | `<h1>` in `title` / `statement` | 49px | Course name, one-line statements |
| title | `<h2>` in the `title` block | 32px, uppercase | Slide titles |
| stat | `<p class="stat">before → <span class="accent">after</span></p>` | 64px bold | A measured result on `number` and `exercise-result` slides, with a body label under it |
| body | plain `<p>`, `<ul>`, `<ol>` | 24px, line-height 1.35 | Claims, steps, callouts, punchlines, why lines |
| accent | `<span class="accent">` | orange, size of its text | The one term or number to look at, and "Trap:" |
| code | code blocks | 22px | All code blocks |

Inline `<code>` is white monospace at the size of its text. UI labels are `<strong>`.

## What the checker enforces

- `data-template` names a type below.
- Only that type's blocks, by `data-name`, each the right kind (text, code, image), at the template's `left`, `top` and `width`. Blocks without a fixed `top` (punchline, why, callout, note) sit 48px below the block above them; check that on the render.
- Required blocks are there. Blocks marked "(click)" are fragments; the others are not, unless the template allows both.
- Code is at most 8 lines (elide with `// …`). `data-line-numbers` only with lines to highlight.
- On `exercise-step-code`, the code's first line is a comment naming the file (`// src/app/home/home.component.ts`, or `<!-- … -->` in HTML), and that line doesn't count toward the 8. The steps never spell out a path: a long path in the narrow step column wraps into orphan words.
- Text sizes and colours come only from the type scale (below). No inline `font-size`, `line-height` or `color`, in text or code.
- At most two `accent`s per slide, plus the "Trap:" label. Paths and identifiers go in white `<code>`, UI labels in `<strong>`.
- A numbered list stays on one slide (no `<ol start=…>`).
- The `title` image's bottom-right corner is at 1200,648 and its longest side is 288px. Use the course's own image, named `<course>-1.png` or `.svg`.
- An image block's height matches its image's aspect ratio, so a screenshot is never letterboxed small.
- Words in text blocks, the title not counted, stay within the type's maximum.
- Exercise titles read `Exercise N - <step>`.
- An exercise's step slides (`exercise-start`, `exercise-step*`) are one unbroken run with no click reveals, and the last one tells the group to come back to the room. `exercise-result` slides for that exercise come after the run, in the debrief.
- No tables.
- Slide text never points at another lab or exercise ("Lab 2", "exercise 3", "the next exercise"). That belongs in the notes. The opener "Not happy with the result of the previous exercise?" is the one exception.
- Speaker notes exist (not on `title` and `statement`), have a short cue, a blank line, then the talk script, and hold no authoring history ("cut from the slide", "so it fits").
- Per course: at most 50 slides, none hidden, and a `MEASURED.md` next to `slides/`.

## The types

This table is the output of `python3 scripts/check-slides.py --describe`. The numbers live in the script; if you change one there, regenerate this table and the templates (`--write-templates templates`).

| Type | Use it for | Blocks (data-name, * = optional) | Max words |
|---|---|---|---|
| `title` | First slide of a course: the course name, one short italic line, and the course image in the lower right (bottom-right corner at 1200,648, longest side 288px). | `title`, `subtitle`, `image-1` | 12 |
| `statement` | One big sentence or question on its own, e.g. "Time for questions 🤓". | `title` | 12 |
| `reveal-list` | Three to five short items in one list, each appearing on a click, then an optional punchline. For kinds, steps and "In your app" homework. | `title`, `items`, `punchline`* (click) | 45, 8 per item |
| `claim-code` | Up to three short claims on the left, the code that shows them on the right. | `title`, `claims`, `code-1`, `punchline`* (click) | 35, 8 code lines |
| `claim-image` | Up to three short claims on the left, a cropped screenshot of what they describe on the right. | `title`, `claims`, `image-1`, `punchline`* (click) | 30 |
| `code-pair` | Two code blocks side by side (before and after, or the definition and its use), one caption line. | `title`, `code-1`, `code-2`, `caption`* | 15, 8 code lines |
| `number` | One or two measured results as big numbers, side by side: the before in white, the after in accent, a short label under each. Then one line on why. | `title`, `result-1`, `result-2`* (click), `why`* | 30 |
| `wrap` | Last content slide: one line per technique with this app's number, the Monday line, the question. | `title`, `line-1`, `line-2`, `line-3`*, `line-4`*, `monday`, `question` (click) | 50 |
| `exercise-start` | First slide of exercise 1: path, npm install, npm start, what the exercise is for, the running app on the right. | `title`, `steps`, `image-2`*, `note`*, `image-1` | 55 |
| `exercise-step` | One step of an exercise with nothing to show on the right: 1-4 numbered instructions, then an optional callout 48px below: a trap ("Trap: …") or what they should see ("You should see: …"). | `title`, `steps`, `callout`* | 60 |
| `exercise-step-code` | One step of an exercise: short instructions on the left, the code to write on the right. The code starts with a comment naming the file, so the steps never spell out a path. | `title`, `steps`, `code-1`, `callout`* | 50, 8 code lines |
| `exercise-step-image` | One step of an exercise: short instructions on the left, a screenshot of what they should see on the right. | `title`, `steps`, `image-1`, `callout`* | 45 |
| `exercise-result` | Debrief after an exercise: one or two measured results as big numbers, the before in white, the after in accent, a short label under each. Then one line on why. | `title`, `result-1`, `result-2`* (click), `why`* | 30 |

## Choosing a type

- Theory with code to show: `claim-code`. With a screenshot: `claim-image`. Two pieces of code that belong together: `code-pair`.
- A list of kinds, steps or items: `reveal-list`. Never a table.
- A number the room should remember: `number` (theory) or `exercise-result` (after an exercise).
- An exercise is a run of step slides, one step each: `exercise-start` for the first slide of exercise 1, then `exercise-step`, `exercise-step-code` or `exercise-step-image`. Exercises 2 to 4 open with an `exercise-step` that starts "Not happy with the result of the previous exercise?". The last step ends with "Done? Come back to the room."
- After the run, the debrief: `exercise-result` slides ("Exercise N - What we measured"), then any theory that explains what they found, then the "In your app" homework as a `reveal-list` titled "In your app: …" (a numbered `<ol>` when the items are steps).
- Too many words for the type: split at the next step or idea. Never shrink the text.
