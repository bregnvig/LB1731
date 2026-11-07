#!/usr/bin/env bash

# The exercise chain, numbered like the slides: exercise N starts from steps/step-N and its solution is
# steps/step-(N+1), because the solution of one exercise is where the next one starts. Students get
# the folder names below (one lower than the exercise number: exercise 3, ng new, has no folder).
declare -A EXERCISES=(
  [4]=03-create-first-component
  [5]=04-create-footer-component
  [6]=05-include-feature-module
  [7]=06-create-playground-service
  [8]=07-work-with-async
  [9]=08-add-some-routes
)

# Step directories, in order.
get_step_directories() {
  local dir
  for dir in $(ls -d steps/step-* 2>/dev/null | sort -V); do
    if [[ -f "$dir/package.json" ]]; then
      echo "$dir"
    fi
  done
}

# All directories with package.json: demo and every step.
get_all_directories() {
  if [[ -f demo/package.json ]]; then
    echo demo
  fi
  get_step_directories
}
