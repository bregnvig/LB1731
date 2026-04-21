#!/usr/bin/env bash

# Resolve lab+solution directories for a course.
# Handles both flat (labs/rxjs/package.json) and nested (labs/unit-test/exercise-*/package.json).
get_course_directories() {
  local course="$1"
  local dirs=()

  for base in labs solutions; do
    if [[ -d "$base/$course" ]]; then
      if [[ -f "$base/$course/package.json" ]]; then
        dirs+=("$base/$course")
      else
        for exercise_dir in $base/$course/*/; do
          if [[ -d "$exercise_dir" && -f "$exercise_dir/package.json" ]]; then
            dirs+=("${exercise_dir%/}")
          fi
        done
      fi
    fi
  done

  echo "${dirs[@]}"
}

# All directories with package.json across demo, labs, and solutions.
get_all_directories() {
  local dirs=()

  if [[ -d "demo" && -f "demo/package.json" ]]; then
    dirs+=("demo")
  fi

  for base in labs solutions; do
    if [[ -d "$base" ]]; then
      for course_dir in $base/*/; do
        if [[ -d "$course_dir" ]]; then
          course_dir="${course_dir%/}"
          if [[ -f "$course_dir/package.json" ]]; then
            dirs+=("$course_dir")
          else
            for exercise_dir in $course_dir/*/; do
              if [[ -d "$exercise_dir" && -f "$exercise_dir/package.json" ]]; then
                dirs+=("${exercise_dir%/}")
              fi
            done
          fi
        fi
      done
    fi
  done

  echo "${dirs[@]}"
}

# Execute a command string in each directory.
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
