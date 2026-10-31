---
name: lifting-a-course
description: Use when creating, rewriting, reviewing, or improving a Lund&Bendsen Angular course — slides, labs, step-N solutions, or demos. Triggers: lift the course, improve the course, overhaul the course, new course, slides are not explicit, not intuitive, doesn't make sense in all places, students should use this on Monday, review the slides, too much text on slides, /lifting-a-course.
---

# Lifting a course

A lift makes every beat followable without the instructor filling gaps, and sends the student home with a named technique they will use on Monday. Voice, canvas, playground app, and step ladder stay those of the sibling courses.

Read [references/house.md](references/house.md) before editing files. Sample three sibling courses; those samples are the style contract. Where this skill and a sibling disagree, this skill wins.

## Checklist

Copy and track:

```
- [ ] House sampled (theory, exercise, notes, lab delta, demo README)
- [ ] Review panel run and merged (references/review-panel.md)
- [ ] Diagnosis posted (spine, fails, cuts, first rewrite)
- [ ] User said to apply, or they already asked for the lift
- [ ] Every trap reproduced, every number measured (measured log written)
- [ ] Slides lifted
- [ ] Labs/solutions lifted
- [ ] Demos lifted and cued from notes
- [ ] Stitched (slide ↔ lab ↔ demo ↔ measured log)
- [ ] Verified in player, lab, and demo
- [ ] Summary posted, nothing committed
```

## 0. Review panel

When the user asks for a review, and as input to the diagnosis of a lift, run the five-reviewer panel in [references/review-panel.md](references/review-panel.md): course instructor, course student, senior Angular developer, course critic, presentation expert. Each one is a subagent, spawned together. Merge their reports into one, check correctness findings yourself, post it, and stop. Change slides only after the user approves, and only the approved changes.

## 1. Diagnose first

Walk the deck in order as a student, then as the instructor with notes only. Score every slide, lab, and demo:

| Bar | Fail when |
|-----|-----------|
| **Sense** | "Why now?" has no answer. Orphan topic. Contradicts a sibling module. Lab adds work the slides never asked. |
| **Explicit** | Missing path, command, click, expected result, or trap. Notes restating the title. Snippet that does not compile or match the lab. A number nobody measured. |
| **Intuitive** | Wall of bullets. Two ideas. No code, screenshot, or demo. A table. Nothing to reveal. |
| **Monday** | Cannot name the technique they would use in their own app. |

Post this report **before any rewrite**:

```
# Lift diagnosis: <course>
## Spine
1. <Monday technique> — lab N, demo <path or none>, number <what gets measured>
## Fails
- <file> — <Sense|Explicit|Intuitive|Monday>: <what breaks>
## Cuts or hides
- <file>: <cut|hide> — <why>
## First rewrite
1. <highest-payoff change>
```

Stop after the report unless the user already asked to apply the lift.

## 2. Spine

Three or four labs. Each lab is one Monday technique with one number that shows it worked. A slide stays only if it serves a lab, a live demo of that technique, or a 30-second "don't do this".

**Budget:** 35–50 visible slides, 60 files at most including hidden ones (siblings run 40–59 files). Over budget means cut, not shrink the type.

**Hide or delete:**

| Slide is | Do |
|----------|----|
| Correct, but off the spine (background, an expected question) | Hide: `"hidden": true` in `deck.json` |
| Wrong, outdated, duplicated, or replaced by a new slide | Delete the file and its `deck.json` entry |

Every `.html` in `slides/` is listed in `deck.json`. No orphan files.

The wrap slide has three things and nothing else:

1. One line per technique: the technique (one name or API, no explanation) → this app's number, e.g. `runOutsideAngular` ~290 → 5 bars. Order them by how much they paid off **in this app**.
2. The Monday sentence in short form, one line of at most 12 words.
3. A question to the room as a fragment: "Which one would you try at work?"

How each number was measured, and the full Monday sentence, go in the notes.

## 3. Lift slides

**Every slide is one slide type.** The types, their blocks, positions, font sizes and word limits are in [references/slide-types.md](references/slide-types.md), and each has a template in `templates/`. Make a slide by copying its template and replacing the text; never invent a layout. A slide that fits no type is two slides. `python3 scripts/check-slides.py <course dir>` enforces the types and must print `0 problem(s)`.

Over the type's word limit: cut to the claim and move the explanation to the notes, or split the slide. Never shrink the text. The room reads the slide instead of listening when there is more.

Orange (`#FF8C00`) on at most two things per slide, the key term or number, plus the "Trap:" label. Paths and identifiers are white `<code>`, UI labels `<strong>`.

**No tables.** No `<table>`, no `table` block, and no columns faked with spaces in a code block. A table makes the room read rows instead of listening. Use one of these instead:

- Categories or a list of items: short phrases, one per line, revealed one click at a time.
- Before → after: one line per number, e.g. `Detached <leaflet>` 10 → 0.
- Same vs different (zone.js vs zoneless): two short lists, what stays and what changes, or show it in the demo.
- Tool output (`ng build`, DevTools): only the line the slide talks about (`Initial total 1.77 MB`), or a cropped screenshot of the tool.

What a table would have added goes in the notes.

**Explicit:** the student-facing text has the path, the command, what they should see, and the trap. Put the trap on the slide, not only in notes.

**Intuitive:** reveal with `fragment` / `data-animate` when the point is a punchline. Cue the demo in notes: `Demo: /path`. Click X. You should see Y.

**Speaker notes** are for delivery only: what to click, the number to expect, what to say. No authoring history ("cut from the slide", "moved here", "so it fits"); that belongs in the commit message. Signals is the house shape:

```
short cue
blank line
talk script, including the demo click and the question to the room
```

**Snippets:** a slide snippet has the same tokens in the same order as the solution file. Allowed differences are line wraps and indentation to fit the block, and `// …` for omitted lines. Nothing renamed, nothing simplified. If the snippet must differ, change the solution.

**One step per exercise slide.** An exercise is a run of slides, one step each: getting started, measure before, each change, measure after, bonus. Title them `Exercise N - <step>` and name the files `exercise-N-<step>.html`. When a slide goes over its type's word limit or holds two steps, split it at the step boundary; never shrink the type. A step that still doesn't fit gets a `-2` slide with the same title.

**Exercise slides:** follow `courses/signals/slides/exercise-*.html` and house.md. Commands a student types are on the slide. "Ask for help if you get stuck" is allowed; "see if you can figure it out" needs a trap or a hint next to it.

**Credit people.** A slide built on someone's idea, quote, or model names them on the slide (name, role, source). Notes carry the full citation (title, edition, publisher, year).

HTML contract: `slides/README.md`. Do not invent a new slide format.

## 4. Lift labs

`step-N` is exercise N. `step-(N+1)` is the solution and the start of exercise N+1 (`cli/stage-course.sh`). The diff between those two folders **is** the exercise: what the exercise slides ask, plus the bonus if the slides have one, and nothing else.

A bonus is allowed when its exercise slide labels it **Bonus**, exercise N+1 works without it, and its code is in the solution step.

The solution does exactly what the slides asked. Keep the playground-finder app. Do not turn a lab into a todo list or a greenfield rewrite.

**Seeded problems:** each lab seeds the problem its technique fixes. Before writing the slide, run step-N and see the problem with the tool the slide names (profiler, build output, heap snapshot, console). Then run step-(N+1) and see it gone. Both numbers go in the measured log.

**Specs in labs:** test names quote literal values, e.g. ``it(`shows 'Ingen beskrivelse' when …`)``. Each test has `// Arrange`, `// Act`, `// Assert` comments. Slide snippets keep both.

After a step change, run `adv verify` for that course from the main checkout. In a worktree, build the step with `npx ng build` instead: `adv verify` runs `npm install`, which replaces the worktree's `node_modules` symlink. Run `adv test-zips --bless` only when asked to ship zips.

## 5. Lift demos

A demo is a mini-app the instructor clicks during theory, not a second lab.

Each demo route gets a `demo/README.md` section with **Files**, **What it shows**, numbered **Demo flow** (click → see), **Talking point**. That file is not in `demo.zip`.

The matching theory slide's notes name the route, the start command if it is not `npm start`, and the first click. If the notes cannot say "click this, you should see that", the demo is unfinished.

Same look as the rest of `demo/`. Projector width 1280. Stay on the playground domain.

## 6. Measure and reproduce

Every number, count, size, or "you should see" on a slide, in notes, or in a demo README comes from a run, not from memory or docs.

- **Measured log.** `courses/<course>/MEASURED.md`, in the repo, not in the student zips: one line per number on a slide or in notes, with the step or route, the exact command or clicks, and the result. Commit it with the slides. A slide number without a line there is a fail. Never keep it only in a scratchpad: it gets cleaned up.
- **Run it the way the student runs it.** Same step folder, same command as the slide, a fresh tab. Headless Chromium with Playwright is fine for counts; the screenshot comes from the same run.
- **Reproduce every trap.** Make the mistake in the lab and watch the symptom the slide describes. If it does not reproduce in this app, cut the trap or find one that does.
- **Rule out the tool before blaming the app.** Known false positives:
  - DevTools retains nodes. `$0`, console-logged elements, and test-script element handles show up under "(Global handles) / DevTools console" in a heap snapshot. Clear the console and snapshot from a fresh tab before calling it a leak.
  - Dev server HMR loads `@defer` chunks eagerly. Serve with `--no-hmr` or a production build to see real lazy loading.
  - Dev builds run extra checks and ship bigger bundles. Bundle sizes come from `ng build` output.
  - Extensions and other tabs skew profiler and memory numbers. Use a clean profile.
- **One command form.** Pick one spelling per command (`npm start`, `npm run start:no-hmr`, `npx ng build`) and use it on every slide, note, and README line.

## 7. Stitch

Each Monday technique has a theory slide, a demo or a measured before/after, a lab, a solution, and a log line. Numbers, file names, and CLI commands on the slides match the lab and the log. `courses/README.md` matches the spine. `slides/deck.json` lists the course if it is new.

## 8. Verify

1. `python3 scripts/check-slides.py --all <course dir>` prints `0 problem(s)`. `adv slides`: walk the stack. Notes readable in presenter view. Hidden slides stay hidden. Every `deck.json` entry has a file and every file has an entry.
2. Run exercise 1 from `step-1` as a student. Diff each `step-N` → `step-(N+1)` against its exercise slides, and each slide snippet against the solution file.
3. Click every demo the notes mention, following the README and the start command in the notes.
4. Check every slide number against the measured log.
5. Read the wrap slide out loud. If it does not sound like something they will do at work, the spine is wrong: go back to step 2.

## 9. Git

- The lift never commits, pushes, or updates a PR. When it is verified, post a short summary of what changed and wait for the user to say go.
- Work in a worktree under `.claude/worktrees/<branch>`. The main checkout stays on `master`.
- No AI attribution: no `Co-Authored-By` or session trailers in commits, no "Generated with" line or session link in PR bodies.
- PR bodies start with `## Why`, then `## What`.

## Red flags — stop and diagnose

| Excuse | Reality |
|--------|---------|
| "I'll rewrite while I read" | Diagnosis first. The report is the work. |
| "Learning objectives / In this module you will" | Sibling courses do not talk like that. Clone them. |
| "More topics = stronger course" | Fewer techniques, each one they can take home. |
| "The lab compiles" | Compilation is not Monday. |
| "The docs say it's about 60% smaller" | Run it. The slide shows this app's number. |
| "Everyone knows this trap" | Reproduce it here or cut it. |
| "The heap snapshot shows a leak" | Rule out DevTools retainers first. |
| "The snippet is close enough" | Same tokens as the solution, or change the solution. |
| "It's a small extra in the solution" | Not on the slide, not in the diff. |
| "Notes can stay thin, the instructor knows" | Notes are the instructor. Cue, blank line, talk script. |
| "I'll restyle the slides" | Canvas, orange, block HTML, playground screenshots. See house.md. |
| "It needs all this text to be explicit" | Explicit lives in the notes and the exercise slides. Each slide type has a word limit (references/slide-types.md). |
| "I'll apply the panel's findings right away" | Post the merged report and wait for approval. |
| "This slide needs its own layout" | Pick a type from slide-types.md, or split it into two slides that each fit one. |
| "This is clearer as a table" | Rows are read, not heard. One line per item, revealed by click. |
| "The demo is self-explanatory" | Cue it from the slide or it will not be shown. |
| "I'll commit so it's safe" | The user commits. Summarize and wait. |

**Violating the letter of the house style is violating the spirit of the lift.**
