# Review panel

Five reviewers read the same course at the same time, each in a fresh subagent. They see the rendered slides, not only the HTML, because "too much text" and "can't read the code" only show on the image.

## Before you spawn

1. Render: `bash scripts/render-course.sh <angular-advanced dir> <course> <scratchpad>/review/render`
2. Slide check: `python3 scripts/check-slides.py <course dir>` and save the output to `<scratchpad>/review/words.txt`.
3. List the visible slides in deck order with their image (`slide-01.jpg` is the first visible entry in `deck.json`) into `<scratchpad>/review/index.txt`.

## Spawn

All five go out in one message, so they run in parallel. Each prompt is the shared brief below plus that reviewer's persona. Do not add your own diagnosis to the brief: the panel is worth having because it is not anchored on yours.

### Shared brief

```
You review the Angular course "<course>" for Lund&Bendsen. Read only, change nothing.

Inputs:
- Slides, rendered: <scratchpad>/review/render/slide-NN.jpg. Read every image.
- Slide order and file names: <scratchpad>/review/index.txt
- Slide source and speaker notes: <course dir>/slides/*.html (notes are in <aside class="notes">)
- Labs: <course dir>/step-N is exercise N, step-(N+1) is its solution
- Demo: <angular-advanced>/demo/README.md, section for this course
- Word budget report: <scratchpad>/review/words.txt
- House rules: <skill dir>/SKILL.md and references/house.md

<persona>

Report at most 15 findings, worst first, in exactly this shape:

## <reviewer name>
1. <slide file or path> | <Sense|Explicit|Intuitive|Monday|Text|Visual|Correctness> | <high|medium|low>
   Problem: <one sentence, what you saw>
   Fix: <one sentence, the concrete change>

Then one line: "Best slide: <file>, because <reason>". No other prose.
```

### Personas

**Course instructor.** You have taught Angular courses for ten years and will present this deck tomorrow from the speaker notes alone. Flag every slide where you would not know what to say, what to click, or what number to expect. Flag notes that are thin, wrong, or would run over time. Check that every demo cue works from the README. Flag the order where it forces you to say "we'll come back to that".

**Course student.** You are a developer with one year of Angular at a Danish company, sent on the course by your manager. Read the slides as you would in the room, without the notes. Flag every word you do not know, every step you could not follow, every exercise slide where you would raise your hand, and every slide where you stopped reading because there was too much text. Say what you would actually do on Monday after this course; if you cannot, that is your top finding.

**Senior Angular developer.** You know Angular 22 internals, zoneless, signals, and the DevTools profiler in depth. Flag anything technically wrong, outdated, or simplified until it is false. Check every snippet against the solution step and the current Angular API. Check that every number is plausible for this app and was measured the way the slide claims. Flag missing traps a real team would hit.

**Course critic.** You are paid to find what is wrong with courses and you are hard to impress. Flag filler slides, repetition, topics that do not serve a lab, a spine that does not hold together, weak openings, a wrap that does not land, and anything that sounds like marketing or AI-written text. Say which slides you would cut.

**Presentation expert.** You design slides for conference talks. Judge each rendered image: text volume (use words.txt), font size at the back of a room, contrast, alignment, whitespace, one idea per slide, code readable at 1280×720, screenshots cropped to the point, reveal order. Flag every slide a room would read instead of listening to the speaker. Give the concrete cut ("drop the third bullet, move it to notes").

## Merge

When all five are back, write one report. Do not pass the five reports through.

```
# Review: <course>
## Agreed (2+ reviewers)
1. <file> — <problem> → <fix>  [instructor, student]
## Single reviewer, high
1. <file> — <problem> → <fix>  [senior dev]
## Rejected
- <finding> — <why: contradicts house.md, a measured number, or another reviewer with evidence>
## Proposed changes
1. <file>: <change>
```

Check every Correctness finding yourself (open the file, run the number) before it goes in Agreed or Single. A reviewer's confidence is not evidence.

Post the report and **stop**. The user approves all, some ("1, 3, 5"), or none.

## After approval

1. Apply only the approved changes. Text cut from a slide goes to its notes unless the user said delete.
2. Re-render and run `check-slides.py` again (0 problems).
3. Send the changed slides to the course student and the presentation expert again (same brief, list only the changed files). Fix what they flag on those slides, once. Anything new and bigger goes back to the user.
4. Post: changed files, words before → after, and what the second round said.
