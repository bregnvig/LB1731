import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AttributesModule } from './attributes/attributes.module';
import { MenuComponent, MenuPageComponent } from './menu-page';
import { CounterComponent } from './shared/counter/counter.component';
import { StructuralModule } from './structural/structural.module';

@NgModule({
  declarations: [AppComponent, MenuPageComponent, MenuComponent, CounterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AttributesModule,
    StructuralModule,
    NgbModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
