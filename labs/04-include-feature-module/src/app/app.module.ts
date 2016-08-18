import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { AppComponent }   from './app.component';

import { SidebarComponent } from './sidebar';

@NgModule({
    declarations: [AppComponent, SidebarComponent],
    imports:      [BrowserModule],
    bootstrap:    [AppComponent],
})
export class AppModule {}