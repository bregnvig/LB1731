import { bootstrapApplication } from '@angular/platform-browser';
import { provideZoneChangeDetection, provideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

export function bootstrap(zone: boolean) {
  const changeDetection = zone ? provideZoneChangeDetection() : provideZonelessChangeDetection();
  bootstrapApplication(AppComponent, { providers: [changeDetection, ...appConfig.providers] })
    .catch(err => console.error(err));
}
