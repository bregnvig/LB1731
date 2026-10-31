# Slide types

Every slide is exactly one of the types below. A slide that fits none of them is two slides.

## How to make a slide

1. Pick the type from the table.
2. Copy `templates/<type>.html` into the course's `slides/` folder under the new name.
3. Replace the sample text. Keep every `data-name`, position, width, fragment and font size as the template has them.
4. Delete optional blocks (marked *) you don't need. Don't add blocks, move them, or resize text.
5. Run `python3 scripts/check-slides.py <course dir>`. It must print `0 problem(s)`.

The type is declared on the slide as `<section data-template="<type>">`, and the slide editor keeps it when it saves.

## What the checker enforces

- `data-template` names a type below.
- Only that type's blocks, by `data-name`, each the right kind (text, code, image), at the template's `left`, `top` and `width`. Blocks without a fixed `top` (punchline, why, callout, note) sit 48px below the block above them; check that on the render.
- Required blocks are there. Blocks marked "(click)" are fragments; the others are not, unless the template allows both.
- Inline font sizes are only the ones the template uses. Exercise text is 0.85em with line-height 1.35.
- Code is at least 22px and at most 8 lines (elide with `// …`). `data-line-numbers` only with lines to highlight.
- Result headings (`result-1`, `result-2`) have `class="keep-case"`, so names and units keep their case.
- At most two orange spans per slide, plus the "Trap:" label. Paths and identifiers go in white `<code>`, UI labels in `<strong>`.
- A numbered list stays on one slide (no `<ol start=…>`).
- The `title` image's bottom-right corner is at 1200,648 and its longest side is 288px. Use the course's own image, named `<course>-1.png` or `.svg`.
- An image block's height matches its image's aspect ratio, so a screenshot is never letterboxed small.
- Words in text blocks, the title not counted, stay within the type's maximum.
- Exercise titles read `Exercise N - <step>`. An exercise is one unbroken run: a theory slide placed inside it (the fix explained between measure-before and the change) is titled `Exercise N - …` too.
- No tables.
- Slide text never points at another lab or exercise ("Lab 2", "exercise 3", "the next exercise"). That belongs in the notes. The opener "Not happy with the result of the previous exercise?" is the one exception.
- Speaker notes exist (not on `title` and `statement`), have a short cue, a blank line, then the talk script, and hold no authoring history ("cut from the slide", "so it fits").
- Per course: at most 50 visible slides, and a `MEASURED.md` next to `slides/`.

## The types

This table is the output of `python3 scripts/check-slides.py --describe`. The numbers live in the script; if you change one there, regenerate this table and the templates (`--write-templates templates`).

| Type | Use it for | Blocks (data-name, * = optional) | Max words |
|---|---|---|---|
| `title` | First slide of a course: the course name, one short italic line, and the course image in the lower right (bottom-right corner at 1200,648, longest side 288px). | `title`, `subtitle`, `image-1` | 12 |
| `statement` | One big sentence or question on its own, e.g. "Time for questions 🤓". | `title` | 12 |
| `reveal-list` | Three to five short phrases, one per click, then an optional punchline 48px below the last line. For categories and lists. | `title`, `line-1` (click), `line-2` (click), `line-3` (click), `line-4`* (click), `line-5`* (click), `punchline`* (click) | 40, 8 per line |
| `claim-code` | Up to three short claims on the left, the code that shows them on the right. | `title`, `claims`, `code-1`, `punchline`* (click) | 35, 8 code lines |
| `claim-image` | Up to three short claims on the left, a cropped screenshot of what they describe on the right. | `title`, `claims`, `image-1`, `punchline`* (click) | 30 |
| `code-pair` | Two code blocks side by side (before and after, or the definition and its use), one caption line. | `title`, `code-1`, `code-2`, `caption`* | 15, 8 code lines |
| `number` | One or two big measured results, then one line on why, 48px below. | `title`, `result-1`, `result-2`* (click), `why`* | 20 |
| `wrap` | Last content slide: one line per technique with this app's number, the Monday line, the question. | `title`, `line-1`, `line-2`, `line-3`*, `line-4`*, `monday`, `question` (click) | 50 |
| `exercise-start` | First slide of exercise 1: path, npm install, npm start, what the exercise is for, the running app on the right. | `title`, `steps`, `image-2`*, `note`*, `image-1` | 55 |
| `exercise-step` | One step of an exercise with nothing to show on the right: 1-4 numbered instructions, then an optional callout 48px below: a trap ("Trap: …") or what they should see ("You should see: …"). | `title`, `steps`, `callout`* | 60 |
| `exercise-step-code` | One step of an exercise: short instructions on the left, the code to write on the right. | `title`, `steps`, `code-1`, `callout`* | 50, 8 code lines |
| `exercise-step-image` | One step of an exercise: short instructions on the left, a screenshot of what they should see on the right. | `title`, `steps`, `image-1`, `callout`* | 45 |
| `exercise-result` | What the exercise measured: one or two big results, one line on why, 48px below. | `title`, `result-1`, `result-2`* (click), `why`* | 25 |

## Choosing a type

- Theory with code to show: `claim-code`. With a screenshot: `claim-image`. Two pieces of code that belong together: `code-pair`.
- A list of kinds, steps or items: `reveal-list`. Never a table.
- A number the room should remember: `number` (theory) or `exercise-result` (after an exercise).
- An exercise is a run of slides, one step each: `exercise-start` for the first slide of exercise 1, then `exercise-step`, `exercise-step-code` or `exercise-step-image`, ending with `exercise-result` when the exercise measured something. Exercises 2 to 4 open with an `exercise-step` that starts "Not happy with the result of the previous exercise?".
- Too many words for the type: split at the next step or idea. Never shrink the text.
