#!/usr/bin/env bash
# Usage: scripts/student-packages.sh <staged dir>
# Exercises only keep name and scripts in package.json; versions live in angular-advanced/package.json,
# which lists them as workspaces (npm install in an exercise installs there).
# Students install each exercise on its own, so every staged package.json gets the shared
# dependencies, and a package-lock.json copied from the shared one under the exercise's name.
set -e
root="$(dirname "$(realpath "$0")")/.."
"$root/scripts/check-packages.sh"

find "$1" -name package.json -not -path '*/node_modules/*' | while read -r pkg; do
  name=$(jq -r .name "$pkg")
  jq --slurpfile root "$root/package.json" '. + ($root[0] | {dependencies, devDependencies, overrides})' \
    "$pkg" > "$pkg.tmp" && mv "$pkg.tmp" "$pkg"
  # Drop the workspace entries and the root postinstall flag: students get one project, not the workspace
  jq --arg name "$name" '.name = $name | .packages[""].name = $name | del(.packages[""].workspaces, .packages[""].hasInstallScript)
    | .packages |= with_entries(select(.key == "" or (.key | startswith("node_modules/")) and (.value.link | not)))' \
    "$root/package-lock.json" > "$(dirname "$pkg")/package-lock.json"
done
