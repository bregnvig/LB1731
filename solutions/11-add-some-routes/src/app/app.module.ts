import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { SidebarComponent } from './sidebar';
import { FooterComponent } from './footer';
import { LeafletModule } from './leaflet';
import { PlaygroundService } from './shared/playground.service';
import { HttpClientModule } from '@angular/common/http';
import { LocationService } from './shared/location.service';
import {
  DistancePipe,
  HumanizeDistancePipe,
  DefaultDescriptionPipe
} from './shared/pipes';
import { AppRoutingModule } from './app-routing.module';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    FooterComponent,
    DefaultDescriptionPipe,
    DistancePipe,
    HumanizeDistancePipe,
    MapComponent
  ],
  imports: [
    BrowserModule, 
    LeafletModule, 
    HttpClientModule, 
    AppRoutingModule
  ],
  bootstrap: [AppComponent],
  providers: [PlaygroundService, LocationService]
})
export class AppModule {}
