#!/usr/bin/env bash
# Render one course's visible slides to 1280x720 JPEGs, one per slide, fragments in their final state.
# Usage: bash render-course.sh <advanced dir> <course> <out dir>
# SLIDES=<slides tool dir> renders with another checkout's slides tool (theme), e.g. the branch the skill lives on.
set -euo pipefail
adv=$(realpath "$1"); course=$2; out=$(realpath -m "$3")
root=$(mktemp -d)
trap 'rm -rf "$root"' EXIT
mkdir -p "$out"
ln -s "$adv/courses/$course" "$root/$course"
printf '{"title":"%s","slides":[],"courses":["%s"]}\n' "$course" "$course" > "$root/deck.json"
(cd "${SLIDES:-$adv/../slides}" && node scripts/pdf.mjs "$root" --out "$out/$course.pdf" >/dev/null)
pdftoppm -r 96 -jpeg -jpegopt quality=85 "$out/$course.pdf" "$out/slide"
ls "$out"/slide-*.jpg | wc -l
