#!/bin/bash
scriptdir=$(dirname $(readlink -f $0))

if ls "$scriptdir/labs/$1" "$scriptdir/solutions/$1" >/dev/null 2>&1; then
    tempdir=$(mktemp -d)

    rsync -r --exclude "**/node_modules/*" --exclude "**/.angular/*" --exclude "**/dist/*" "$scriptdir/demo/" "$tempdir/demo"
    rsync -r --exclude "**/node_modules/*" --exclude "**/.angular/*" --exclude "**/dist/*" "$scriptdir/labs/$1/" "$tempdir/lab"
    rsync -r --exclude "**/node_modules/*" --exclude "**/.angular/*" --exclude "**/dist/*" "$scriptdir/solutions/$1/" "$tempdir/solution"

    (cd $tempdir && zip -r $1 .) 

    cp "$tempdir/$1.zip" .

    rm -r $tempdir
else 
    echo "Project $1 doesnt exist!"
    exit 1
fi
