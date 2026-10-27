# TODO

## Angular Advanced

- [ ] Replace `"baseUrl": "./"` + `"ignoreDeprecations": "6.0"` with `"paths": { "src/*": ["./src/*"] }` in every `tsconfig.json`. TypeScript 6 deprecates `baseUrl` and TypeScript 7 removes it, together with the `ignoreDeprecations` opt-out. The code imports `src/app/...` paths, so `paths` has to replace `baseUrl`, not just delete it.
- [x] DI: `environment.prod.ts` is missing `location` and `playgroundsURL`, so `ng build` fails in `labs/di/exercise-2..3` and `solutions/di/exercise-1..3`. (#11)
- [x] Unit test: `app-routes.ts` imports `./login/login.component`, which only exists in `solutions/unit-test/exercise-4`. Content left as is; `verify` runs `ng test` for this course, lab 1 is an expected failure. (#12)
- [x] Zip manifest test: `workspace.sh test-zips` checks that `labs.zip`, `solutions.zip` and `demo.zip` keep the structure students get. (#13)
- [x] Restructure to `angular-advanced/courses/<course>/{labs,solutions}/exercise-N` with `git mv`. Zips keep the old layout. (#14)
- [x] One `angular-advanced/package.json` with all dependencies. Exercises keep a scripts-only `package.json`; the zip step merges the dependencies in and copies the shared lockfile. (#15, stacked on #14)
- [x] `adv upgrade` for the next Angular major: bumps the `@angular/*` versions in the root `package.json`, then runs `ng update --migrate-only` in each project. (#20)
- [x] Merge solution N and lab N+1 into `courses/<course>/step-k`. 17 drifted files resolved: the version later steps continue wins; state-management keeps the solution; unit-test solution 2 = lab 3 (includes the unhappy-path answer). (#16, stacked on #15)
- [x] `mise.toml` pinning Node 24 and putting the CLI on PATH: `workspace.sh` became `.bin/adv`. (#17, stacked on #16)
- [x] `angular-advanced/slides/` next to `demo/` and `courses/`: player, presenter view, PDF and editor. (#18, landed with #19; follow-up #21)
- [ ] Exercise slides in every course except signals: exact commands, matching the steps. Audit 2026-10-26 (signals did this in #22):
  - Wrong folders: components ex3 (`exercise-4` -> `labs/components/exercise-3`), pipes ex4 (`exercise-3` -> `exercise-4`), pipes ex2-4 (`labs/pipes-directives` -> `labs/pipes-and-directives`), di ex1 (`labs/di` -> `labs/di/exercise-1`).
  - Missing generate commands: components ex1, pipes ex4, reactive-forms ex3, routing ex1. Set `skipTests: true` in each course's `angular.json` schematics like signals, then: `npx ng g c sidebar/sidebar-list-item -s`, `npx ng g d directive/is-in-role`, `npx ng g c edit-playground-control -t -s`, `npx ng g c map -s`. Check that the generated files match the next step.
  - Plain `ng serve` -> `npm start` (routing, rxjs, state-management, pipes ex4); `ng g` -> `npx ng g` (unit-test ex1, ex4).
  - `npm install` everywhere, never `npm i`.
  - Missing install/start commands: di ex1-3, components ex2-3, state-management ex2-3. di: say `npm run aarhus` needs a second terminal.
  - unit-test: `ng g s` generates `@Service()` in Angular 22. Update step-2 and later steps from `@Injectable({ providedIn: 'root' })` to `@Service()`.
  - rxjs ex4 and extra: `labs\rxjs` -> `labs/rxjs`, "got to" -> "go to". unit-test ex4: name the folder `labs/unit-test/exercise-4`.
  - Each command on its own line (pipes ex3 wraps mid-command).
  - pipes step-4/5 include `focus.directive.ts` from a hidden bonus slide.
- [ ] Drop `changeDetection: ChangeDetectionStrategy.OnPush` everywhere: it's the default since v22 (`ng g c` leaves it out), and spelling it out contradicts the "OnPush is the default" slide. Signals is done. Left: about 70 component files across the other eight courses' steps, 28 files in `demo/`, and the slides `components/the-changedetection-property-2.html` and `routing/read-data-set-by-resolver.html`. Exceptions to decide on: components exercise 3 ("Speeding up the application") starts from all-`Eager` and asks for OnPush, so reword it to "remove `Eager` where it's safe" and let step-4 delete the `Eager` lines; the demo's change-detection examples that put `Eager` and OnPush side by side can keep it. Needs `adv verify all` and `adv test-zips --bless`.
- [ ] Switch the builders from `@angular-devkit/build-angular:*` to `@angular/build:*` (`application`, `dev-server`, `extract-i18n`): `ng serve` warns that the Webpack package is deprecated. The projects already use the esbuild `application` builder, so it's a rename. Signals is done. Left: di, pipes-and-directives, reactive-forms, routing, rxjs (labs, solutions) and state-management. Once nothing uses it, drop `@angular-devkit/build-angular` from the root `package.json`. Needs `adv verify all` and `adv test-zips --bless`.

## Repo

- [x] Delete the empty root `package-lock.json` (`"packages": {}`, left over from the Angular v20 commit).
- [ ] Shrink the clone. Today's cleanup took the checkout from 88.6 MB to 60.8 MB, but `.git` is still 72 MB packed because history keeps every deleted file. `examples.zip` alone is 42.5 MB of that (added 2017-09-23 in 2b33eb79, removed the next day); old `package-lock.json` versions are most of the rest. Removing them means rewriting history (`git filter-repo --path examples.zip --invert-paths`, maybe `--strip-blobs-bigger-than`), so every commit hash changes: force-push master, close or merge open PRs first, and every clone and worktree has to re-clone. GitHub keeps the old objects reachable through `refs/pull/*` until GitHub Support purges them. Decide first whether ~60% off the clone is worth that.
