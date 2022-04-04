import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer';
import { LeafletModule } from './leaflet';
import { PlaygroundService } from './shared/playground.service';
import { SidebarComponent } from './sidebar';


@NgModule({
  declarations: [AppComponent, SidebarComponent, FooterComponent],
  imports: [BrowserModule, LeafletModule, HttpClientModule],
  bootstrap: [AppComponent],
  providers: [PlaygroundService],
})
export class AppModule { }
