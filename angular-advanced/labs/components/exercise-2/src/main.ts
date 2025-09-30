import { APP_INITIALIZER, enableProdMode, importProvidersFrom } from '@angular/core';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutes } from './app/app-routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';


if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      ReactiveFormsModule,
      NgbModule,
      FontAwesomeModule
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(AppRoutes),
    {
      provide: APP_INITIALIZER,
      useFactory: (library: FaIconLibrary) => library.addIconPacks(fas, far),
      deps: [FaIconLibrary],
    }
  ]
})
  .catch(err => console.error(err));
