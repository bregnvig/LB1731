"use strict";

// SystemJS configuration file, see links for more information
// https://github.com/systemjs/systemjs
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md

/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
};

/** User packages configuration. */
const packages: any = {
};

////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/forms',
  '@angular/http',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',

  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'app',
  'app/shared',
  'app/menu',
  'app/components',
  'app/io',
  'app/services',
  'app/async',
  'app/pipes',
  'app/route',
  'app/form',
  'app/unittest',
  'app/attributes',
  'app/structural',
  'app/components/hello',
  'app/components/ngif',
  'app/components/interpolation',
  'app/components/property',
  'app/components/event',
  'app/components/twoway',
  'app/components/ngfor',
  'app/components/inner',
  'app/components/outer',
  'app/io/directly',
  'app/io/intercept',
  'app/io/event',
  'app/io/stopwatch',
  'app/io/local',
  'app/io/viewchild',
  'app/services/singleton',
  'app/services/stopwatch-error',
  'app/services/non-singleton',
  'app/services/stopwatch-logger',
  'app/async/simple-http-service',
  'app/async/nicer-async-service',
  'app/async/better-async-service',
  'app/async/cached-async-service',
  'app/async/wrap-api',
  'app/async/ref-count',
  'app/pipes/today',
  'app/pipes/build-in',
  'app/pipes/chaining',
  'app/pipes/phone',
  'app/pipes/pure',
  'app/attributes/rotate',
  'app/attributes/simple',
  'app/attributes/simple-attribute',
  'app/attributes/user-event-attribute',
  'app/attributes/binding-attribute',
  'app/attributes/bindings-attribute',
  'app/structural/case-study',
  'app/structural/unless',
  'app/orders',
  'app/route/orders',
  'app/route/route',
  'app/route/order',
  'app/form/person-form-1',
  'app/form/person-form-2',
  'app/form/person-form-3',
  'app/form/person-form-4',
  'app/form/person-form-5',
  'app/form/person-form-6',
  'app/form/person-form-7',
  'app/form/search-form',
  'app/unittest/hello-world',
  'app/async/error',
  /** @cli-barrel */
];

const cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  cliSystemConfigPackages[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js'
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({ map, packages });
