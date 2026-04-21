#!/usr/bin/env bash

# Extract conflicting non-Angular package names from npm ERESOLVE output.
# Looks for scoped (@foo/bar) and unscoped package names in conflict lines.
extract_conflicting_packages() {
  local npm_output="$1"
  local packages=()

  # Extract package names from ERESOLVE peer dependency lines
  # Matches both quoted ("pkg@\"version\"") and unquoted ("pkg@version") formats
  local found
  found=$(echo "$npm_output" | grep -oE '((@[a-zA-Z0-9_-]+/)?[a-zA-Z0-9_-]+)@["^~>=]*[0-9]' | sed 's/@[^@]*$//' | sort -u || true)

  for pkg in $found; do
    # Skip @angular/* packages — those are handled by ng update
    if [[ "$pkg" != @angular/* ]]; then
      packages+=("$pkg")
    fi
  done

  echo "${packages[@]}"
}

smart_install() {
  local dir="$1"

  echo "Attempting clean install in $dir"
  if (cd "$dir" && npm install 2>/dev/null); then
    echo "✓ Clean install successful"
    return 0
  fi

  echo "Clean install failed, analyzing dependency conflicts..."

  local npm_output
  npm_output=$(cd "$dir" && npm install 2>&1 || true)

  local potential_packages
  potential_packages=($(extract_conflicting_packages "$npm_output"))

  if [[ ${#potential_packages[@]} -gt 0 ]]; then
    echo "Found conflicting packages: ${potential_packages[*]}"
    echo "Attempting to update them to compatible versions..."

    for pkg in "${potential_packages[@]}"; do
      echo "Updating $pkg to latest version..."
      if (cd "$dir" && npm install "$pkg@latest" --save 2>/dev/null); then
        echo "✓ Updated $pkg successfully"
      else
        echo "⚠ Could not update $pkg automatically"
      fi
    done

    echo "Retrying install after package updates..."
    if (cd "$dir" && npm install 2>/dev/null); then
      echo "✓ Install successful after package updates"
      return 0
    fi
  fi

  echo "Automatic conflict resolution failed, using legacy peer deps as fallback..."
  (cd "$dir" && npm install --legacy-peer-deps)
}
