import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, merge, noop, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { EditPlaygroundModalComponent } from './edit-playground-modal/edit-playground-modal.component';
import { Center, Marker } from './leaflet';
import { Coordinate, Playground } from './model';
import { AuthService, LocationService, PlaygroundService } from './service';
import { withLength } from './utils/rxjs-utils';

@Component({
  selector: 'loop-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  playgrounds$: Observable<Playground[]> | undefined;
  playground$ = new Subject<Playground>();
  location$: Observable<Coordinate> = this.locationService.location$;
  center: Center = new Center(56.360029, 10.746635);
  markers$: Observable<Marker> | undefined;
  roleControl = new FormControl('anonymous');

  constructor(
    private service: PlaygroundService,
    private locationService: LocationService,
    private authService: AuthService,
    private modal: NgbModal,
  ) {
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
        playgrounds
          .sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      )
    );
    this.roleControl.valueChanges.subscribe(value => this.authService.role$.next(value));
  }

  edit(playground: Playground) {
    EditPlaygroundModalComponent.open(this.modal, playground).then(playground => this.service.update(playground), noop);
  }

}
