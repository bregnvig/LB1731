#!/usr/bin/env bash
# Student zips: solutions.zip, demo.zip and labs.zip. Optional arg: output directory (default: here).
# Students keep the layout the slides use (labs/<course>/exercise-N), so courses/<course>/{labs,solutions}
# is copied into that layout before zipping. ./workspace.sh test-zips checks the result.
set -e
out="$(realpath "${1:-.}")"
cd "$(dirname "$(realpath "$0")")"

stage=$(mktemp -d)
trap 'rm -rf "$stage"' EXIT
exclude=(--exclude node_modules --exclude dist --exclude .angular --exclude '*.sh')

for course in courses/*/; do
  course=$(basename "$course")
  for kind in labs solutions; do
    mkdir -p "$stage/$kind"
    rsync -a "${exclude[@]}" "courses/$course/$kind/" "$stage/$kind/$course/"
  done
done
rsync -a "${exclude[@]}" demo/ "$stage/demo/"

cd "$stage"
for z in solutions demo labs; do
  rm -f "$out/$z.zip"
  zip -r "$out/$z" "$z"
done
