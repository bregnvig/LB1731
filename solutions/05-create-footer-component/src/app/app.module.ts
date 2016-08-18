import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { AppComponent }   from './app.component';

import { SidebarComponent } from './sidebar';
import { FooterComponent } from './footer';

@NgModule({
    declarations: [AppComponent, SidebarComponent, FooterComponent],
    imports:      [BrowserModule],
    bootstrap:    [AppComponent],
})
export class AppModule {}