import { APP_INITIALIZER, enableProdMode, importProvidersFrom } from '@angular/core';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicIoModule } from 'ng-dynamic-component';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas, far);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
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
