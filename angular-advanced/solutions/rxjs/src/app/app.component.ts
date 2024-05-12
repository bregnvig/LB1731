import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { combineLatest, interval, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { FooterComponent } from './footer/footer.component';
import { Center, LeafletComponent, Marker } from './leaflet';
import { Coordinate, Playground } from './model';
import { LocationService, PlaygroundService } from './service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { withLength } from './utils/rxjs-utils';

@Component({
  selector: 'loop-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [LeafletComponent, SidebarComponent, NgIf, FooterComponent, AsyncPipe]
})
export class AppComponent {

  playgrounds$: Observable<Playground[]>;
  playground$ = new Subject<Playground>();
  center: Center = { lat: 56.360029, lng: 10.746635 };
  markers$?: Observable<Marker[]>;

  constructor(private service: PlaygroundService, private locationService: LocationService) {
    this.markers$ = combineLatest([
      this.locationService.location$,
      this.playground$.pipe(map(p => p.position), startWith(undefined)),
    ]);

    const getDistance = this.locationService.getDistance;
    const compareLocations = (a: Coordinate, b: Coordinate) => a?.lat === b?.lat && a?.lng === b?.lng;

    this.playgrounds$ = combineLatest([
      interval(10000).pipe(startWith(null), switchMap(() => this.service.playgrounds$.pipe(withLength()))),
      this.locationService.location$.pipe(distinctUntilChanged(compareLocations)),
    ]).pipe(
      map(([playgrounds, location]) =>
        playgrounds.sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      )
    );
  }

  ngOnInit() {
    this.locationService.location$.subscribe(location => {
      this.center = { ...location, zoom: 12 };
    });
  }

}
