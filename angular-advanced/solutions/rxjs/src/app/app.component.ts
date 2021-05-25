import { Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Center, Marker } from './leaflet';
import { Playground } from './model';
import { LocationService, PlaygroundService } from './service';

@Component({
  selector: 'loop-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  playgrounds$: Observable<Playground[]> | undefined;
  playground: Playground | undefined;
  center: Center = new Center(56.360029, 10.746635);
  markers$: Observable<Marker> | undefined;

  constructor(private service: PlaygroundService, private locationService: LocationService) {
  }

  ngOnInit() {
    this.locationService.location$.subscribe(location => {
      this.center = new Center(location.lat, location.lng, 12);
    });
    this.markers$ = this.locationService.location$.pipe(
      map(location => new Marker('me', location.lat, location.lng))
    );

    const getDistance = this.locationService.getDistance;
    this.playgrounds$ = combineLatest([
      this.service.playgrounds$,
      this.locationService.location$
    ]).pipe(
      map(([playgrounds, location]) =>
        playgrounds.sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      )
    );
  }

  playgroundSelected(playground: Playground): void {
    this.playground = playground;
    console.log('Playground selected', playground);
  }
}
