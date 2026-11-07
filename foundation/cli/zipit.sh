#!/usr/bin/env bash
# Student code zips: exercises.zip, solutions.zip and demo.zip. Optional arg: output directory (default: here).
# Students get exactly what they always got (see the 2026-09 root zipit.sh in git history):
#   exercises/01-simple-typescript  typescript/ with an empty simple-typescript.ts (students write it)
#   exercises/<NN-name>             steps/step-N, for exercise N (names in cli/utils.sh)
#   solutions/<NN-name>             steps/step-(N+1); the TypeScript exercise has no solution in the zip
#   demo/
# `afn test-zips` checks the result. The slide zips are built by `afn dist` (cli/slide-zips.sh).
set -e
mkdir -p "${1:-.}"
out="$(realpath "${1:-.}")"
cd "$(dirname "$(realpath "$0")")/.."
source cli/utils.sh

stage=$(mktemp -d)
trap 'rm -rf "$stage"' EXIT

copy() {
  mkdir -p "$2"
  rsync -a --exclude node_modules --exclude dist --exclude .angular --exclude '*.sh' "$1/" "$2/"
}

for n in "${!EXERCISES[@]}"; do
  for step in "steps/step-$n" "steps/step-$((n + 1))"; do
    [[ -f "$step/package.json" ]] || { echo "Error: exercise $n (${EXERCISES[$n]}) needs $step"; exit 1; }
  done
done

copy typescript "$stage/exercises/01-simple-typescript"
: > "$stage/exercises/01-simple-typescript/simple-typescript.ts"
for n in "${!EXERCISES[@]}"; do
  copy "steps/step-$n" "$stage/exercises/${EXERCISES[$n]}"
  copy "steps/step-$((n + 1))" "$stage/solutions/${EXERCISES[$n]}"
done
copy demo "$stage/demo"
# demo.zip has carried a mise.toml since 2026-08; in the repo the root mise.toml covers the demo instead.
printf '[tools]\nnode = "26"\n' > "$stage/demo/mise.toml"
cli/student-packages.sh "$stage"
# Every exercise and solution is the same app; students have always seen it as "playgrounds".
for pkg in "$stage"/{exercises,solutions}/*/package.json; do
  for f in "$pkg" "$(dirname "$pkg")/package-lock.json"; do
    jq '.name = "playgrounds" | if .packages then .packages[""].name = "playgrounds" else . end' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  done
done

cd "$stage"
for z in exercises solutions demo; do
  rm -f "$out/$z.zip"
  zip -qr "$out/$z" "$z"
done
