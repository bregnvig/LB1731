#!/usr/bin/env bash
# Student zips: exercises.zip and solutions.zip. Optional arg: output directory (default: dist/).
# Exercise N starts at steps/step-N and its solution is steps/step-(N+1). Students keep the folder
# names the slides use (exercises/03-create-first-component, ...), so steps are staged under those.
# Steps only keep name and scripts in package.json; each staged project gets the shared dependencies
# and a package-lock.json cut from the workspace one, so students install every exercise on its own.
set -e
cd "$(dirname "$(realpath "$0")")"
mkdir -p "${1:-dist}"
out="$(realpath "${1:-dist}")"

# Folder students get for exercise N
declare -A NAMES=(
  [4]=03-create-first-component [5]=04-create-footer-component [6]=05-include-feature-module
  [7]=06-create-playground-service [8]=07-work-with-async [9]=08-add-some-routes
)

stage=$(mktemp -d)
trap 'rm -rf "$stage"' EXIT

copy() {
  mkdir -p "$2"
  rsync -a --exclude node_modules --exclude dist --exclude .angular "$1/" "$2/"
}

copy typescript "$stage/exercises/01-simple-typescript"
for n in "${!NAMES[@]}"; do
  copy "steps/step-$n" "$stage/exercises/${NAMES[$n]}"
  copy "steps/step-$((n + 1))" "$stage/solutions/${NAMES[$n]}"
done

find "$stage" -name package.json | while read -r pkg; do
  name=$(basename "$(dirname "$pkg")")
  jq --arg name "$name" --slurpfile root package.json '.name = $name | . + ($root[0] | {dependencies, devDependencies})' \
    "$pkg" > "$pkg.tmp" && mv "$pkg.tmp" "$pkg"
  # Drop the workspace entries: students get one project, not the workspace
  jq --arg name "$name" '.name = $name | .packages[""].name = $name | del(.packages[""].workspaces)
    | .packages |= with_entries(select(.key == "" or (.key | startswith("node_modules/")) and (.value.link | not)))' \
    package-lock.json > "$(dirname "$pkg")/package-lock.json"
done

cd "$stage"
for z in exercises solutions; do
  rm -f "$out/$z.zip"
  zip -qr "$out/$z" "$z"
done
echo "$out/exercises.zip $out/solutions.zip"
