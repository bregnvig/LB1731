#!/usr/bin/env bash
#
# Rebuild the exercise chain from the solutions.
#
# Each exercise is the *previous* step's solution: a student starting exercise
# N+1 begins from the finished code of solution N. This script regenerates that
# relationship.
#
# It MIRRORS rather than merges: files deleted from a solution are also deleted
# from the exercise it feeds. (The old `cp -R src/. dst` only ever overlaid
# files, so anything removed from a solution lingered in the exercise forever.)
#
# node_modules/ and .angular/ are excluded from both the copy and the delete,
# so each folder keeps its own install and build cache untouched.
#
# Usage:
#   ./sync-solutions-exercises.sh          # dry run - show what would change
#   ./sync-solutions-exercises.sh --run    # apply the changes

set -euo pipefail

cd "$(dirname "$0")"

# solution -> exercise it becomes
PAIRS=(
  "solutions/03-create-first-component:exercises/04-create-footer-component"
  "solutions/04-create-footer-component:exercises/05-include-feature-module"
  "solutions/05-include-feature-module:exercises/06-create-playground-service"
  "solutions/06-create-playground-service:exercises/07-work-with-async"
  "solutions/07-work-with-async:exercises/08-add-some-routes"
)

# Kept out of the mirror entirely: never copied, never deleted from the target.
# Build and tooling artifacts only. Deliberately NOT the same list as zipit.sh,
# which additionally drops **/di/* and **/*.sh when packaging for students -
# those are real exercise content and must stay in sync here.
EXCLUDES=(
  --exclude='node_modules/'
  --exclude='.angular/'
  --exclude='dist/'
  --exclude='tmp/'
  --exclude='out-tsc/'
  --exclude='.git/'
  --exclude='.claude/'
  --exclude='.DS_Store'
)

DRY_RUN=true
case "${1:-}" in
  --run) DRY_RUN=false ;;
  "") ;;
  -h|--help) sed -n '3,18p' "$0" | sed 's/^# \?//'; exit 0 ;;
  *) echo "unknown option: $1 (use --run, or no arguments for a dry run)" >&2; exit 1 ;;
esac

RSYNC_FLAGS=(-a --delete)
if $DRY_RUN; then
  # -i itemises each change; -n makes it a preview only.
  RSYNC_FLAGS=(-ain --delete)
  echo "DRY RUN - nothing will be changed. Re-run with --run to apply."
  echo
fi

for pair in "${PAIRS[@]}"; do
  src="${pair%%:*}"
  dst="${pair##*:}"

  [ -d "$src" ] || { echo "missing source: $src" >&2; exit 1; }
  [ -d "$dst" ] || { echo "missing target: $dst" >&2; exit 1; }

  echo "$src -> $dst"
  # Trailing slashes matter: they copy the *contents* of src into dst
  # rather than nesting src inside it.
  rsync "${RSYNC_FLAGS[@]}" "${EXCLUDES[@]}" "$src/" "$dst/"
done

echo
if $DRY_RUN; then
  echo "Dry run complete. Re-run with --run to apply."
else
  echo "Sync complete."
fi
