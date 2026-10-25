#!/usr/bin/env bash
# Usage: scripts/student-packages.sh <staged dir>
# Exercises only keep name and scripts in package.json; versions live in angular-advanced/package.json.
# Students install each exercise on its own, so every staged package.json gets the shared
# dependencies, and a package-lock.json copied from the shared one under the exercise's name.
set -e
root="$(dirname "$(realpath "$0")")/.."

find "$1" -name package.json -not -path '*/node_modules/*' | while read -r pkg; do
  name=$(jq -r .name "$pkg")
  jq --slurpfile root "$root/package.json" '. + ($root[0] | {dependencies, devDependencies, overrides})' \
    "$pkg" > "$pkg.tmp" && mv "$pkg.tmp" "$pkg"
  jq --arg name "$name" '.name = $name | .packages[""].name = $name' \
    "$root/package-lock.json" > "$(dirname "$pkg")/package-lock.json"
done
