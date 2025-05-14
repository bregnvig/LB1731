import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { EditPlaygroundModalComponent } from './edit-playground/edit-playground-modal.component';
import { ErrorComponent } from "./error.component";
import { FooterComponent } from "./footer/footer.component";
import { Center, LeafletModule, Marker } from './leaflet';
import { Coordinate, Playground } from './model';
import { LocationService, PlaygroundService } from './service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { withLength } from './utils/rxjs-utils';

@Component({
  selector: 'loop-root',
  templateUrl: './app.component.html',
  imports: [FooterComponent, SidebarComponent, AsyncPipe, LeafletModule, ErrorComponent]
})
export class AppComponent {

  playgrounds$: Observable<Playground[]> | undefined;
  playground$ = new Subject<Playground>();
  location$: Observable<Coordinate> = this.locationService.location$;
  center$: Observable<Center>;
  markers$: Observable<Marker[]> | undefined;
  #reload = new BehaviorSubject<void>(undefined);
  error: any;
  loading = true;

  constructor(
    private service: PlaygroundService,
    private modal: NgbModal,
    private locationService: LocationService,
  ) {
    this.markers$ = combineLatest([
      locationService.location$,
      this.playground$.pipe(map(p => ({ ...p.position, message: p.name })), startWith(undefined)),
    ]);

    const getDistance = locationService.getDistance;
    const compareLocations = (a: Coordinate, b: Coordinate) => a?.lat === b?.lat && a?.lng === b?.lng;
    this.playgrounds$ = combineLatest([
      this.#reload.pipe(switchMap(()  => this.service.list().pipe(withLength()))),
      locationService.location$.pipe(distinctUntilChanged(compareLocations)),
    ]).pipe(
      map(([playgrounds, location]) =>
        playgrounds
          .sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      ),
      tap(() => this.loading = false),
    );
    this.center$ = locationService.location$.pipe(
      startWith({ lat: 56.360029, lng: 10.746635 }),
      map(location => ({ ...location, zoom: 12 }))
    );
  }

  async edit(playground: Playground) {
    EditPlaygroundModalComponent.open(this.modal, playground)
      .then(() => {
        this.#reload.next();
        this.loading = true;
    })
      .catch(error => this.error = error);
  }

}
