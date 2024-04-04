import { AsyncPipe, NgComponentOutlet, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ComponentOutletInjectorDirective, DynamicIoDirective } from 'ng-dynamic-component';
import { Observable, Subject, combineLatest, merge } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { FooterComponent } from './footer/footer.component';
import { Center, Marker } from './leaflet';
import { LeafletModule } from "./leaflet/leaflet.module";
import { Coordinate, Playground } from './model';
import { LocationService, PlaygroundService } from './service';
import { SidebarListItemComponent } from './sidebar/sidebar-list-item/sidebar-list-item.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { withLength } from './utils/rxjs-utils';

@Component({
  selector: 'loop-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [SidebarListItemComponent, FaIconComponent, SidebarComponent, NgIf, NgComponentOutlet, ComponentOutletInjectorDirective, DynamicIoDirective, AsyncPipe, LeafletModule]
})
export class AppComponent {

  @ViewChild(SidebarComponent, { static: true }) sidebar!: SidebarComponent;

  playgrounds$: Observable<Playground[]> | undefined;
  playground$ = new Subject<Playground>();
  center: Center = new Center(56.360029, 10.746635);
  markers$: Observable<Marker> | undefined;
  location$ = this.locationService.location$;
  component = FooterComponent;
  filterFn = (term: string, playground: Playground) => playground.name.toLocaleLowerCase().includes(term.toLocaleLowerCase());

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
