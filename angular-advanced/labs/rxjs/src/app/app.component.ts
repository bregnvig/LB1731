import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Center, Marker } from './leaflet';
import { Playground } from './model';
import { LocationService, PlaygroundService } from './service';

@Component({
  selector: 'loop-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  playgrounds: Playground[] = [];
  playground: Playground | undefined;
  center: Center = new Center(56.360029, 10.746635);
  markers$: Observable<Marker> | undefined;

  constructor(private service: PlaygroundService, private locationService: LocationService) {
  }

  ngOnInit() {
    this.locationService.location$.subscribe(location => {
      this.center = new Center(location.lat, location.lng, 12);
    });
    this.service.playgrounds$.subscribe(playgrounds => this.playgrounds = playgrounds);
  }

}
