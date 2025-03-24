#!/usr/bin/env bash

# if no args display help
if [ "$1" == "" ]; then
  echo "Usage: workspace.sh [command] [subdir]"
  echo "Commands:"
  echo "  install, i  Install npm packages in the root directory"
  echo "  install -a  Install npm packages in all subdirectories that contain a package.json file"
  echo "  install [subdir]  Install npm packages in the labs/[subdir] and solutions/[subdir] directories"
  echo "  update, u  Update npm packages in the root directory"
  echo "  update -a  Update npm packages in all subdirectories that contain a package.json file"
  echo "  update [subdir]  Update npm packages in the labs/[subdir] and solutions/[subdir] directories"
  echo "  help, h  Display this help message"
  exit 0
fi

# if first arg is install or i
if [ "$1" == "install" ] || [ "$1" == "i" ]; then
  # if second arg is all
  if [ "$2" == "-a" ]; then
    # Installs npm packages in all subdirectories that contain a package.json file,
    # excluding any package.json files found in node_modules folders.

    set -e  # Exit immediately on error

    # Find all package.json files outside of node_modules, and iterate over them
    while IFS= read -r package_json; do
      dir="$(dirname "$package_json")"
      echo "Installing packages in $dir"
      (
        cd "$dir" && npm install
      )
    done < <(find . -type f -name "package.json" -not -path "*/node_modules/*")

    echo "All npm installs complete!"
  # if second arg is not empty
  elif [ "$2" != "" ]; then
    # Assume the second arg is a subdir to labs & solutions and run npm install all subdirs that contain a package.json file in labs/$2/** and solutions/$2/**
    set -e  # Exit immediately on error

    # Find all package.json files outside of node_modules, and iterate over them
    while IFS= read -r package_json; do
      dir="$(dirname "$package_json")"
      echo "Installing packages in $dir"
      (
        cd "$dir" && npm install
      )
    done < <(find labs/"$2" solutions/"$2" -type f -name "package.json" -not -path "*/node_modules/*")

  else
    # creates a package.json file with workspaces and installs packages in the root directory and then removes the package.json & package-lock.json files
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
  fi
elif [ "$1" == "update" ] || [ "$1" == "u" ]; then
  # set CI=true to prevent ng update from asking questions
  export CI=true  
  # if second arg is all
  if [ "$2" == "-a" ]; then
    # Updates npm packages in all subdirectories that contain a package.json file,
    # excluding any package.json files found in node_modules folders.

    set -e  # Exit immediately on error

    # Find all package.json files outside of node_modules, and iterate over them
    while IFS= read -r package_json; do
      dir="$(dirname "$package_json")"
      echo "Updating packages in $dir"
      (
        cd "$dir" && ng update @angular/cli @angular/core
      )
    done < <(find . -type f -name "package.json" -not -path "*/node_modules/*")

    echo "All updates complete!"
  # if second arg is not empty
  elif [ "$2" != "" ]; then
    # Assume the second arg is a subdir to labs & solutions and run ng update @angular/cli @angular/core all subdirs that contain a package.json file in labs/$2/** and solutions/$2/**
    set -e  # Exit immediately on error

    # Find all package.json files outside of node_modules, and iterate over them
    while IFS= read -r package_json; do
      dir="$(dirname "$package_json")"
      echo "Updating packages in $dir"
      (
        cd "$dir" && ng update @angular/cli @angular/core
      )
    done < <(find labs/"$2" solutions/"$2" -type f -name "package.json" -not -path "*/node_modules/*")
  fi
else
  echo "Usage: workspace.sh [command] [subdir]"
  echo "Commands:"
  echo "  install, i  Install npm packages in the root directory"
  echo "  install -a  Install npm packages in all subdirectories that contain a package.json file"
fi
