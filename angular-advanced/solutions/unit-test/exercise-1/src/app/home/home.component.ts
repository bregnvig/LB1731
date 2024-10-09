import { Component, OnInit } from '@angular/core';
import { combineLatest, interval, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { withLength } from '../utils/rxjs-utils';
import { LeafletComponent } from '../leaflet/leaflet.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponentModule } from '../footer/footer.component';
import { Marker } from '../leaflet/marker';
import { Center } from '../leaflet/center';
import { Coordinate } from '../model/coordinate';
import { Playground } from '../model/playground';
import { LocationService } from '../service/location.service';
import { PlaygroundService } from '../service/playground.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  template: `
    <leaflet [center]="center" [markers]="markers$"></leaflet>
    <loop-sidebar [playgrounds]="playgrounds$ | async" (selected)="playground$.next($event)"></loop-sidebar>
    @if(playground$ | async; as playground) {
      <loop-footer [playground]="playground"></loop-footer>
    }
  `,
  standalone: true,
  imports: [LeafletComponent, SidebarComponent, FooterComponentModule, AsyncPipe],
})
export class HomeComponent implements OnInit {

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
      interval(10000).pipe(startWith(null), switchMap(() => this.service.playgrounds$.pipe(withLength()))),
      this.locationService.location$.pipe(distinctUntilChanged(compareLocations)),
    ]).pipe(
      map(([playgrounds, location]) =>
        playgrounds.sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      )
    );
  }

}
