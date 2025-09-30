import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { FooterComponent } from './footer/footer.component';
import { Center, LeafletModule, Marker } from './leaflet';
import { Coordinate, Playground } from './model';
import { LocationService, PlaygroundService } from './service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { withLength } from './utils/rxjs-utils';

@Component({
  selector: 'loop-root',
  template: `
    <leaflet [center]="center" [markers]="markers$" />
    <loop-sidebar 
      [playgrounds]="playgrounds$ |async" 
      [location]="location$ | async" 
      (selected)="playground$.next($event)" />
    @if(playground$ | async; as playground) {
      <ng-container *ngComponentOutlet="component; inputs: { playground }" />
    }
  `,
  imports: [SidebarComponent, AsyncPipe, LeafletModule, NgComponentOutlet]
})
export class AppComponent {

  location$: Observable<Coordinate>;
  playgrounds$: Observable<Playground[]> | undefined;
  playground$ = new Subject<Playground>();
  center: Center = new Center(56.360029, 10.746635);
  markers$: Observable<Marker> | undefined;
  component = FooterComponent;

  constructor(service: PlaygroundService, locationService: LocationService) {
    this.location$ = locationService.location$;
    locationService.location$.pipe(
      takeUntilDestroyed()
    ).subscribe(location => {
      this.center = new Center(location.lat, location.lng, 12);
    });
    this.markers$ = merge(
      locationService.location$.pipe(map(location => new Marker('me', location.lat, location.lng))),
      this.playground$.pipe(map(p => new Marker('playground', p.position.lat, p.position.lng, p.name))),
    );

    const getDistance = locationService.getDistance;
    const compareLocations = (a: Coordinate, b: Coordinate) => a?.lat === b?.lat && a?.lng === b?.lng;
    this.playgrounds$ = combineLatest([
      service.playgrounds$.pipe(withLength()),
      locationService.location$.pipe(distinctUntilChanged(compareLocations)),
    ]).pipe(
      map(([playgrounds, location]) =>
        playgrounds.sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      )
    );
  }

}
