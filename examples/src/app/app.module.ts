import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { AppComponent }   from './app.component';

import { routing } from './app.routing';
import { MenuComponent } from './menu';
import { ComponentsModule } from './components/components.module';
import { ServicesModule } from './services/services.module';
import { IOModule } from './io/io.module';
import { AsyncModule } from './async/async.module';
import { PipesModule } from './pipes/pipes.module';
import { FormModule } from './form/form.module';
import { UnittestModule } from './unittest/unittest.module';
import { AttributesModule } from './attributes/attributes.module';
import { StructuralModule } from './structural/structural.module';
import { MyRouteModule } from './route/route.module';

@NgModule({
    declarations: [AppComponent, MenuComponent],
    imports:      [BrowserModule, routing, ComponentsModule, ServicesModule, IOModule, AsyncModule, PipesModule, AttributesModule, StructuralModule, FormModule, UnittestModule],
    bootstrap:    [AppComponent],
})
export class AppModule {}