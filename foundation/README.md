# Angular Foundation

| Folder | What's in it |
|--------|--------------|
| `steps/` | The playground app, one `step-N` per state: exercise N starts at `step-N`, and its solution is `step-(N+1)` (exercises 4-9, so `step-4` … `step-10`). |
| `typescript/` | Exercise 2, the TypeScript primer (no Angular). |
| `presentation/` | The deck, exercise slides included. `cd ../slides && npm start -- ../foundation/presentation` |
| `demo/` | The demo app shown during the course. Its own project (Angular 22), not part of the workspace. |

All dependencies live in `package.json`, with every step as an npm workspace, so one `npm install` here installs them all; steps only keep their scripts. Add packages here, not inside a step.

`./zipit.sh [out dir]` writes what students get to `dist/`: `exercises.zip` and `solutions.zip`, with the folder names the slides use (`exercises/03-create-first-component`, …). Each project in the zips gets the full dependencies and its own `package-lock.json`.
