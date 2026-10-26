#!/usr/bin/env bash

# Project directories of a course: courses/<course>/step-N (lab N = step-N, solution N = step-(N+1)),
# or labs/ and solutions/ for rxjs, which is one app.
get_course_directories() {
  local course="$1" dir
  for dir in courses/"$course"/{labs,solutions,step-*}; do
    if [[ -f "$dir/package.json" ]]; then
      echo "$dir"
    fi
  done
}

# All directories with package.json: demo and every course.
get_all_directories() {
  local course
  if [[ -f demo/package.json ]]; then
    echo demo
  fi
  for course in courses/*/; do
    get_course_directories "$(basename "$course")"
  done
}
