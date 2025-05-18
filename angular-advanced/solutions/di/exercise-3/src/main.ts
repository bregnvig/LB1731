import { APP_INITIALIZER, enableProdMode, importProvidersFrom } from '@angular/core';


import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { switchMap, timer } from 'rxjs';
import { AppComponent } from './app/app.component';
import { PLAYGROUND_URL, PlaygroundService } from './app/service';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, ReactiveFormsModule, NgbModule),
    {
      provide: PLAYGROUND_URL,
      useValue: environment.playgroundsURL,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (service: PlaygroundService) => () => timer(10000).pipe(switchMap(() => service.playgrounds$)),
      deps: [PlaygroundService],
      multi: true,
    },
    // provideAppInitializer(() => {
    //   const service = inject(PlaygroundService);
    //   return timer(2000).pipe(switchMap(() => service.playgrounds$));
    // }),
    provideHttpClient(withInterceptorsFromDi())
  ]
})
  .catch(err => console.error(err));
