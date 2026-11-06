#!/usr/bin/env bash
# Usage: cli/stage-course.sh <course> <labs dir> <solutions dir>
# Copies a course into the layout students get: lab N = step-N and solution N = step-(N+1),
# since the solution of exercise N is where exercise N+1 starts. rxjs is one app with labs/ and solutions/.
set -e
labs="$(realpath -m "$2")"
solutions="$(realpath -m "$3")"
cd "$(dirname "$(realpath "$0")")/../courses/$1"

copy() {
  mkdir -p "$2"
  rsync -a --exclude node_modules --exclude dist --exclude .angular --exclude '*.sh' "$1/" "$2/"
  if [[ -n "$3" ]]; then
    jq --arg name "$3" '.name = $name' "$2/package.json" > "$2/package.json.tmp"
    mv "$2/package.json.tmp" "$2/package.json"
  fi
}

if [[ -d labs ]]; then
  copy labs "$labs"
  copy solutions "$solutions"
  exit
fi

steps=$(ls -d step-* | wc -l)
for ((n = 1; n < steps; n++)); do
  copy "step-$n" "$labs/exercise-$n" "$1-lab-$n"
  copy "step-$((n + 1))" "$solutions/exercise-$n" "$1-solution-$n"
done
