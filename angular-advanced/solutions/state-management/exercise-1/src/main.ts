import { enableProdMode, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';

import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';


if (environment.production) {
  enableProdMode();
}

const initializeFontAwesomeFactory = (faIconLibrary: FaIconLibrary) => {
  return () => new Promise<void>(resolve => {
    faIconLibrary.addIconPacks(fas, far);
    resolve();
  });
};

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideAppInitializer(() => {
      const initializerFn = (initializeFontAwesomeFactory)(inject(FaIconLibrary));
      return initializerFn();
    })
  ]
})
  .catch(err => console.error(err));
