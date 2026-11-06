#!/usr/bin/env bash

# The exercise chain: exercise N starts from steps/step-N and its solution is steps/step-(N+1),
# because the solution of one exercise is where the next one starts. Students get the names below.
EXERCISES=(
  03-create-first-component
  04-create-footer-component
  05-include-feature-module
  06-create-playground-service
  07-work-with-async
  08-add-some-routes
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
