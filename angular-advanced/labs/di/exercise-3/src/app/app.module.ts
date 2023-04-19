import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { LeafletModule } from './leaflet';
import { DefaultDescriptionPipe, DistancePipe, HumanizeDistancePipe } from './pipe';
import { PLAYGROUND_URL } from './service';
import { SidebarComponent } from './sidebar/sidebar.component';

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
    {
      provide: PLAYGROUND_URL,
      useValue: environment.playgroundsURL,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
