# Angular Foundation

Course material for Angular Foundation: the exercises, the demo app, the slides and the `afn` CLI that builds and checks them.

| Folder | What's in it |
|--------|--------------|
| `steps/` | The exercise app, one `step-N` folder per state. |
| `typescript/` | The solution to the TypeScript exercise (`01-simple-typescript`), plain TypeScript without Angular. The exercise is the same folder without the `.ts` file. |
| `courses/` | The presentation: `deck.json` (deck title and section order), `intro/` (the front page) and `<section>/slides/`. |
| `exercise-slides/` | The exercise slides, their own deck: the cover in `intro/`, then one `<section>/slides/` per exercise, named after the presentation section it belongs to. |
| `demo/` | The demo app shown during the course. |
| `cli/` | The `afn` CLI (`cli/bin/afn`) and the scripts it runs. |

## Workspace

The exercises are one app that grows through the course, so each state of it is a `step-N` folder: exercise N starts from `step-N`, and its solution is `step-(N+1)`, because the solution for one exercise is where the next one starts. `cli/utils.sh` lists the exercise names students see. `cli/zipit.sh` turns the steps into the layout students get: `exercises.zip` with `exercises/01-simple-typescript` (only its `tsconfig.json`) and `exercises/03-create-first-component` … `08-add-some-routes`, and `solutions.zip` with `solutions/01-simple-typescript` and `solutions/03-…` … `08-…`. `afn dist` puts everything students get in `dist/` (ignored): `exercises.zip`, `solutions.zip`, `demo.zip`, `angular-foundation.pdf` and `angular-foundation-exercises.pdf`. `afn test-zips` checks the zips still match `cli/student-zips.manifest`.

| Exercise | Starts from | Solution |
|----------|-------------|----------|
| 01-simple-typescript | `typescript/` without `*.ts` | `typescript/` |
| 03-create-first-component | `step-1` | `step-2` |
| 04-create-footer-component | `step-2` | `step-3` |
| 05-include-feature-module | `step-3` | `step-4` |
| 06-create-playground-service | `step-4` | `step-5` |
| 07-work-with-async | `step-5` | `step-6` |
| 08-add-some-routes | `step-6` | `step-7` |

A change to a step usually belongs in the later steps too, since they continue from it.

`mise.toml` pins Node 24 and puts `cli/bin/` on PATH, so the `afn` CLI (`afn help`) works anywhere inside `angular-foundation/`.

All dependencies live in `angular-foundation/package.json`, with every step and the demo as an npm workspace, so `npm install` anywhere installs there; the projects only keep their scripts, and the zips give each exercise a full `package.json` and `package-lock.json`. Add packages in `angular-foundation/` only: `npm install <pkg>` inside a project saves to that project's `package.json`, and npm can't prevent it. `cli/check-packages.sh` then fails the next `npm install` and zip build.

`afn upgrade` moves everything to the next Angular major: it bumps the `@angular/*` versions in that one `package.json`, then runs the Angular migrations in every project. `afn verify all` builds and serves every step and the demo.

## Slides

There are two decks: the presentation in `courses/` and the exercises in `exercise-slides/`. The tool that presents and edits them is shared with Angular Advanced and lives in [`../slides/`](../slides/README.md).

```bash
afn presentation-slides       # http://localhost:4300 (also: afn slides)
afn exercise-slides           # http://localhost:4301
afn presentation-slides pdf   # student PDFs, in ../slides/out/
afn exercise-slides pdf
```

Each has the editor (`/edit`), the presentation (`/present`) and the presenter view (`/presenter`), so both can run side by side.
