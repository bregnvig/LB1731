#!/usr/bin/env bash
# Depends on: utils.sh (get_all_directories)
# Versions live in angular-advanced/package.json, so npm bumps them once there. Each project
# then runs the migrations (code and angular.json changes) ng update would have run in it.

upgrade_angular() {
  local to="$1"
  shift || true
  local from
  from=$(jq -r '.dependencies["@angular/core"]' package.json | grep -o '[0-9]\+' | head -1)
  if [[ ! "$from" =~ ^[0-9]+$ ]]; then
    echo "Error: can't read the @angular/core version from package.json"
    return 1
  fi
  to="${to:-$(npm view @angular/core version | cut -d. -f1)}"

  if [[ ! "$to" =~ ^[0-9]+$ ]]; then
    echo "Error: '$to' is not a major version (try: adv upgrade $((from + 1)))"
    return 1
  fi
  if (( to <= from )); then
    echo "Already on Angular $from (asked for $to)"
    return 1
  fi
  # A clean tree makes git diff the review of the upgrade, and git restore its undo.
  if ! git diff --quiet HEAD -- . || [[ -n "$(git ls-files --others --exclude-standard .)" ]]; then
    echo "Error: commit your changes in angular-advanced/ first, so git diff shows only the upgrade"
    return 1
  fi

  local packages
  packages=($(jq -r '(.dependencies + .devDependencies) | keys[] | select(test("^@angular(-devkit)?/"))' package.json | sed "s/\$/@^$to/"))
  echo "Angular $from → $to: ${packages[*]} $*"
  if ! npm install "${packages[@]}" "$@"; then
    echo ""
    echo "npm install failed. Packages that don't support Angular $to yet (peer dependency errors above)"
    echo "can be upgraded in the same step: adv upgrade $to <package>@<version> ..."
    echo "Undo: git restore package.json package-lock.json"
    return 1
  fi

  local dir pkg failed=()
  for dir in $(get_all_directories); do
    echo ""
    echo "--- Migrating $dir ---"
    for pkg in @angular/cli @angular/core; do
      (cd "$dir" && npx ng update "$pkg" --migrate-only --from="$from" --to="$to" --allow-dirty) || failed+=("$dir ($pkg)")
    done
  done

  echo ""
  if [[ ${#failed[@]} -gt 0 ]]; then
    echo "Migrations failed in:"
    printf '  %s\n' "${failed[@]}"
  fi
  echo "Review with git diff, then: adv verify all && adv test-zips"
  [[ ${#failed[@]} -eq 0 ]]
}
