import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { AppComponent }   from './app.component';

import { LeafletModule } from './leaflet/leaflet.module';
import { SidebarComponent } from './sidebar';
import { FooterComponent } from './footer';

@NgModule({
    declarations: [AppComponent, SidebarComponent, FooterComponent],
    imports:      [BrowserModule, LeafletModule],
    bootstrap:    [AppComponent],
})
export class AppModule {}