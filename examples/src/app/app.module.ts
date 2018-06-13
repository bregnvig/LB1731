import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { routing } from './app-routing.module';
import { MenuComponent } from './menu';
import { UnitTestModule } from './unit-test/unit-test.module';
import { AttributesModule } from './attributes/attributes.module';
import { StructuralModule } from './structural/structural.module';
import { CounterComponent } from './shared/counter/counter.component';

@NgModule({
    declarations: [AppComponent, MenuComponent, CounterComponent],
    imports: [
        BrowserModule,
        routing,
        AttributesModule,
        StructuralModule,
        UnitTestModule
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
