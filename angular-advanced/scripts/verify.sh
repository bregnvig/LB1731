#!/usr/bin/env bash
# Depends on: install.sh (smart_install)

verify_directory() {
  local dir="$1"
  local install_result="SKIP"
  local build_result="SKIP"
  local serve_result="SKIP"

  if [[ ! -d "$dir" || ! -f "$dir/package.json" ]]; then
    echo "Skipping $dir (not found or no package.json)" >&2
    echo "$dir|SKIP|SKIP|SKIP"
    return 1
  fi

  echo "" >&2
  echo "--- Verifying $dir ---" >&2

  # Step 1: Install
  if smart_install "$dir" >&2; then
    install_result="PASS"
  else
    install_result="FAIL"
    echo "$dir|$install_result|$build_result|$serve_result"
    return 1
  fi

  # Step 2: Build
  if (cd "$dir" && npx ng build) >&2 2>&1; then
    build_result="PASS"
  else
    build_result="FAIL"
    echo "$dir|$install_result|$build_result|$serve_result"
    return 1
  fi

  # Step 3: Serve — start, wait for compilation, kill
  local serve_log
  serve_log=$(mktemp)

  # Use setsid to create a process group so we can kill the entire tree
  setsid bash -c "cd \"$dir\" && npx ng serve --port 0" > "$serve_log" 2>&1 &
  local serve_pgid=$!

  local elapsed=0
  local timeout_secs=60
  while [[ $elapsed -lt $timeout_secs ]]; do
    if grep -q "Compiled successfully\|Application bundle generation complete" "$serve_log" 2>/dev/null; then
      serve_result="PASS"
      break
    fi
    if ! kill -0 "$serve_pgid" 2>/dev/null; then
      serve_result="FAIL"
      break
    fi
    sleep 2
    elapsed=$((elapsed + 2))
  done

  if [[ "$serve_result" == "SKIP" ]]; then
    serve_result="TIMEOUT"
  fi

  # Kill the entire process group to avoid orphaned ng serve processes
  kill -- -"$serve_pgid" 2>/dev/null || true
  wait "$serve_pgid" 2>/dev/null || true
  rm -f "$serve_log"

  echo "$dir|$install_result|$build_result|$serve_result"
}

verify_directories() {
  local directories=("$@")
  local results=()

  for dir in "${directories[@]}"; do
    local result
    result=$(verify_directory "$dir" | tail -1)
    results+=("$result")
  done

  # Print summary table
  echo ""
  echo "========================================="
  echo "VERIFICATION SUMMARY"
  echo "========================================="
  printf "%-45s %-10s %-10s %-10s\n" "Directory" "Install" "Build" "Serve"
  printf "%-45s %-10s %-10s %-10s\n" "---------" "-------" "-----" "-----"

  local all_pass=true
  for result in "${results[@]}"; do
    IFS='|' read -r dir install build serve <<< "$result"
    printf "%-45s %-10s %-10s %-10s\n" "$dir" "$install" "$build" "$serve"
    if [[ "$install" != "PASS" || "$build" != "PASS" || "$serve" != "PASS" ]]; then
      all_pass=false
    fi
  done

  echo "========================================="
  if $all_pass; then
    echo "All directories verified successfully!"
    return 0
  else
    echo "Some directories failed verification."
    return 1
  fi
}
