import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { HttpModule } from '@angular/http';

import { LeafletModule } from './leaflet';
import { SidebarComponent } from './sidebar';
import { FooterComponent } from './footer';
import { PlaygroundService } from './shared';

@NgModule({
    declarations: [AppComponent, SidebarComponent, FooterComponent],
    imports: [BrowserModule, LeafletModule, HttpModule],
    providers: [PlaygroundService],
    bootstrap:    [AppComponent],
})
export class AppModule {}
