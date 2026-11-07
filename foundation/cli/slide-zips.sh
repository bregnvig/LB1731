#!/usr/bin/env bash
# Student slide zips: slides.zip (the presentation) and slides-exercises.zip (the exercise slides).
# Optional arg: output directory (default: here). As students always got them: a folder that opens
# from index.html with no server, now exported by the shared slides tool (npm run export in ../slides).
set -e
mkdir -p "${1:-.}"
out="$(realpath "${1:-.}")"
cd "$(dirname "$(realpath "$0")")/.."
root="$PWD"

stage=$(mktemp -d)
trap 'rm -rf "$stage"' EXIT

(cd ../slides && npm run -s build >/dev/null \
  && npm run -s export -- "$root/courses" --out "$stage/slides" >/dev/null \
  && npm run -s export -- "$root/exercise-slides" --out "$stage/slides-exercises" >/dev/null)

cd "$stage"
for z in slides slides-exercises; do
  rm -f "$out/$z.zip"
  zip -qr "$out/$z" "$z"
done
