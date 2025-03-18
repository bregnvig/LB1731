import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FooterComponent } from './footer/footer.component';
import { Center, LeafletComponent, Marker } from './leaflet';
import { Playground } from './model';
import { LocationService, PlaygroundService } from './service';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
    selector: 'loop-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [LeafletComponent, SidebarComponent, FooterComponent, AsyncPipe]
})
export class AppComponent {

  playgrounds: Playground[] = [];
  playground: Playground | undefined;
  center: Center = { lat: 56.360029, lng: 10.746635 };
  markers$?: Observable<Marker[]>;

  constructor(private service: PlaygroundService, private locationService: LocationService) {
  }

  ngOnInit() {
    this.locationService.location$.subscribe(location => this.center = { ...location, zoom: 12 });
    this.service.playgrounds$.subscribe(playgrounds => this.playgrounds = playgrounds);
  }
}
