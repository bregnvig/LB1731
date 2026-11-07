# Angular Foundation

Course material for Angular Foundation: the exercises, the demo app, the slides and the `afn` CLI that builds and checks them. It works like [`../advanced/`](../advanced/README.md), with one difference: Advanced is a collection of courses, each with its own app, while Foundation is one course whose app grows through every section. So the steps sit next to the deck instead of inside a course.

| Folder | What's in it |
|--------|--------------|
| `steps/` | The exercise app, one `step-N` folder per state, numbered like the exercises on the slides. |
| `typescript/` | Exercise 2, the TypeScript primer: plain TypeScript, outside the app. `simple-typescript.ts` is the solution; students get it empty. |
| `courses/` | The presentation deck: `deck.json` (title and section order), `intro/` (the front page) and one `<section>/slides/` per section. |
| `exercise-slides/` | The exercise slides, their own deck: the cover in `intro/`, then one `<section>/slides/` per section that has an exercise. |
| `demo/` | The demo app shown during the course. |
| `cli/` | The `afn` CLI (`cli/bin/afn`) and the scripts it runs. |

## Workspace

Exercise N starts from `step-N`, and its solution is `step-(N+1)`, because the solution for one exercise is where the next one starts. That's the same rule as in Advanced. Exercises 1 and 3 have no app (installing, `ng new`), and exercise 2 is `typescript/`, so the steps run from `step-4` to `step-10`. A change to a step usually belongs in the later steps too, since they continue from it.

| Exercise | Students get | Starts from | Solution |
|----------|--------------|-------------|----------|
| 2 | `01-simple-typescript` | `typescript/` with an empty `simple-typescript.ts` | not in the zip |
| 4 | `03-create-first-component` | `step-4` | `step-5` |
| 5 | `04-create-footer-component` | `step-5` | `step-6` |
| 6 | `05-include-feature-module` | `step-6` | `step-7` |
| 7 | `06-create-playground-service` | `step-7` | `step-8` |
| 8 | `07-work-with-async` | `step-8` | `step-9` |
| 9 | `08-add-some-routes` | `step-9` | `step-10` |

`cli/utils.sh` maps exercise numbers to the folder names students see.

The root `mise.toml` pins Node 24 and puts `cli/bin/` on PATH, so the `afn` CLI (`afn help`) works anywhere in the repo.

All dependencies live in `foundation/package.json`, with every step and the demo as an npm workspace, so `npm install` anywhere installs there; the projects only keep their scripts, and the zips give each project a full `package.json` and `package-lock.json`. Add packages in `foundation/` only: `npm install <pkg>` inside a project saves to that project's `package.json`, and npm can't prevent it. `cli/check-packages.sh` then fails the next `npm install` and zip build.

`afn upgrade` moves everything to the next Angular major: it bumps the `@angular/*` versions in that one `package.json`, then runs the Angular migrations in every project. `afn verify all` builds and serves every step and the demo.

## What students get

Students get exactly what they have always got. Don't change these: names, folders and how they open them.

`afn dist` writes the five zips to `dist/` (ignored):

| Zip | Contents | Built by |
|-----|----------|----------|
| `exercises.zip` | `exercises/01-simple-typescript`, `exercises/03-…` … `08-…` | `cli/zipit.sh` |
| `solutions.zip` | `solutions/03-…` … `08-…` | `cli/zipit.sh` |
| `demo.zip` | `demo/` | `cli/zipit.sh` |
| `slides.zip` | `slides/`: the presentation, opens from `index.html` with no server | `cli/slide-zips.sh` |
| `slides-exercises.zip` | `slides-exercises/`: the exercise slides, the same way | `cli/slide-zips.sh` |

`afn test-zips` checks that the code zips still match `cli/student-zips.manifest` (every file's path and hash). The slide zips are exported from the decks by the shared slides tool (`npm run export` in `../slides`), so they change whenever a slide does.

## Slides

There are two decks: the presentation in `courses/` and the exercises in `exercise-slides/`. The tool that presents and edits them is shared with Angular Advanced and lives in [`../slides/`](../slides/README.md).

```bash
afn presentation-slides       # http://localhost:4300 (also: afn slides)
afn exercise-slides           # http://localhost:4301
afn presentation-slides pdf   # a PDF, in ../slides/out/
afn exercise-slides pdf
```

Each has the editor (`/edit`), the presentation (`/present`) and the presenter view (`/presenter`), so both can run side by side.
