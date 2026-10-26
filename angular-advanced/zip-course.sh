#!/bin/bash
scriptdir=$(dirname $(readlink -f $0))

if ls "$scriptdir/courses/$1/labs" "$scriptdir/courses/$1/solutions" >/dev/null 2>&1; then
    tempdir=$(mktemp -d)

    rsync -r --exclude "**/node_modules/*" --exclude "**/.angular/*" --exclude "**/dist/*" "$scriptdir/demo/" "$tempdir/demo"
    rsync -r --exclude "**/node_modules/*" --exclude "**/.angular/*" --exclude "**/dist/*" "$scriptdir/courses/$1/labs/" "$tempdir/lab"
    rsync -r --exclude "**/node_modules/*" --exclude "**/.angular/*" --exclude "**/dist/*" "$scriptdir/courses/$1/solutions/" "$tempdir/solution"

    (cd $tempdir && zip -r $1 .) 

    cp "$tempdir/$1.zip" .

    rm -r $tempdir
else 
    echo "Project $1 doesnt exist!"
    exit 1
fi
