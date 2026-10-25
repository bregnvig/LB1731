#!/usr/bin/env bash
# Student zip check: build the zips with zipit.sh and compare every file (path + sha256)
# with tests/student-zips.manifest, so students keep getting exactly what they always got.

ZIP_MANIFEST="tests/student-zips.manifest"

# Print "<sha256>  <path>" for every file in the zips, sorted by path.
zip_manifest() {
  local tmp
  tmp=$(mktemp -d)
  if ! ./zipit.sh "$tmp" >/dev/null; then
    rm -rf "$tmp"
    return 1
  fi
  mkdir "$tmp/x"
  for z in "$tmp"/*.zip; do
    unzip -q "$z" -d "$tmp/x"
  done
  (cd "$tmp/x" && find . -type f | sed 's|^\./||' | LC_ALL=C sort | xargs -d '\n' sha256sum)
  rm -rf "$tmp"
}

test_zips() {
  local current
  current=$(mktemp)
  zip_manifest > "$current" || { rm -f "$current"; echo "Error: zipit.sh failed"; return 1; }

  if [[ "${1:-}" == "--bless" ]]; then
    mkdir -p "$(dirname "$ZIP_MANIFEST")"
    mv "$current" "$ZIP_MANIFEST"
    echo "Wrote $ZIP_MANIFEST ($(wc -l < "$ZIP_MANIFEST") files)"
    return 0
  fi

  if [[ ! -f "$ZIP_MANIFEST" ]]; then
    rm -f "$current"
    echo "Error: $ZIP_MANIFEST missing. Create it with: adv test-zips --bless"
    return 1
  fi

  if diff -u --label "$ZIP_MANIFEST" --label "zips now" "$ZIP_MANIFEST" "$current"; then
    echo "✓ Student zips match $ZIP_MANIFEST ($(wc -l < "$current") files)"
    rm -f "$current"
    return 0
  fi
  rm -f "$current"
  echo "✗ Student zips differ from $ZIP_MANIFEST (- expected, + now)."
  echo "  Intended? Review the diff, then: adv test-zips --bless"
  return 1
}
