import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, ReactiveFormsModule, AppRoutingModule, NgbModule, FontAwesomeModule),
        provideHttpClient(withInterceptorsFromDi())
    ]
})
  .catch(err => console.error(err));
