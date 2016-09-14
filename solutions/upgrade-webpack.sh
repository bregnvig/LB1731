cp ./03-create-first-component/README.md $1/.
cp ./03-create-first-component/angular-cli.json $1/.
cp ./03-create-first-component/e2e/app.po.ts $1/e2e/.
cp ./03-create-first-component/e2e/tsconfig.json $1/e2e/.
cp ./03-create-first-component/e2e/tsconfig.json $1/e2e/.
cp ./03-create-first-component/package.json $1/.
cp ./03-create-first-component/src/app/app.component.spec.ts $1/src/app/.
cp ./03-create-first-component/src/app/app.component.ts $1/src/app/.
cp ./03-create-first-component/src/app/index.ts $1/src/app/.
cp ./03-create-first-component/src/app/leaflet/leaflet.component.ts $1/src/app/leaflet/.
cp ./03-create-first-component/src/index.html $1/src/.
cp ./03-create-first-component/src/tsconfig.json $1/src/.
cp ./03-create-first-component/src/typings.d.ts $1/src/.
cp ./03-create-first-component/tslint.json $1/src/.

cp ./03-create-first-component/karma.conf.js $1/.
cp ./03-create-first-component/protractor.conf.js $1/.
mkdir $1/src/environments
cp ./03-create-first-component/src/environments/* $1/src/environments
cp ./03-create-first-component/src/main.ts $1/src/.
cp ./03-create-first-component/src/polyfills.ts $1/src/.
cp ./03-create-first-component/src/styles.css $1/src/.
cp ./03-create-first-component/src/test.ts $1/src/.

rm $1/angular-cli-build.js
rm $1/config/environment*
rm -Rf $1/src/css
rm -Rf $1/src/system.config.ts
rm -Rf $1/typings.json