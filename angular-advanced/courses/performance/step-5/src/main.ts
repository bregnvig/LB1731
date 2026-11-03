import { provideHttpClient, withXhr } from '@angular/common/http';
import { enableProdMode, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AppRoutes } from 'src/app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';


if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),provideHttpClient(withXhr()),
    provideRouter(AppRoutes),
    provideAppInitializer(() => inject(FaIconLibrary).addIcons(faSpinner)),
  ],
}).catch(err => console.error(err));
