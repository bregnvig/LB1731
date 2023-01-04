import { Component } from '@angular/core';
import { combineLatest, interval, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { Center, Marker } from './leaflet';
import { Coordinate, Playground } from './model';
import { LocationService, PlaygroundService } from './service';
import { withLength } from './utils/rxjs-utils';

@Component({
  selector: 'loop-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  playgrounds$: Observable<Playground[]> | undefined;
  playground$ = new Subject<Playground>();
  center: Center = new Center(56.360029, 10.746635);
  markers$: Observable<Marker> | undefined;

  constructor(private service: PlaygroundService, private locationService: LocationService) {
  }

  ngOnInit() {
    this.locationService.location$.subscribe(location => {
      this.center = new Center(location.lat, location.lng, 12);
    });
    this.markers$ = merge(
      this.locationService.location$.pipe(map(location => new Marker('me', location.lat, location.lng))),
      this.playground$.pipe(map(p => new Marker('playground', p.position.lat, p.position.lng, p.name))),
    );

    const getDistance = this.locationService.getDistance;
    const compareLocations = (a: Coordinate, b: Coordinate) => a?.lat === b?.lat && a?.lng === b?.lng;
    this.playgrounds$ = combineLatest([
      this.service.playgrounds$.pipe(withLength()),
      this.locationService.location$.pipe(distinctUntilChanged(compareLocations)),
    ]).pipe(
      map(([playgrounds, location]) =>
        playgrounds.sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      )
    );
  }

}
