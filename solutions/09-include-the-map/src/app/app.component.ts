import { Observable } from 'rxjs';
import { Center, Marker } from './leaflet';
import { LocationService } from './shared/location.service';
import { PlaygroundService } from './shared/playground.service';
import { Component, OnInit } from '@angular/core';

import { Playground } from './shared';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  title = 'app works!';
  playgrounds: Playground[];
  playground: Playground;
  center: Center = new Center(56.360029, 10.746635);
  markers$: Observable<Marker>;

  constructor(private service: PlaygroundService, private locationService: LocationService) {
  }

  ngOnInit() {
    this.service.getPlaygrounds().subscribe(playgrounds => this.playgrounds = playgrounds);
    this.locationService.current.subscribe(location => {
      this.center = new Center(location.lat, location.lng, 12);
    });
    this.markers$ = this.locationService.current.pipe(
      map(location => new Marker('me', location.lat, location.lng))
    );
  }

  playgroundSelected(playground: Playground): void {
    this.playground = playground;
    console.log('Playground selected', playground);
  }
}
