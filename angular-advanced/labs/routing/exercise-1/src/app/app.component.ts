import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, combineLatest, noop } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { EditPlaygroundModalComponent } from './edit-playground-modal/edit-playground-modal.component';
import { FooterComponent } from './footer/footer.component';
import { Center, LeafletModule, Marker } from './leaflet';
import { Coordinate, Playground } from './model';
import { LocationService, PlaygroundService } from './service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { truthy, withLength } from './utils/rxjs-utils';

@Component({
  selector: 'loop-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [LeafletModule, SidebarComponent, NgIf, FooterComponent, AsyncPipe]
})
export class AppComponent {

  playgrounds$: Observable<Playground[]> | undefined;
  playground$ = new Subject<Playground>();
  location$: Observable<Coordinate> = this.locationService.location$;
  center: Center = { lat: 56.360029, lng: 10.746635 };
  markers$: Observable<Marker[]>;

  constructor(
    private service: PlaygroundService,
    private locationService: LocationService,
    private modal: NgbModal,
  ) {
    this.locationService.location$.subscribe(location => this.center = { ...location, zoom: 12 });
    this.markers$ = combineLatest([
      this.locationService.location$,
      this.playground$.pipe(truthy(), map(p => p.position)),
    ]);

    const getDistance = this.locationService.getDistance;
    const compareLocations = (a: Coordinate, b: Coordinate) => a?.lat === b?.lat && a?.lng === b?.lng;
    this.playgrounds$ = combineLatest([
      this.service.playgrounds$.pipe(withLength()),
      this.locationService.location$.pipe(distinctUntilChanged(compareLocations)),
    ]).pipe(
      map(([playgrounds, location]) =>
        playgrounds
          .sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      )
    );
  }

  edit(playground: Playground) {
    EditPlaygroundModalComponent.open(this.modal, playground).then(playground => this.service.update(playground), noop);
  }

}
