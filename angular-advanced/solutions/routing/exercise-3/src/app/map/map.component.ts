import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, combineLatest, noop } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { EditPlaygroundModalComponent } from '../edit-playground-modal/edit-playground-modal.component';
import { FooterComponent } from '../footer/footer.component';
import { Center, LeafletModule, Marker } from '../leaflet';
import { Coordinate, Playground } from '../model';
import { LocationService, PlaygroundService } from '../service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { shareLatest, truthy, withLength } from '../utils/rxjs-utils';

@Component({
    selector: 'loop-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    imports: [LeafletModule, SidebarComponent, FooterComponent, AsyncPipe]
})
export class MapComponent {

  playgrounds$: Observable<Playground[]> | undefined;
  playground$!: Observable<Playground | undefined>;
  location$: Observable<Coordinate> = this.locationService.location$;
  center: Center = { lat: 56.360029, lng: 10.746635 };
  markers$: Observable<Marker[]>;
  footerComponent = FooterComponent;

  constructor(
    private service: PlaygroundService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private modal: NgbModal,
  ) {
    this.playground$ = this.route.params.pipe(
      map(params => params.id),
      switchMap(id => this.service.getById(id)),
      shareLatest(),
    );
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
      this.route.queryParams.pipe(
        map(params => new RegExp(params['filter'] ?? '', 'i'))
      ),
    ]).pipe(
      map(([playgrounds, location, matcher]) =>
        playgrounds
          .filter(({ name }) => matcher.test(name))
          .sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      )
    );
  }

  edit(playground: Playground) {
    EditPlaygroundModalComponent.open(this.modal, playground).then(playground => this.service.update(playground), noop);
  }

}
