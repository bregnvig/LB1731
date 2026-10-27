# Angular Advanced

Course material for Angular Advanced: the exercises, the demo app, the slides and the `adv` CLI that builds and checks them.

| Folder | What's in it |
|--------|--------------|
| [`courses/`](courses/README.md) | One folder per course: its exercise steps and its slides. The README describes every course. |
| [`demo/`](demo/README.md) | The demo app shown during the courses. The README is the presenter's walkthrough (not shipped in `demo.zip`). |
| [`slides/`](slides/README.md) | Deck order, intro slides, and the tool to present, export and edit them. |
| `cli/` | The `adv` CLI (`cli/bin/adv`) and the scripts it runs. |

## Workspace

Each course folder has one `step-N` folder per state of the app: lab N is `step-N`, and solution N is `step-(N+1)`, because the solution for exercise N is the starting point for exercise N+1 (rxjs is a single app with `labs/` and `solutions/`). `cli/stage-course.sh` turns the steps into the layout students get in `labs.zip` / `solutions.zip`: `labs/<course>/exercise-N` and `solutions/<course>/exercise-N`. `adv dist` puts everything students get in `dist/` (ignored): `solutions.zip`, `demo.zip`, `labs.zip` and `angular-advanced.pdf`.

`mise.toml` pins Node 24 and puts `cli/bin/` on PATH, so the `adv` CLI (`adv help`) works anywhere inside `angular-advanced/`.

All dependencies live in `angular-advanced/package.json`, with every project as an npm workspace, so `npm install` anywhere installs there; exercises only keep their scripts, and the zips give each exercise a full `package.json` and `package-lock.json`. Add packages in `angular-advanced/` only: `npm install <pkg>` inside a project saves to that project's `package.json`, and npm can't prevent it. `cli/check-packages.sh` then fails the next `npm install`, `verify` and zip build.

`adv upgrade` moves everything to the next Angular major: it bumps the `@angular/*` versions in that one `package.json`, then runs the Angular migrations in every project.

## Slides

The slides live next to the exercises: `courses/<course>/slides/` holds each course's slides, and `slides/` holds the deck order, the intro slides and the tool. `adv slides` starts the editor (`/edit`), the presentation (`/present`) and the presenter view (`/presenter`) on http://localhost:4300, and `adv slides pdf` writes the student PDF. `slides/README.md` describes the slide files and how to work on the tool, which has its own `package.json` in `slides/`.
