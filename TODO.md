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

## Repo

- [x] Delete the empty root `package-lock.json` (`"packages": {}`, left over from the Angular v20 commit).
