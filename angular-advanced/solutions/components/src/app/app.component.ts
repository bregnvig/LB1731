import { Component, ViewChild } from '@angular/core';
import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { FooterComponent } from './footer/footer.component';
import { Center, Marker } from './leaflet';
import { Coordinate, Playground } from './model';
import { LocationService, PlaygroundService } from './service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { withLength } from './utils/rxjs-utils';

@Component({
  selector: 'loop-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(SidebarComponent, { static: true }) sidebar!: SidebarComponent;
  playgrounds$: Observable<Playground[]> | undefined;
  playground$ = new Subject<Playground>();
  location$: Observable<Coordinate> = this.locationService.location$;
  center: Center = new Center(56.360029, 10.746635);
  markers$: Observable<Marker> | undefined;
  footerComponent = FooterComponent;

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
      this.sidebar.filterChanged.pipe(map(term => term.toLowerCase()), startWith('')),
      this.locationService.location$.pipe(distinctUntilChanged(compareLocations)),
    ]).pipe(
      map(([playgrounds, term, location]) =>
        playgrounds
          .filter(playground => playground.name.toLowerCase().includes(term))
          .sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      )
    );
  }

}
