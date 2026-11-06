// "?zone" in the URL boots the app with zone.js, so the change detection demo can compare it with zoneless.
// zone.js has to patch the browser before Angular loads, hence the dynamic imports.
const zone = new URLSearchParams(location.search).has('zone');

(zone ? import('zone.js') : Promise.resolve())
  .then(() => import('./bootstrap'))
  .then(({ bootstrap }) => bootstrap(zone));
