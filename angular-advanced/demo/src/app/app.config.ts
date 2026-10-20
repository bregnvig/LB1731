import { IMAGE_CONFIG, registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import localeDa from '@angular/common/locales/da';
import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { routes } from './app.routes';

library.add(fas, far);
registerLocaleData(localeDa);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(
      routes,
      // withPreloading(QuicklinkStrategy)
    ),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    { provide: IMAGE_CONFIG, useValue: { disableImageSizeWarning: true, disableImageLazyLoadWarning: true } },
    // Add multiple icons to the library
    provideAppInitializer(() => inject(FaIconLibrary).addIconPacks(fas, far)),
    // {
    //   provide: PopoverService,
    //   useClass: FancyPopoverService,
    // }
  ]
};
