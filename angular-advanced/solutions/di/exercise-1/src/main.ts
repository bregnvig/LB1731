import { enableProdMode, importProvidersFrom } from '@angular/core';


import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app/app.component';
import { PlaygroundService } from './app/service';
import { AarhusPlaygroundService } from './app/service/aarhus-playground.service';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, ReactiveFormsModule, NgbModule),
    {
      provide: PlaygroundService,
      useFactory: (http: HttpClient) => environment.location === 'copenhagen' ? new PlaygroundService(http) : new AarhusPlaygroundService(http),
      deps: [HttpClient]
    },
    provideHttpClient(withInterceptorsFromDi())
  ]
})
  .catch(err => console.error(err));
