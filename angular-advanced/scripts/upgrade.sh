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
