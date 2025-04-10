import { enableProdMode, importProvidersFrom, inject, provideAppInitializer } from '@angular/core';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicIoModule } from 'ng-dynamic-component';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

library.add(fas);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, ReactiveFormsModule, NgbModule, FontAwesomeModule, DynamicIoModule),
    provideHttpClient(withInterceptorsFromDi()),
    provideAppInitializer(() => {
        const initializerFn = ((library: FaIconLibrary) => () => library.addIconPacks(fas))(inject(FaIconLibrary));
        return initializerFn();
      }),
  ]
}).catch(err => console.error(err));
