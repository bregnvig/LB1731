import { provideZonelessChangeDetection } from '@angular/core';

// The app still loads zone.js; the tests run zoneless, so `await fixture.whenStable()` renders.
export default [provideZonelessChangeDetection()];
