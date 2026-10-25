#!/usr/bin/env bash

set -e  # Fail fast for module loading and arg parsing

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source modules
for module in utils verify zips; do
  if [[ ! -f "$SCRIPT_DIR/scripts/$module.sh" ]]; then
    echo "Error: Missing script module: scripts/$module.sh"
    exit 1
  fi
  source "$SCRIPT_DIR/scripts/$module.sh"
done

show_help() {
  echo "Usage: workspace.sh [command] [target]"
  echo ""
  echo "Commands:"
  echo "  install, i       Install npm packages (one package.json for everything)"
  echo "  verify, v        Verify directories build and serve"
  echo "  test-zips, tz    Check student zips match tests/student-zips.manifest (--bless to update)"
  echo "  help, h          Show this help"
  echo ""
  echo "Targets (verify):"
  echo "  -a, all          All labs, solutions, and demo"
  echo "  demo             Demo directory only"
  echo "  [course]         Specific course (courses/[course]/labs and courses/[course]/solutions)"
  echo ""
  echo "Examples:"
  echo "  ./workspace.sh install          # npm install in angular-advanced/"
  echo "  ./workspace.sh verify all       # Verify all directories build and serve"
  echo "  ./workspace.sh verify di        # Verify courses/di/labs and courses/di/solutions"
  echo "  ./workspace.sh test-zips        # Students still get the same zips?"
}

# Resolve target to list of directories
resolve_target() {
  local target="$1"
  case "$target" in
    "-a"|"all")
      get_all_directories
      ;;
    "demo")
      echo "demo"
      ;;
    "")
      echo ""
      ;;
    *)
      get_course_directories "$target"
      ;;
  esac
}

# Parse arguments
command="${1:-help}"
target="${2:-}"

case "$command" in
  "install"|"i")
    npm install
    ;;

  "verify"|"v")
    set +e  # Directory-processing functions handle errors internally
    if [[ -z "$target" ]]; then
      echo "Error: Target required for verify command"
      show_help
      exit 1
    fi
    directories=($(resolve_target "$target"))
    if [[ ${#directories[@]} -eq 0 ]]; then
      echo "Error: Target '$target' not found"
      exit 1
    fi
    verify_directories "${directories[@]}"
    ;;

  "test-zips"|"tz")
    test_zips "$target"
    ;;

  "help"|"h"|"")
    show_help
    ;;

  *)
    echo "Error: Unknown command '$command'"
    show_help
    exit 1
    ;;
esac
