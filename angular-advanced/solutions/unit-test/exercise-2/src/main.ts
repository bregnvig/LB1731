import { provideHttpClient } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutes } from './app/app-routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      NgbModule,
    ),
    provideAnimations(),
    provideHttpClient(),
    provideRouter(AppRoutes),
  ]
}).catch(err => console.error(err));
