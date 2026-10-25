#!/usr/bin/env bash

# Lab and solution directories of a course: courses/<course>/{labs,solutions}, either
# the app itself (rxjs) or one exercise-* directory per exercise.
get_course_directories() {
  local course="$1" dir
  for dir in courses/"$course"/{labs,solutions} courses/"$course"/{labs,solutions}/*/; do
    dir="${dir%/}"
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
