import { APP_INITIALIZER, enableProdMode, importProvidersFrom } from '@angular/core';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicIoModule } from 'ng-dynamic-component';
import { AppComponent } from './app/app.component';
import { AppRoutes } from './app/app.routing';
import { environment } from './environments/environment';

library.add(fas);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(AppRoutes),
    importProvidersFrom(BrowserModule, ReactiveFormsModule, NgbModule, FontAwesomeModule, DynamicIoModule),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (library: FaIconLibrary) => () => library.addIconPacks(fas),
      deps: [FaIconLibrary]
    },
  ]
}).catch(err => console.error(err));
