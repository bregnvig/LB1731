---
name: lifting-a-course
description: Use when creating, rewriting, reviewing, or improving a Lund&Bendsen Angular course — slides, labs, step-N solutions, or demos. Triggers: lift the course, improve the course, overhaul the course, slides are not explicit, not intuitive, doesn't make sense in all places, students should use this on Monday, /lifting-a-course. Clone the genuine style of sibling courses.
---

# Lifting a course

A lift makes every beat followable without the instructor filling gaps, and sends the student home with a named technique they will use on Monday. Voice, canvas, playground app, and step ladder stay those of the sibling courses.

Read [references/house.md](references/house.md) before editing files. Sample three sibling courses; those samples are the style contract.

## Checklist

Copy and track:

```
- [ ] House sampled (theory, exercise, notes, lab delta, demo README)
- [ ] Diagnosis posted (spine, fails, cuts, first rewrite)
- [ ] User said to apply, or they already asked for the lift
- [ ] Slides lifted
- [ ] Labs/solutions lifted
- [ ] Demos lifted and cued from notes
- [ ] Stitched (slide ↔ lab ↔ demo)
- [ ] Verified in player, lab, and demo
```

## 1. Diagnose first

Walk the deck in order as a student, then as the instructor with notes only. Score every slide, lab, and demo:

| Bar | Fail when |
|-----|-----------|
| **Sense** | "Why now?" has no answer. Orphan topic. Contradicts a sibling module. Lab adds work the slides never asked. |
| **Explicit** | Missing path, command, click, expected result, or trap. Notes restating the title. Snippet that does not compile or match the lab. |
| **Intuitive** | Wall of bullets. Two ideas. No code, table, screenshot, or demo. Nothing to reveal. |
| **Monday** | Cannot name the technique they would use in their own app. |

Post this report **before any rewrite**:

```
# Lift diagnosis: <course>
## Spine
1. <Monday technique> — lab N, demo <path or none>
## Fails
- <file> — <Sense|Explicit|Intuitive|Monday>: <what breaks>
## Cuts or hides
- <file>: <why>
## First rewrite
1. <highest-payoff change>
```

Stop after the report unless the user already asked to apply the lift.

## 2. Spine

Three or four labs. Each lab is one Monday technique. A slide stays only if it serves a lab, a live demo of that technique, or a 30-second "don't do this". Hide or delete the rest. The wrap slide lists the techniques in the order they paid off **in this app**, and asks which one they would try at work.

## 3. Lift slides

One idea per file. Left: a few claims. Right: code, table, or screenshot from the playground app. Orange (`#FF8C00`) on APIs, paths, commands.

**Explicit:** the student-facing text has the path, the command, what they should see, and the trap. Put the trap on the slide, not only in notes.

**Intuitive:** reveal with `fragment` / `data-animate` when the point is a punchline. Cue the demo in notes: `Demo: /path`. Click X. You should see Y.

**Speaker notes** (signals is the house shape):

```
short cue
blank line
talk script, including the demo click and the question to the room
```

**Exercise slides:** follow `courses/signals/slides/exercise-*.html`. Getting-started has `labs/<course>/exercise-N`, `npm install`, `npm start`, a screenshot, location-permission if the app needs it. Later exercises start with "Not happy with the result of the previous exercise?". Commands a student types are on the slide. "Ask for help if you get stuck" is allowed; "see if you can figure it out" needs a trap or a hint next to it.

HTML contract: `slides/README.md`. Do not invent a new slide format.

## 4. Lift labs

`step-N` is exercise N. `step-(N+1)` is the solution and the start of exercise N+1 (`cli/stage-course.sh`). The diff between those two folders **is** the exercise. Nothing extra.

The solution does exactly what the slides asked. Seeded slowness or bugs must be measurable the way the slides measure. Keep the playground-finder app. Do not turn a lab into a todo list or a greenfield rewrite.

After a step change, `adv verify` for that course. A new last step becomes the last solution; zip mapping needs `adv test-zips --bless` only when asked to ship zips.

## 5. Lift demos

A demo is a mini-app the instructor clicks during theory, not a second lab.

Each demo route gets a `demo/README.md` section with **Files**, **What it shows**, numbered **Demo flow** (click → see), **Talking point**. That file is not in `demo.zip`.

The matching theory slide's notes name the route and the first click. If the notes cannot say "click this, you should see that", the demo is unfinished.

Same look as the rest of `demo/`. Projector width 1280. Stay on the playground domain.

## 6. Stitch

For each Monday technique: a theory slide, a demo or a measured before/after, a lab, a solution. Numbers, file names, and CLI commands on the slides match the lab. `courses/README.md` matches the spine. `slides/deck.json` lists the course if it is new.

## 7. Verify

1. `adv slides` — walk the stack. Notes readable in presenter view. Hidden slides stay hidden.
2. Run exercise 1 from `step-1` as a student. Then diff `step-1` → `step-2` against the exercise slides.
3. Click every demo the notes mention, following the README.
4. Read the wrap slide out loud. If it does not sound like something they will do at work, the spine is wrong — go back to step 2.

## Red flags — stop and diagnose

| Excuse | Reality |
|--------|---------|
| "I'll rewrite while I read" | Diagnosis first. The report is the work. |
| "Learning objectives / In this module you will" | Sibling courses do not talk like that. Clone them. |
| "More topics = stronger course" | Fewer techniques, each one they can take home. |
| "The lab compiles" | Compilation is not Monday. |
| "Notes can stay thin, the instructor knows" | Notes are the instructor. Cue, blank line, talk script. |
| "I'll restyle the slides" | Canvas, orange, block HTML, playground screenshots. See house.md. |
| "The demo is self-explanatory" | Cue it from the slide or it will not be shown. |

**Violating the letter of the house style is violating the spirit of the lift.**
