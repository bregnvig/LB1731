import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { staticExport } from './app/deck/static-export';

if (staticExport) {
  // An exported deck (scripts/export.mjs), opened from index.html: the presentation only, no router,
  // so reveal.js keeps the URL hash to itself.
  import('./app/player/present.component')
    .then(m => bootstrapApplication(m.PresentComponent, { providers: [provideBrowserGlobalErrorListeners()] }))
    .catch(err => console.error(err));
} else {
  bootstrapApplication(App, appConfig)
    .catch((err) => console.error(err));
}
