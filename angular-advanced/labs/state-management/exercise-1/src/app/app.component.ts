import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { FooterComponent } from "./footer/footer.component";
import { Center, LeafletModule, Marker } from './leaflet';
import { Coordinate, Playground } from './model';
import { LocationService, PlaygroundService } from './service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { withLength } from './utils/rxjs-utils';

@Component({
  selector: 'loop-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [FooterComponent, SidebarComponent, AsyncPipe, LeafletModule, NgIf],
})
export class AppComponent {

  playgrounds$: Observable<Playground[]> | undefined;
  playground$ = new Subject<Playground>();
  location$: Observable<Coordinate> = this.locationService.location$;
  center$: Observable<Center>;
  markers$: Observable<Marker[]> | undefined;

  constructor(
    service: PlaygroundService,
    private locationService: LocationService,
  ) {
    this.markers$ = combineLatest([
      locationService.location$,
      this.playground$.pipe(map(p => ({ ...p.position, message: p.name })), startWith(undefined)),
    ]);

    const getDistance = locationService.getDistance;
    const compareLocations = (a: Coordinate, b: Coordinate) => a?.lat === b?.lat && a?.lng === b?.lng;
    this.playgrounds$ = combineLatest([
      service.list().pipe(withLength()),
      locationService.location$.pipe(distinctUntilChanged(compareLocations)),
    ]).pipe(
      map(([playgrounds, location]) =>
        playgrounds
          .sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      )
    );
    this.center$ = locationService.location$.pipe(
      startWith({ lat: 56.360029, lng: 10.746635 }),
      map(location => ({ ...location, zoom: 12 }))
    );
  }
}
