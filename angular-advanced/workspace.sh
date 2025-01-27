#!/usr/bin/env bash

# if no args display help
if [ "$1" == "" ]; then
  echo "Usage: workspace.sh [install | i] [-a]"
  echo "  install | i: installs workspace packages"
  echo "  -a: installs npm packages in all subdirectories that contain a package.json file"
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
fi
