import { enableProdMode, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { timer, switchMap } from 'rxjs';
import { environment as environment_1 } from 'src/environments/environment';
import { PLAYGROUND_URL, PlaygroundService } from './app/service';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, ReactiveFormsModule, AppRoutingModule, NgbModule),
        {
            provide: PLAYGROUND_URL,
            useValue: environment.playgroundsURL,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: (service: PlaygroundService) => () => timer(2000).pipe(switchMap(() => service.playgrounds$)),
            deps: [PlaygroundService],
            multi: true,
        },
        provideHttpClient(withInterceptorsFromDi())
    ]
})
  .catch(err => console.error(err));
