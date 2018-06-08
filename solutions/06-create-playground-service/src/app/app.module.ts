import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { AppComponent }   from './app.component';

import { SidebarComponent } from './sidebar';
import { FooterComponent } from './footer';
import { LeafletModule } from './leaflet';
import { PlaygroundService } from './shared/playground.service';

@NgModule({
    declarations: [AppComponent, SidebarComponent, FooterComponent],
    imports:      [BrowserModule, LeafletModule],
    bootstrap:    [AppComponent],
    providers:    [PlaygroundService],
})
export class AppModule {}
