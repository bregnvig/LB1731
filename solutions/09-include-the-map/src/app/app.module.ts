import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { AppComponent }   from './app.component';

import { SidebarComponent } from './sidebar';
import { FooterComponent } from './footer';
import { LeafletModule } from './leaflet';
import { PlaygroundService } from './shared/playground.service';
import { HttpClientModule } from '@angular/common/http';
import { LocationService } from './shared/location.service';

@NgModule({
    declarations: [AppComponent, SidebarComponent, FooterComponent],
    imports:      [BrowserModule, LeafletModule, HttpClientModule],
    bootstrap:    [AppComponent],
    providers:    [PlaygroundService, LocationService],
})
export class AppModule {}
