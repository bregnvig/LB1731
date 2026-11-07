#!/usr/bin/env bash
# Render one course's visible slides to 1280x720 JPEGs, one per slide, fragments in their final state.
# Usage: bash render-course.sh <course dir or deck folder> <course or section> <out dir>
#   bash render-course.sh advanced signals out                     # advanced/courses/signals
#   bash render-course.sh foundation/courses components out         # a Foundation section
#   bash render-course.sh foundation/exercise-slides components out # its exercise slides
# SLIDES=<slides tool dir> renders with another checkout's slides tool (theme), e.g. the branch the skill lives on.
set -euo pipefail
deck=$(realpath "$1"); course=$2; out=$(realpath -m "$3")
[[ -f "$deck/deck.json" ]] || deck="$deck/courses"  # a course dir (advanced/, foundation/) holds its deck in courses/
root=$(mktemp -d)
trap 'rm -rf "$root"' EXIT
mkdir -p "$out"
ln -s "$deck/$course" "$root/$course"
printf '{"title":"%s","slides":[],"courses":["%s"]}\n' "$course" "$course" > "$root/deck.json"
(cd "${SLIDES:-$(git -C "$deck" rev-parse --show-toplevel)/slides}" && node scripts/pdf.mjs "$root" --out "$out/$course.pdf" >/dev/null)
pdftoppm -r 96 -jpeg -jpegopt quality=85 "$out/$course.pdf" "$out/slide"
ls "$out"/slide-*.jpg | wc -l
