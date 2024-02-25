

import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';

import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRouting } from './app/app.routing';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(AppRouting),
    importProvidersFrom(
      BrowserModule,
      NgbModule
    )
  ]
}).catch(err => console.error(err));
