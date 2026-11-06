import { enableProdMode, importProvidersFrom } from '@angular/core';


import { provideHttpClient } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRouting } from './app/app-routing';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(AppRouting),
    provideHttpClient(),
    importProvidersFrom(BrowserModule, NgbModule)]
})
  .catch(err => console.error(err));
