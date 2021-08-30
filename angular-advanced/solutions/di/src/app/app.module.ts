import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { LeafletModule } from './leaflet';
import { DefaultDescriptionPipe, DistancePipe, HumanizeDistancePipe } from './pipe';
import { PlaygroundService, PLAYGROUNDS_URL } from './service';
import { SidebarComponent } from './sidebar/sidebar.component';

// const playgroundServiceFactory = (http: HttpClient) => {
//   return environment.location === 'copenhagen' ? new PlaygroundService(http) : new AarhusPlaygroundService(http);
// };

function prefetch(service: PlaygroundService) {
  return () => service.playgrounds$;
};

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    FooterComponent,
    DistancePipe,
    HumanizeDistancePipe,
    DefaultDescriptionPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    LeafletModule,
  ],
  providers: [
    // {
    //   provide: PlaygroundService,
    //   useFactory: playgroundServiceFactory,
    //   deps: [HttpClient]
    // },
    {
      provide: PLAYGROUNDS_URL,
      useValue: environment.playgroundsURL
    },
    {
      provide: APP_INITIALIZER,
      useFactory: prefetch,
      deps: [PlaygroundService, PLAYGROUNDS_URL],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
