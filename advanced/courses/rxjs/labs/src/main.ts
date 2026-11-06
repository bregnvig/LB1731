import { enableProdMode, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { withInterceptorsFromDi, provideHttpClient, withXhr } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideZoneChangeDetection(),importProvidersFrom(BrowserModule, ReactiveFormsModule, AppRoutingModule, NgbModule),
        provideHttpClient(withXhr(), withInterceptorsFromDi())
    ]
})
  .catch(err => console.error(err));
