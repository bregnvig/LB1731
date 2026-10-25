#!/usr/bin/env bash
# Student zips: solutions.zip, demo.zip and labs.zip. Optional arg: output directory (default: here).
out="${1:-.}"
zip -r "$out/solutions" solutions -x "**/node_modules/*" -x "**/dist/*" -x "**/.angular/*" -x "**/*.sh"
zip -r "$out/demo" demo -x "**/node_modules/*" -x "**/dist/*" -x "**/.angular/*" -x "**/*.sh"
zip -r "$out/labs" labs -x "**/node_modules/*" -x "**/dist/*" -x "**/.angular/*" -x "**/*.sh"
