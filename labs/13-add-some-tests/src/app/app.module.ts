import { DefaultDescriptionPipe } from './shared/pipes/default-description.pipe';
import { DistancePipe } from './shared/pipes/distance.pipe';
import { HumanizeDistancePipe } from './shared/pipes/humanize-distance.pipe';
import { LocationService } from './shared/location.service';
import { PlaygroundService } from './shared/playground.service';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { LeafletModule } from './leaflet';
import { SidebarComponent } from './sidebar';
import { FooterComponent } from './footer';
import { HttpClientModule } from '@angular/common/http';
import { MapComponent } from './map/map.component';
import { routing } from './app-routing.module';

import 'rxjs/Rx';

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        FooterComponent,
        DefaultDescriptionPipe,
        DistancePipe,
        HumanizeDistancePipe,
        MapComponent
    ],
    imports: [
        BrowserModule,
        LeafletModule,
        HttpClientModule,
        ReactiveFormsModule,
        routing,
    ],
    providers: [
        PlaygroundService,
        LocationService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {

}
