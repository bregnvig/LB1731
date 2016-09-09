import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { HttpModule } from '@angular/http';

import { LeafletModule } from './leaflet';
import { SidebarComponent } from './sidebar';
import { FooterComponent } from './footer';
import { PlaygroundService, LocationService } from './shared';
import { DefaultDescriptionPipe, DistancePipe, HumanizeDistancePipe } from './shared/pipes';

@NgModule({
    declarations: [AppComponent, SidebarComponent, FooterComponent, DefaultDescriptionPipe, DistancePipe, HumanizeDistancePipe],
    imports: [BrowserModule, LeafletModule, HttpModule],
    providers: [PlaygroundService, LocationService],
    bootstrap: [AppComponent],
})
export class AppModule { }
