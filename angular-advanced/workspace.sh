#!/usr/bin/env bash

set -e  # Exit immediately on error

show_help() {
  echo "Usage: workspace.sh [command] [target]"
  echo ""
  echo "Commands:"
  echo "  install, i       Install npm packages"
  echo "  update, u        Update npm packages"
  echo "  upgrade, ng      Upgrade Angular and related packages"
  echo "  help, h          Show this help"
  echo ""
  echo "Targets:"
  echo "  -a, all          All labs, solutions, and demo"
  echo "  demo             Demo directory only"
  echo "  [course]         Specific course (labs/[course] and solutions/[course])"
  echo ""
  echo "Examples:"
  echo "  ./workspace.sh upgrade all      # Upgrade Angular and related packages in all directories"
  echo "  ./workspace.sh upgrade demo     # Upgrade Angular and related packages in demo only"
  echo "  ./workspace.sh upgrade di       # Upgrade Angular and related packages in labs/di and solutions/di"
  echo "  ./workspace.sh install all      # Install packages in all directories"
}

run_in_directories() {
  local command="$1"
  local directories=("${@:2}")

  for dir in "${directories[@]}"; do
    if [[ -d "$dir" && -f "$dir/package.json" ]]; then
      echo "Running '$command' in $dir"
      (cd "$dir" && eval "$command")
    else
      echo "Skipping $dir (not found or no package.json)"
    fi
  done
}

smart_install() {
  local dir="$1"

  echo "Attempting clean install in $dir"
  if (cd "$dir" && npm install 2>/dev/null); then
    echo "✓ Clean install successful"
    return 0
  fi

  echo "Clean install failed, analyzing dependency conflicts..."

  # Get the full npm error output
  local npm_output
  npm_output=$(cd "$dir" && npm install 2>&1 || true)

  # Look for common Angular ecosystem packages that might need updating
  local potential_packages=()

  # Check if ng-bootstrap is mentioned in the error
  if echo "$npm_output" | grep -q "@ng-bootstrap/ng-bootstrap"; then
    potential_packages+=("@ng-bootstrap/ng-bootstrap")
  fi

  # Check for other common Angular packages
  if echo "$npm_output" | grep -q "@angular/material"; then
    potential_packages+=("@angular/material")
  fi

  if echo "$npm_output" | grep -q "@ng-select/ng-select"; then
    potential_packages+=("@ng-select/ng-select")
  fi

  if echo "$npm_output" | grep -q "ngx-"; then
    # Extract ngx- packages from the error
    local ngx_packages
    ngx_packages=$(echo "$npm_output" | grep -o "ngx-[^@\s]*" | sort -u || true)
    for pkg in $ngx_packages; do
      potential_packages+=("$pkg")
    done
  fi

  if [[ ${#potential_packages[@]} -gt 0 ]]; then
    echo "Found potential packages to update: ${potential_packages[*]}"
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

upgrade_bootstrap() {
  local dir="$1"

  if [[ -d "$dir" && -f "$dir/package.json" ]]; then
    echo "Upgrading bootstrap and related packages in $dir"

    # Build list of packages to upgrade
    local packages=()

    if grep -q "@ng-bootstrap/ng-bootstrap" "$dir/package.json"; then
      packages+=("@ng-bootstrap/ng-bootstrap@latest")
    fi

    if grep -q "@fortawesome/angular-fontawesome" "$dir/package.json"; then
      packages+=("@fortawesome/angular-fontawesome@latest")
    fi

    if grep -q '"bootstrap"' "$dir/package.json"; then
      packages+=("bootstrap@5.3.6")
    fi

    # Upgrade all packages together if any were found
    if [[ ${#packages[@]} -gt 0 ]]; then
      echo "  Updating packages: ${packages[*]}"
      (cd "$dir" && npm install "${packages[@]}" --save)
    else
      echo "  No bootstrap-related packages found"
    fi

    echo "  Done with $dir"
  fi
}

upgrade_with_install() {
  local directories=("$@")

  for dir in "${directories[@]}"; do
    if [[ -d "$dir" && -f "$dir/package.json" ]]; then
      smart_install "$dir"
      upgrade_bootstrap "$dir"
      echo "Upgrading Angular core packages in $dir"
      (cd "$dir" && ng update @angular/cli @angular/core --force --allow-dirty)
      echo "Upgrading third-party Angular packages in $dir"
      (cd "$dir" && ng update --all --force --allow-dirty 2>/dev/null || echo "Some packages couldn't be auto-upgraded (this is normal)")
    else
      echo "Skipping $dir (not found or no package.json)"
    fi
  done
}

get_course_directories() {
  local course="$1"
  local dirs=()

  # Check labs/[course] - either direct package.json or in subdirectories
  if [[ -d "labs/$course" ]]; then
    if [[ -f "labs/$course/package.json" ]]; then
      # Direct package.json in course directory
      dirs+=("labs/$course")
    else
      # Look for package.json in exercise subdirectories
      for exercise_dir in labs/$course/*/; do
        if [[ -d "$exercise_dir" && -f "$exercise_dir/package.json" ]]; then
          dirs+=("${exercise_dir%/}")
        fi
      done
    fi
  fi

  # Check solutions/[course] - either direct package.json or in subdirectories
  if [[ -d "solutions/$course" ]]; then
    if [[ -f "solutions/$course/package.json" ]]; then
      # Direct package.json in course directory
      dirs+=("solutions/$course")
    else
      # Look for package.json in exercise subdirectories
      for exercise_dir in solutions/$course/*/; do
        if [[ -d "$exercise_dir" && -f "$exercise_dir/package.json" ]]; then
          dirs+=("${exercise_dir%/}")
        fi
      done
    fi
  fi

  echo "${dirs[@]}"
}

get_all_directories() {
  local dirs=()

  # Add demo
  if [[ -d "demo" && -f "demo/package.json" ]]; then
    dirs+=("demo")
  fi

  # Add all lab directories - check both direct and nested structures
  if [[ -d "labs" ]]; then
    for course_dir in labs/*/; do
      if [[ -d "$course_dir" ]]; then
        course_dir="${course_dir%/}"
        if [[ -f "$course_dir/package.json" ]]; then
          # Direct package.json in course directory
          dirs+=("$course_dir")
        else
          # Look for package.json in exercise subdirectories
          for exercise_dir in $course_dir/*/; do
            if [[ -d "$exercise_dir" && -f "$exercise_dir/package.json" ]]; then
              dirs+=("${exercise_dir%/}")
            fi
          done
        fi
      fi
    done
  fi

  # Add all solution directories - check both direct and nested structures
  if [[ -d "solutions" ]]; then
    for course_dir in solutions/*/; do
      if [[ -d "$course_dir" ]]; then
        course_dir="${course_dir%/}"
        if [[ -f "$course_dir/package.json" ]]; then
          # Direct package.json in course directory
          dirs+=("$course_dir")
        else
          # Look for package.json in exercise subdirectories
          for exercise_dir in $course_dir/*/; do
            if [[ -d "$exercise_dir" && -f "$exercise_dir/package.json" ]]; then
              dirs+=("${exercise_dir%/}")
            fi
          done
        fi
      fi
    done
  fi

  echo "${dirs[@]}"
}

# Parse arguments
command="${1:-help}"
target="${2:-}"

case "$command" in
  "install"|"i")
    case "$target" in
      "-a"|"all")
        directories=($(get_all_directories))
        for dir in "${directories[@]}"; do
          if [[ -d "$dir" && -f "$dir/package.json" ]]; then
            smart_install "$dir"
          fi
        done
        ;;
      "demo")
        smart_install "demo"
        ;;
      "")
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
        ;;
      *)
        directories=($(get_course_directories "$target"))
        if [[ ${#directories[@]} -eq 0 ]]; then
          echo "Error: Course '$target' not found"
          exit 1
        fi
        for dir in "${directories[@]}"; do
          if [[ -d "$dir" && -f "$dir/package.json" ]]; then
            smart_install "$dir"
          fi
        done
        ;;
    esac
    ;;

  "update"|"u")
    export CI=true  # Prevent interactive prompts
    case "$target" in
      "-a"|"all")
        directories=($(get_all_directories))
        run_in_directories "ng update @angular/cli @angular/core --force --allow-dirty" "${directories[@]}"
        ;;
      "demo")
        run_in_directories "ng update @angular/cli @angular/core --force --allow-dirty" "demo"
        ;;
      "")
        echo "Error: Target required for update command"
        show_help
        exit 1
        ;;
      *)
        directories=($(get_course_directories "$target"))
        if [[ ${#directories[@]} -eq 0 ]]; then
          echo "Error: Course '$target' not found"
          exit 1
        fi
        run_in_directories "ng update @angular/cli @angular/core --force --allow-dirty" "${directories[@]}"
        ;;
    esac
    ;;

  "upgrade"|"ng")
    export CI=true  # Prevent interactive prompts
    case "$target" in
      "-a"|"all")
        directories=($(get_all_directories))
        echo "Installing packages and upgrading Angular and Bootstrap in all directories..."
        upgrade_with_install "${directories[@]}"
        echo "Angular and Bootstrap upgrade complete for all directories!"
        ;;
      "demo")
        echo "Installing packages and upgrading Angular and Bootstrap in demo directory..."
        upgrade_with_install "demo"
        echo "Angular and Bootstrap upgrade complete for demo!"
        ;;
      "")
        echo "Error: Target required for upgrade command"
        show_help
        exit 1
        ;;
      *)
        directories=($(get_course_directories "$target"))
        if [[ ${#directories[@]} -eq 0 ]]; then
          echo "Error: Course '$target' not found"
          exit 1
        fi
        echo "Installing packages and upgrading Angular and Bootstrap for course: $target"
        upgrade_with_install "${directories[@]}"
        echo "Angular and Bootstrap upgrade complete for course: $target!"
        ;;
    esac
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