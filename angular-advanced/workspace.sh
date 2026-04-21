#!/usr/bin/env bash

set -e  # Fail fast for module loading and arg parsing

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source modules
for module in utils install upgrade verify; do
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
  echo "  install, i       Install npm packages"
  echo "  update, u        Update Angular core packages (lightweight)"
  echo "  upgrade, ng      Full upgrade: install, bootstrap, Angular core + third-party"
  echo "  verify, v        Verify directories can install, build, and serve"
  echo "  help, h          Show this help"
  echo ""
  echo "Targets:"
  echo "  -a, all          All labs, solutions, and demo"
  echo "  demo             Demo directory only"
  echo "  [course]         Specific course (labs/[course] and solutions/[course])"
  echo ""
  echo "Examples:"
  echo "  ./workspace.sh upgrade all      # Full upgrade of all directories"
  echo "  ./workspace.sh upgrade di       # Full upgrade of labs/di and solutions/di"
  echo "  ./workspace.sh verify all       # Verify all directories install, build, serve"
  echo "  ./workspace.sh install all      # Install packages in all directories"
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
    set +e  # Don't abort on individual directory failures
    if [[ -z "$target" ]]; then
      # Root install with workspace setup
      echo '{
  "name": "angular-advanced",
  "workspaces": [
    "./demo",
    "./solutions/*",
    "./solutions/**/*",
    "./labs/*",
    "./labs/**/*"
  ]
}' > package.json
      npm install --force
      rm package.json package-lock.json
    else
      directories=($(resolve_target "$target"))
      if [[ ${#directories[@]} -eq 0 ]]; then
        echo "Error: Target '$target' not found"
        exit 1
      fi
      for dir in "${directories[@]}"; do
        smart_install "$dir"
      done
    fi
    ;;

  "update"|"u")
    set +e  # Directory-processing functions handle errors internally
    export CI=true
    if [[ -z "$target" ]]; then
      echo "Error: Target required for update command"
      show_help
      exit 1
    fi
    directories=($(resolve_target "$target"))
    if [[ ${#directories[@]} -eq 0 ]]; then
      echo "Error: Target '$target' not found"
      exit 1
    fi
    update_directories "${directories[@]}"
    ;;

  "upgrade"|"ng")
    set +e  # Directory-processing functions handle errors internally
    export CI=true
    if [[ -z "$target" ]]; then
      echo "Error: Target required for upgrade command"
      show_help
      exit 1
    fi
    directories=($(resolve_target "$target"))
    if [[ ${#directories[@]} -eq 0 ]]; then
      echo "Error: Target '$target' not found"
      exit 1
    fi
    echo "Upgrading Angular and Bootstrap in ${#directories[@]} directories..."
    upgrade_with_install "${directories[@]}"
    echo "Upgrade complete!"
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

  "help"|"h"|"")
    show_help
    ;;

  *)
    echo "Error: Unknown command '$command'"
    show_help
    exit 1
    ;;
esac
