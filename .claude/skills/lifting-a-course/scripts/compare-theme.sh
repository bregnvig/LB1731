#!/usr/bin/env bash
# Prove a slides-tool or theme change leaves untyped courses untouched: render every course except the
# ones named in SKIP with two slides-tool checkouts and count slides that differ.
# Usage: bash compare-theme.sh <advanced dir> <slides tool before> <slides tool after> <out dir>
#   e.g. bash compare-theme.sh ~/LB1731/advanced ~/LB1731/slides <worktree>/slides /tmp/cmp
# SKIP="performance" leaves out typed courses, where a change is meant to show. Both tools must be built (npx ng build).
set -euo pipefail
adv=$(realpath "$1"); before=$(realpath "$2"); after=$(realpath "$3"); out=$(realpath -m "$4")
here=$(dirname "$0"); total=0; changed=0
for dir in "$adv"/courses/*/slides/deck.json; do
  c=$(basename "$(dirname "$(dirname "$dir")")")
  [[ " ${SKIP:-} " == *" $c "* ]] && continue
  SLIDES=$before bash "$here/render-course.sh" "$adv" "$c" "$out/before/$c" >/dev/null
  SLIDES=$after bash "$here/render-course.sh" "$adv" "$c" "$out/after/$c" >/dev/null
  for f in "$out/before/$c"/slide-*.jpg; do
    total=$((total + 1))
    ae=$(magick compare -metric AE -fuzz 8% "$f" "$out/after/$c/$(basename "$f")" null: 2>&1 | cut -d' ' -f1)
    if [ "${ae%.*}" -gt 200 ]; then changed=$((changed + 1)); echo "differs: $c/$(basename "$f")"; fi
  done
done
echo "$changed of $total slides differ"
[ "$changed" -eq 0 ]
