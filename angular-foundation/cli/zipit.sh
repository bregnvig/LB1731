#!/usr/bin/env bash
# Student zips: exercises.zip, solutions.zip and demo.zip. Optional arg: output directory (default: here).
# Students get exercises/<NN-name> and solutions/<NN-name>: exercise N is steps/step-N and its solution
# is steps/step-(N+1) (names in cli/utils.sh). The TypeScript exercise is typescript/ without its .ts
# files (students write them), and its solution is all of typescript/.
# `afn test-zips` checks the result.
set -e
mkdir -p "${1:-.}"
out="$(realpath "${1:-.}")"
cd "$(dirname "$(realpath "$0")")/.."
source cli/utils.sh

stage=$(mktemp -d)
trap 'rm -rf "$stage"' EXIT

copy() {
  mkdir -p "$2"
  rsync -a --exclude node_modules --exclude dist --exclude .angular --exclude '*.sh' "${@:3}" "$1/" "$2/"
}

steps=($(get_step_directories))
if [[ ${#steps[@]} -ne $((${#EXERCISES[@]} + 1)) ]]; then
  echo "Error: ${#EXERCISES[@]} exercises in cli/utils.sh need $((${#EXERCISES[@]} + 1)) steps, found ${#steps[@]}"
  exit 1
fi

copy typescript "$stage/exercises/01-simple-typescript" --exclude '*.ts'
copy typescript "$stage/solutions/01-simple-typescript"
for i in "${!EXERCISES[@]}"; do
  copy "${steps[$i]}" "$stage/exercises/${EXERCISES[$i]}"
  copy "${steps[$((i + 1))]}" "$stage/solutions/${EXERCISES[$i]}"
done
copy demo "$stage/demo"
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
