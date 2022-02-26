for dir in ./*/
do
    dir=${dir%*/}
    echo Clean up ${dir##*/}
    `cd ${dir##*/}/ && rm -Rf node_modules tmp dist typings .DS_Store package-lock.json && cd ..`
done