# Angular Upgrade & workspace.sh Refactor

**Date:** 2026-03-19
**Status:** Draft

## Problem

- Most lab/solution exercises are stuck on Angular 20.3.1 while demo, rxjs, and components are already on Angular 21.x
- `workspace.sh` is a single 370-line file mixing CLI parsing, install logic, upgrade logic, and directory resolution
- No way to verify that exercises actually build and serve after an upgrade
- `smart_install` has hardcoded package names, making it brittle for future dependency conflicts

## Goals

1. Upgrade all labs and solutions to Angular 21.x
2. Refactor `workspace.sh` into focused modules for maintainability
3. Add a `verify` command to confirm exercises can install, build, and serve
4. Make `smart_install` more resilient to dependency conflicts
5. Ensure the whole workflow is repeatable for future Angular upgrades

## Non-Goals

- Migrating Jest to Vitest (separate future effort)
- Changing exercise content beyond what `ng update` migrations require
- Parallel verification (sequential is fine; ~52 directories)

## Constraints

- **Jest must be preserved:** The unit-test exercises (labs + solutions, 8 directories) use Jest via `@angular-builders/jest` and `jest-preset-angular`. After `ng update`, verify that `angular.json` still uses the `@angular-builders/jest:run` builder and that `jest.config.js`, `setup-jest.ts`, and `tsconfig.spec.json` are intact. If `ng update` overwrites these, restore them.

## Design

### Module Structure

Split `workspace.sh` into focused scripts:

```
workspace.sh                # Entry point: arg parsing + dispatch only
scripts/
  utils.sh                  # get_course_directories, get_all_directories, run_in_directories
  install.sh                # smart_install logic
  upgrade.sh                # upgrade_with_install, upgrade_bootstrap
  verify.sh                 # new: build/serve verification
```

`workspace.sh` sources the scripts and acts as the CLI router. Each module is independently readable and maintainable.

### workspace.sh (Entry Point)

Responsibilities:
- Parse command and target arguments
- Source `scripts/*.sh`
- Dispatch to the appropriate function
- Show help

No business logic lives here. Verifies each sourced script file exists before sourcing. The `install` command with no target (root workspace install via temporary `package.json`) is preserved here as a special case since it doesn't operate on individual exercise directories. Uses `set -e` for early failures (missing scripts, bad args) but individual directory-processing functions handle errors internally so one directory's failure doesn't abort the rest.

### scripts/utils.sh

Contains:
- `get_course_directories <course>` — resolve labs/solutions directories for a course, handling both flat (`labs/rxjs/package.json`) and nested (`labs/unit-test/exercise-*/package.json`) structures
- `get_all_directories` — all directories with `package.json` across demo, labs, and solutions
- `run_in_directories <command> <dirs...>` — execute a command in each directory

### scripts/install.sh

Contains `smart_install <dir>`:
1. Attempt `npm install`
2. On failure, capture stderr and parse `ERESOLVE` output (npm 7+) to extract conflicting package names. Strategy: extract all unique non-`@angular/*` package names mentioned in the ERESOLVE block (any scoped or unscoped package names appearing in conflict lines). The goal is to identify third-party packages with stale peer dependencies.
3. Attempt `npm install <pkg>@latest` for each detected conflicting package
4. Retry `npm install`
5. If no packages were detected from the error output, or if retry still fails, fallback to `--legacy-peer-deps`

Improvement over current: generic ERESOLVE-based conflict detection instead of hardcoded package list. Falls through gracefully if parsing finds nothing.

### scripts/upgrade.sh

Contains:
- `upgrade_bootstrap <dir>` — version-aware bootstrap/ng-bootstrap/fontawesome upgrade
- `upgrade_with_install <dirs...>` — for each dir: smart_install, upgrade_bootstrap, `ng update @angular/cli @angular/core`, `ng update --all`. Traps errors per-directory and continues processing remaining directories, collecting failures for a summary at the end (does not use `set -e` for the directory loop).
- `update_directories <dirs...>` — lighter alternative: only runs `ng update @angular/cli @angular/core` without smart_install or bootstrap upgrades (preserves the existing `update` command)

**Jest config preservation:** Before running `ng update` in a directory, if `jest.config.js` exists, snapshot `angular.json`, `jest.config.js`, `setup-jest.ts`, and `tsconfig.spec.json`. After `ng update`, check if the `@angular-builders/jest:run` builder in `angular.json` was replaced. If so, restore all snapshots. This is automated, not manual.

### scripts/verify.sh

New command: `./workspace.sh verify [target]`

Contains `verify_directory <dir>`:
1. Run `smart_install` — report pass/fail
2. Run `ng build` — report pass/fail
3. Run `ng serve`, wait for "Compiled successfully" or a timeout (60s), then kill via SIGTERM — report pass/fail. Uses `--port 0` to let the OS assign a port (the script only needs to detect "Compiled successfully" in stdout, not connect to the port).
4. Return exit code

Contains `verify_directories <dirs...>`:
- Run `verify_directory` for each dir
- Collect results
- Print summary table at the end:

```
Directory                              Install  Build  Serve
labs/unit-test/exercise-1              PASS     PASS   PASS
labs/unit-test/exercise-2              PASS     FAIL   SKIP
...
```

Directories that fail install skip build/serve. Directories that fail build skip serve.

### Execution Plan

1. **Refactor** `workspace.sh` into modules (pure refactor, no behavior change)
2. **Run** `./workspace.sh upgrade all` to upgrade everything to Angular 21.x
3. **Fix issues** that arise during upgrade — improve scripts to handle them automatically for future runs
4. **Run** `./workspace.sh verify all` to confirm everything installs, builds, and serves
5. **Fix remaining issues** — improve scripts again as needed
6. **Commit** the upgraded exercises and improved scripts

### Future Upgrade Workflow

After this work, upgrading to a new Angular version becomes:

```bash
./workspace.sh upgrade all    # Upgrade everything
./workspace.sh verify all     # Confirm it all works
```

If issues arise, fix them in the scripts so the next upgrade is even smoother.
