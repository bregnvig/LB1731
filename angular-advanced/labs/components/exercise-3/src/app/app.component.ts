import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { FooterComponent } from './footer/footer.component';
import { Center, LeafletComponent, Marker } from './leaflet';
import { Coordinate, Playground } from './model';
import { LocationService, PlaygroundService } from './service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { withLength } from './utils/rxjs-utils';
import { DynamicIoModule } from 'ng-dynamic-component';

@Component({
    selector: 'loop-root',
    template: `
      <leaflet [center]="center" [markers]="markers$"></leaflet>
      <loop-sidebar [playgrounds]="playgrounds$ | async" (selected)="playground$.next($event)"></loop-sidebar>
      @if (playground$ | async; as playground) {
        <ng-template [ngComponentOutlet]="component" [ndcDynamicInputs]="{ playground }"/>
      }
    `,
    imports: [SidebarComponent, AsyncPipe, LeafletComponent, NgComponentOutlet, DynamicIoModule]
})
export class AppComponent {

  playgrounds$: Observable<Playground[]> | undefined;
  playground$ = new Subject<Playground>();
  center: Center = new Center(56.360029, 10.746635);
  markers$: Observable<Marker> | undefined;
  
  component = FooterComponent;

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
