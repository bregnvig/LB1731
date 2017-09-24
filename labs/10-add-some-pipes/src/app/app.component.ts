import { Observable } from 'rxjs';
import { Center, Marker } from './leaflet';
import { LocationService } from './shared/location.service';
import { PlaygroundService } from './shared/playground.service';
import { Component, OnInit } from '@angular/core';

import { Playground } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  public title = 'app works!';
  public playgrounds: Playground[];
  public playground: Playground;
  public center: Center = new Center(56.360029, 10.746635);
  public markers$: Observable<Marker>;

  public constructor(private service: PlaygroundService, private locationService: LocationService) {
  }

  public ngOnInit() {
    this.service.getPlaygrounds().subscribe(playgrounds => this.playgrounds = playgrounds);
    this.locationService.current.subscribe(location => {
      this.center = new Center(location.lat, location.lng, 12);
    });
    this.markers$ = this.locationService.current
      .map(location => new Marker('me', location.lat, location.lng));
  }

  public playgroundSelected(playground: Playground): void {
    this.playground = playground;
    console.log('Playground selected', playground);
  }
}
