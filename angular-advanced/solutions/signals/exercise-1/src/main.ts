import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { AppRoutes } from 'src/app/app.routes';
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

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(AppRoutes),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFontAwesomeFactory,
      deps: [FaIconLibrary],
      multi: true,
    },
  ],
}).catch(err => console.error(err));
