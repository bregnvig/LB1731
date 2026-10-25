#!/usr/bin/env bash
# Dependencies belong in angular-advanced/package.json. npm install <pkg> inside a project saves to that
# project's package.json instead, so this fails (root postinstall and zip step) when a project has its own.
cd "$(dirname "$(realpath "$0")")/.."

bad=()
for dir in demo courses/*/{labs,solutions} courses/*/*/exercise-*; do
  if [[ -f "$dir/package.json" ]] && jq -e 'keys | any(endswith("ependencies"))' "$dir/package.json" >/dev/null; then
    bad+=("$dir")
  fi
done

if [[ ${#bad[@]} -gt 0 ]]; then
  echo "Dependencies belong in angular-advanced/package.json. Remove them from:"
  printf '  %s/package.json\n' "${bad[@]}"
  echo "and add them in angular-advanced/ instead: npm install <pkg>"
  exit 1
fi
