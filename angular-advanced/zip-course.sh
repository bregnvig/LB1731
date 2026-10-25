#!/bin/bash
scriptdir=$(dirname $(readlink -f $0))

if [[ -n "$1" && -d "$scriptdir/courses/$1" ]]; then
    tempdir=$(mktemp -d)

    rsync -r --exclude "**/node_modules/*" --exclude "**/.angular/*" --exclude "**/dist/*" "$scriptdir/demo/" "$tempdir/demo"
    "$scriptdir/scripts/stage-course.sh" "$1" "$tempdir/lab" "$tempdir/solution"

    "$scriptdir/scripts/student-packages.sh" "$tempdir"

    (cd $tempdir && zip -r $1 .) 

    cp "$tempdir/$1.zip" .

    rm -r $tempdir
else 
    echo "Project $1 doesnt exist!"
    exit 1
fi
