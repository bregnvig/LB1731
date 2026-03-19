# Angular Upgrade & workspace.sh Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade all labs/solutions to Angular 21.x and refactor workspace.sh into maintainable modules with a new verify command.

**Architecture:** Split the monolithic workspace.sh into `scripts/{utils,install,upgrade,verify}.sh` modules sourced by a thin entry point. Add generic ERESOLVE conflict detection to smart_install, Jest config preservation to the upgrade flow, and a new verify command that confirms install/build/serve for all exercises.

**Tech Stack:** Bash, Angular CLI (`ng update`), npm

**Spec:** `docs/superpowers/specs/2026-03-19-angular-upgrade-and-workspace-refactor-design.md`

---

## File Structure

```
workspace.sh                    # MODIFY — strip to entry point + dispatch only
scripts/
  utils.sh                      # CREATE — directory resolution + run_in_directories
  install.sh                    # CREATE — smart_install with generic ERESOLVE parsing
  upgrade.sh                    # CREATE — upgrade_bootstrap, upgrade_with_install, Jest preservation
  verify.sh                     # CREATE — verify_directory, verify_directories, summary table
```

---

### Task 1: Extract scripts/utils.sh

**Files:**
- Create: `scripts/utils.sh`

- [ ] **Step 0: Create scripts directory**

Run: `mkdir -p scripts`

- [ ] **Step 1: Create `scripts/utils.sh`**

```bash
#!/usr/bin/env bash

# Resolve lab+solution directories for a course.
# Handles both flat (labs/rxjs/package.json) and nested (labs/unit-test/exercise-*/package.json).
get_course_directories() {
  local course="$1"
  local dirs=()

  for base in labs solutions; do
    if [[ -d "$base/$course" ]]; then
      if [[ -f "$base/$course/package.json" ]]; then
        dirs+=("$base/$course")
      else
        for exercise_dir in $base/$course/*/; do
          if [[ -d "$exercise_dir" && -f "$exercise_dir/package.json" ]]; then
            dirs+=("${exercise_dir%/}")
          fi
        done
      fi
    fi
  done

  echo "${dirs[@]}"
}

# All directories with package.json across demo, labs, and solutions.
get_all_directories() {
  local dirs=()

  if [[ -d "demo" && -f "demo/package.json" ]]; then
    dirs+=("demo")
  fi

  for base in labs solutions; do
    if [[ -d "$base" ]]; then
      for course_dir in $base/*/; do
        if [[ -d "$course_dir" ]]; then
          course_dir="${course_dir%/}"
          if [[ -f "$course_dir/package.json" ]]; then
            dirs+=("$course_dir")
          else
            for exercise_dir in $course_dir/*/; do
              if [[ -d "$exercise_dir" && -f "$exercise_dir/package.json" ]]; then
                dirs+=("${exercise_dir%/}")
              fi
            done
          fi
        fi
      done
    fi
  done

  echo "${dirs[@]}"
}

# Execute a command string in each directory.
run_in_directories() {
  local command="$1"
  local directories=("${@:2}")

  for dir in "${directories[@]}"; do
    if [[ -d "$dir" && -f "$dir/package.json" ]]; then
      echo "Running '$command' in $dir"
      (cd "$dir" && eval "$command")
    else
      echo "Skipping $dir (not found or no package.json)"
    fi
  done
}
```

- [ ] **Step 2: Verify file was created**

Run: `bash -n scripts/utils.sh && echo "Syntax OK"`
Expected: `Syntax OK`

- [ ] **Step 3: Commit**

```bash
git add scripts/utils.sh
git commit -m "refactor: extract utils.sh from workspace.sh"
```

---

### Task 2: Extract scripts/install.sh with generic ERESOLVE parsing

**Files:**
- Create: `scripts/install.sh`

- [ ] **Step 1: Create `scripts/install.sh`**

Replace the hardcoded package list with generic ERESOLVE parsing. Extract all unique non-`@angular/*` package names from the npm error output.

```bash
#!/usr/bin/env bash

# Extract conflicting non-Angular package names from npm ERESOLVE output.
# Looks for scoped (@foo/bar) and unscoped package names in conflict lines.
extract_conflicting_packages() {
  local npm_output="$1"
  local packages=()

  # Extract package names from ERESOLVE peer dependency lines
  # Matches both quoted ("pkg@\"version\"") and unquoted ("pkg@version") formats
  local found
  found=$(echo "$npm_output" | grep -oE '((@[a-zA-Z0-9_-]+/)?[a-zA-Z0-9_-]+)@["^~>=]*[0-9]' | sed 's/@[^@]*$//' | sort -u || true)

  for pkg in $found; do
    # Skip @angular/* packages — those are handled by ng update
    if [[ "$pkg" != @angular/* ]]; then
      packages+=("$pkg")
    fi
  done

  echo "${packages[@]}"
}

smart_install() {
  local dir="$1"

  echo "Attempting clean install in $dir"
  if (cd "$dir" && npm install 2>/dev/null); then
    echo "✓ Clean install successful"
    return 0
  fi

  echo "Clean install failed, analyzing dependency conflicts..."

  local npm_output
  npm_output=$(cd "$dir" && npm install 2>&1 || true)

  local potential_packages
  potential_packages=($(extract_conflicting_packages "$npm_output"))

  if [[ ${#potential_packages[@]} -gt 0 ]]; then
    echo "Found conflicting packages: ${potential_packages[*]}"
    echo "Attempting to update them to compatible versions..."

    for pkg in "${potential_packages[@]}"; do
      echo "Updating $pkg to latest version..."
      if (cd "$dir" && npm install "$pkg@latest" --save 2>/dev/null); then
        echo "✓ Updated $pkg successfully"
      else
        echo "⚠ Could not update $pkg automatically"
      fi
    done

    echo "Retrying install after package updates..."
    if (cd "$dir" && npm install 2>/dev/null); then
      echo "✓ Install successful after package updates"
      return 0
    fi
  fi

  echo "Automatic conflict resolution failed, using legacy peer deps as fallback..."
  (cd "$dir" && npm install --legacy-peer-deps)
}
```

- [ ] **Step 2: Verify file was created**

Run: `bash -n scripts/install.sh && echo "Syntax OK"`
Expected: `Syntax OK`

- [ ] **Step 3: Commit**

```bash
git add scripts/install.sh
git commit -m "refactor: extract install.sh with generic ERESOLVE conflict detection"
```

---

### Task 3: Extract scripts/upgrade.sh with Jest config preservation

**Files:**
- Create: `scripts/upgrade.sh`

- [ ] **Step 1: Create `scripts/upgrade.sh`**

```bash
#!/usr/bin/env bash
# Depends on: utils.sh (run_in_directories), install.sh (smart_install)

upgrade_bootstrap() {
  local dir="$1"

  if [[ -d "$dir" && -f "$dir/package.json" ]]; then
    echo "Upgrading bootstrap and related packages in $dir"

    local ng_major
    ng_major=$(grep -o '"@angular/core":\s*"[^"]*"' "$dir/package.json" | grep -o '[0-9]\+' | head -1)

    local packages=()

    if grep -q "@ng-bootstrap/ng-bootstrap" "$dir/package.json"; then
      if [[ "$ng_major" -ge 21 ]] 2>/dev/null; then
        packages+=("@ng-bootstrap/ng-bootstrap@latest")
      else
        packages+=("@ng-bootstrap/ng-bootstrap@19")
      fi
    fi

    if grep -q "@fortawesome/angular-fontawesome" "$dir/package.json"; then
      if [[ "$ng_major" -ge 21 ]] 2>/dev/null; then
        packages+=("@fortawesome/angular-fontawesome@latest")
      else
        packages+=("@fortawesome/angular-fontawesome@3")
      fi
    fi

    if grep -q '"bootstrap"' "$dir/package.json"; then
      packages+=("bootstrap@latest")
    fi

    if [[ ${#packages[@]} -gt 0 ]]; then
      echo "  Updating packages: ${packages[*]}"
      (cd "$dir" && npm install "${packages[@]}" --save)
    else
      echo "  No bootstrap-related packages found"
    fi

    echo "  Done with $dir"
  fi
}

# Snapshot Jest config files before ng update, restore if overwritten.
snapshot_jest_config() {
  local dir="$1"
  local snapshot_dir="$dir/.jest-snapshot"

  if [[ -f "$dir/jest.config.js" ]]; then
    mkdir -p "$snapshot_dir"
    for f in angular.json jest.config.js setup-jest.ts tsconfig.spec.json; do
      if [[ -f "$dir/$f" ]]; then
        cp "$dir/$f" "$snapshot_dir/$f"
      fi
    done
    echo "  Snapshotted Jest config files in $dir"
  fi
}

restore_jest_config_if_needed() {
  local dir="$1"
  local snapshot_dir="$dir/.jest-snapshot"

  if [[ ! -d "$snapshot_dir" ]]; then
    return 0
  fi

  # Check if the Jest builder was replaced in angular.json
  if ! grep -q '@angular-builders/jest:run' "$dir/angular.json" 2>/dev/null; then
    echo "  ⚠ Jest builder was replaced by ng update — restoring Jest config files"
    for f in angular.json jest.config.js setup-jest.ts tsconfig.spec.json; do
      if [[ -f "$snapshot_dir/$f" ]]; then
        cp "$snapshot_dir/$f" "$dir/$f"
      fi
    done
  fi

  rm -rf "$snapshot_dir"
}

upgrade_with_install() {
  local directories=("$@")
  local failed=()

  for dir in "${directories[@]}"; do
    if [[ ! -d "$dir" || ! -f "$dir/package.json" ]]; then
      echo "Skipping $dir (not found or no package.json)"
      continue
    fi

    echo ""
    echo "========================================="
    echo "Upgrading $dir"
    echo "========================================="

    if ! (
      trap 'rm -rf "$dir/.jest-snapshot"' EXIT
      smart_install "$dir"
      upgrade_bootstrap "$dir"
      snapshot_jest_config "$dir"
      echo "Upgrading Angular core packages in $dir"
      (cd "$dir" && npx ng update @angular/cli @angular/core --force --allow-dirty)
      echo "Upgrading third-party Angular packages in $dir"
      (cd "$dir" && npx ng update --all --force --allow-dirty 2>/dev/null || echo "Some packages couldn't be auto-upgraded (this is normal)")
      restore_jest_config_if_needed "$dir"
    ); then
      echo "⚠ FAILED: $dir"
      failed+=("$dir")
    fi
  done

  if [[ ${#failed[@]} -gt 0 ]]; then
    echo ""
    echo "========================================="
    echo "UPGRADE SUMMARY — ${#failed[@]} failures:"
    for dir in "${failed[@]}"; do
      echo "  ✗ $dir"
    done
    echo "========================================="
  fi
}

# Lighter alternative: only ng update without smart_install or bootstrap upgrades.
update_directories() {
  local directories=("$@")
  run_in_directories "npx ng update @angular/cli @angular/core --force --allow-dirty" "${directories[@]}"
}
```

- [ ] **Step 2: Verify file was created**

Run: `bash -n scripts/upgrade.sh && echo "Syntax OK"`
Expected: `Syntax OK`

- [ ] **Step 3: Commit**

```bash
git add scripts/upgrade.sh
git commit -m "refactor: extract upgrade.sh with Jest config preservation"
```

---

### Task 4: Create scripts/verify.sh

**Files:**
- Create: `scripts/verify.sh`

- [ ] **Step 1: Create `scripts/verify.sh`**

```bash
#!/usr/bin/env bash
# Depends on: install.sh (smart_install)

verify_directory() {
  local dir="$1"
  local install_result="SKIP"
  local build_result="SKIP"
  local serve_result="SKIP"

  if [[ ! -d "$dir" || ! -f "$dir/package.json" ]]; then
    echo "Skipping $dir (not found or no package.json)" >&2
    echo "$dir|SKIP|SKIP|SKIP"
    return 1
  fi

  echo "" >&2
  echo "--- Verifying $dir ---" >&2

  # Step 1: Install
  if smart_install "$dir" >&2; then
    install_result="PASS"
  else
    install_result="FAIL"
    echo "$dir|$install_result|$build_result|$serve_result"
    return 1
  fi

  # Step 2: Build
  if (cd "$dir" && npx ng build) >&2 2>&1; then
    build_result="PASS"
  else
    build_result="FAIL"
    echo "$dir|$install_result|$build_result|$serve_result"
    return 1
  fi

  # Step 3: Serve — start, wait for compilation, kill
  local serve_log
  serve_log=$(mktemp)

  # Use setsid to create a process group so we can kill the entire tree
  setsid bash -c "cd \"$dir\" && npx ng serve --port 0" > "$serve_log" 2>&1 &
  local serve_pgid=$!

  local elapsed=0
  local timeout_secs=60
  while [[ $elapsed -lt $timeout_secs ]]; do
    if grep -q "Compiled successfully\|Application bundle generation complete" "$serve_log" 2>/dev/null; then
      serve_result="PASS"
      break
    fi
    if ! kill -0 "$serve_pgid" 2>/dev/null; then
      serve_result="FAIL"
      break
    fi
    sleep 2
    elapsed=$((elapsed + 2))
  done

  if [[ "$serve_result" == "SKIP" ]]; then
    serve_result="TIMEOUT"
  fi

  # Kill the entire process group to avoid orphaned ng serve processes
  kill -- -"$serve_pgid" 2>/dev/null || true
  wait "$serve_pgid" 2>/dev/null || true
  rm -f "$serve_log"

  echo "$dir|$install_result|$build_result|$serve_result"
}

verify_directories() {
  local directories=("$@")
  local results=()

  for dir in "${directories[@]}"; do
    local result
    result=$(verify_directory "$dir" | tail -1)
    results+=("$result")
  done

  # Print summary table
  echo ""
  echo "========================================="
  echo "VERIFICATION SUMMARY"
  echo "========================================="
  printf "%-45s %-10s %-10s %-10s\n" "Directory" "Install" "Build" "Serve"
  printf "%-45s %-10s %-10s %-10s\n" "---------" "-------" "-----" "-----"

  local all_pass=true
  for result in "${results[@]}"; do
    IFS='|' read -r dir install build serve <<< "$result"
    printf "%-45s %-10s %-10s %-10s\n" "$dir" "$install" "$build" "$serve"
    if [[ "$install" != "PASS" || "$build" != "PASS" || "$serve" != "PASS" ]]; then
      all_pass=false
    fi
  done

  echo "========================================="
  if $all_pass; then
    echo "All directories verified successfully!"
    return 0
  else
    echo "Some directories failed verification."
    return 1
  fi
}
```

- [ ] **Step 2: Verify file was created**

Run: `bash -n scripts/verify.sh && echo "Syntax OK"`
Expected: `Syntax OK`

- [ ] **Step 3: Commit**

```bash
git add scripts/verify.sh
git commit -m "feat: add verify.sh for post-upgrade build/serve verification"
```

---

### Task 5: Rewrite workspace.sh as thin entry point

**Files:**
- Modify: `workspace.sh`

- [ ] **Step 1: Rewrite `workspace.sh`**

Replace the entire file with a thin entry point that sources the modules and dispatches commands.

```bash
#!/usr/bin/env bash

set -e  # Fail fast for module loading and arg parsing

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source modules
for module in utils install upgrade verify; do
  if [[ ! -f "$SCRIPT_DIR/scripts/$module.sh" ]]; then
    echo "Error: Missing script module: scripts/$module.sh"
    exit 1
  fi
  source "$SCRIPT_DIR/scripts/$module.sh"
done

show_help() {
  echo "Usage: workspace.sh [command] [target]"
  echo ""
  echo "Commands:"
  echo "  install, i       Install npm packages"
  echo "  update, u        Update Angular core packages (lightweight)"
  echo "  upgrade, ng      Full upgrade: install, bootstrap, Angular core + third-party"
  echo "  verify, v        Verify directories can install, build, and serve"
  echo "  help, h          Show this help"
  echo ""
  echo "Targets:"
  echo "  -a, all          All labs, solutions, and demo"
  echo "  demo             Demo directory only"
  echo "  [course]         Specific course (labs/[course] and solutions/[course])"
  echo ""
  echo "Examples:"
  echo "  ./workspace.sh upgrade all      # Full upgrade of all directories"
  echo "  ./workspace.sh upgrade di       # Full upgrade of labs/di and solutions/di"
  echo "  ./workspace.sh verify all       # Verify all directories install, build, serve"
  echo "  ./workspace.sh install all      # Install packages in all directories"
}

# Resolve target to list of directories
resolve_target() {
  local target="$1"
  case "$target" in
    "-a"|"all")
      get_all_directories
      ;;
    "demo")
      echo "demo"
      ;;
    "")
      echo ""
      ;;
    *)
      get_course_directories "$target"
      ;;
  esac
}

# Parse arguments
command="${1:-help}"
target="${2:-}"

case "$command" in
  "install"|"i")
    set +e  # Don't abort on individual directory failures
    if [[ -z "$target" ]]; then
      # Root install with workspace setup
      echo '{
  "name": "angular-advanced",
  "workspaces": [
    "./demo",
    "./solutions/*",
    "./solutions/**/*",
    "./labs/*",
    "./labs/**/*"
  ]
}' > package.json
      npm install --force
      rm package.json package-lock.json
    else
      directories=($(resolve_target "$target"))
      if [[ ${#directories[@]} -eq 0 ]]; then
        echo "Error: Target '$target' not found"
        exit 1
      fi
      for dir in "${directories[@]}"; do
        smart_install "$dir"
      done
    fi
    ;;

  "update"|"u")
    export CI=true
    if [[ -z "$target" ]]; then
      echo "Error: Target required for update command"
      show_help
      exit 1
    fi
    directories=($(resolve_target "$target"))
    if [[ ${#directories[@]} -eq 0 ]]; then
      echo "Error: Target '$target' not found"
      exit 1
    fi
    update_directories "${directories[@]}"
    ;;

  "upgrade"|"ng")
    set +e  # Directory-processing functions handle errors internally
    export CI=true
    if [[ -z "$target" ]]; then
      echo "Error: Target required for upgrade command"
      show_help
      exit 1
    fi
    directories=($(resolve_target "$target"))
    if [[ ${#directories[@]} -eq 0 ]]; then
      echo "Error: Target '$target' not found"
      exit 1
    fi
    echo "Upgrading Angular and Bootstrap in ${#directories[@]} directories..."
    upgrade_with_install "${directories[@]}"
    echo "Upgrade complete!"
    ;;

  "verify"|"v")
    set +e  # Directory-processing functions handle errors internally
    if [[ -z "$target" ]]; then
      echo "Error: Target required for verify command"
      show_help
      exit 1
    fi
    directories=($(resolve_target "$target"))
    if [[ ${#directories[@]} -eq 0 ]]; then
      echo "Error: Target '$target' not found"
      exit 1
    fi
    verify_directories "${directories[@]}"
    ;;

  "help"|"h"|"")
    show_help
    ;;

  *)
    echo "Error: Unknown command '$command'"
    show_help
    exit 1
    ;;
esac
```

- [ ] **Step 2: Verify syntax**

Run: `bash -n workspace.sh && echo "Syntax OK"`
Expected: `Syntax OK`

- [ ] **Step 3: Smoke test help**

Run: `./workspace.sh help`
Expected: Shows help text with all commands including `verify, v`

- [ ] **Step 4: Commit**

```bash
git add workspace.sh
git commit -m "refactor: rewrite workspace.sh as thin entry point sourcing script modules"
```

---

### Task 6: Run the upgrade

- [ ] **Step 1: Run the full upgrade**

Run: `cd /home/johannes/projects/LB1731/angular-advanced && ./workspace.sh upgrade all`

This will take a while. It processes all ~55 directories. Watch for:
- `smart_install` failures (dependency conflicts)
- `ng update` failures
- Jest config restoration messages ("Jest builder was replaced")

- [ ] **Step 2: Review the git diff**

Run: `git diff --stat`

Check that:
- `package.json` files have Angular 21.x versions
- `angular.json` files in unit-test exercises still use `@angular-builders/jest:run`
- No unexpected file deletions or content changes in exercise source code

- [ ] **Step 3: Fix any issues**

If specific directories failed, investigate and fix. If the fix is generalizable, update the relevant script module. Re-run the upgrade for failed directories only:

Run: `./workspace.sh upgrade <course-name>`

- [ ] **Step 4: Commit the upgrade**

```bash
git add -A
git commit -m "chore: upgrade all labs and solutions to Angular 21.x"
```

---

### Task 7: Run verification

- [ ] **Step 1: Run verify on all directories**

Run: `./workspace.sh verify all`

This runs install, build, and serve for each directory and prints a summary table.

- [ ] **Step 2: Fix any failures**

For each failed directory:
1. Check the failure stage (install/build/serve)
2. Investigate the error
3. Fix the issue
4. If the fix is generalizable, update the relevant script module
5. Re-run: `./workspace.sh verify <course-name>`

- [ ] **Step 3: Re-run full verification**

Run: `./workspace.sh verify all`

Expected: All directories show PASS for Install, Build, and Serve.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve post-upgrade build/serve issues"
```
