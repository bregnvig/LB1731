import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Center, Marker } from './leaflet';
import { LocationService } from './shared';
import { Playground } from './shared/playground';
import { PlaygroundService } from './shared/playground.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  appPlaygrounds?: Playground[];
  playground?: Playground;
  center: Center = { lat: 56.360029, lng: 10.746635 };
  markers$: Observable<Marker[]>;

  constructor(service: PlaygroundService, locationService: LocationService) {
    service.getPlaygrounds().subscribe(playgrounds => this.appPlaygrounds = playgrounds);
    locationService.current.subscribe(location => console.log(location));
    this.markers$ = locationService.current.pipe(
      map(location => [location])
    );
  }

  playgroundSelected(playground: Playground) {
    console.log(playground);
    this.playground = playground;
  }
}
