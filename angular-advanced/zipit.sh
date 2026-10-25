#!/usr/bin/env bash
# Student zips: solutions.zip, demo.zip and labs.zip. Optional arg: output directory (default: here).
# Students keep the layout the slides use (labs/<course>/exercise-N), so scripts/stage-course.sh copies
# courses/<course>/step-N into that layout before zipping. ./workspace.sh test-zips checks the result.
set -e
out="$(realpath "${1:-.}")"
cd "$(dirname "$(realpath "$0")")"

stage=$(mktemp -d)
trap 'rm -rf "$stage"' EXIT

for course in courses/*/; do
  course=$(basename "$course")
  scripts/stage-course.sh "$course" "$stage/labs/$course" "$stage/solutions/$course"
done
rsync -a --exclude node_modules --exclude dist --exclude .angular --exclude '*.sh' demo/ "$stage/demo/"
scripts/student-packages.sh "$stage"

cd "$stage"
for z in solutions demo labs; do
  rm -f "$out/$z.zip"
  zip -r "$out/$z" "$z"
done
