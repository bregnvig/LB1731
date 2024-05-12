import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, combineLatest, noop } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { EditPlaygroundModalComponent } from './edit-playground-modal/edit-playground-modal.component';
import { FooterComponent } from './footer/footer.component';
import { Center, LeafletModule, Marker } from './leaflet';
import { Coordinate, Playground } from './model';
import { AuthService, LocationService, PlaygroundService, Role } from './service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { withLength } from './utils/rxjs-utils';

@Component({
  selector: 'loop-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [SidebarComponent, FooterComponent, ReactiveFormsModule, AsyncPipe, LeafletModule]
})
export class AppComponent {

  playgrounds$: Observable<Playground[]> | undefined;
  playground$ = new Subject<Playground>();
  location$: Observable<Coordinate> = this.locationService.location$;
  center: Center = { lat: 56.360029, lng: 10.746635 };
  markers$: Observable<Marker[]> | undefined;
  roleControl = new FormControl<Role>('anonymous', { nonNullable: true });

  constructor(
    private service: PlaygroundService,
    private locationService: LocationService,
    private authService: AuthService,
    private modal: NgbModal,
  ) {
  }

  ngOnInit() {
    this.locationService.location$.subscribe(location => this.center = { ...location, zoom: 12 });
    this.markers$ = combineLatest([
      this.locationService.location$,
      this.playground$.pipe(map(p => p.position)),
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
    this.roleControl.valueChanges.subscribe(value => this.authService.role$.next(value));
  }

  edit(playground: Playground) {
    EditPlaygroundModalComponent.open(this.modal, playground).then(playground => this.service.update(playground), noop);
  }

}
