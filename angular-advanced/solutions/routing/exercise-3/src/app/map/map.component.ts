import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, combineLatest, merge, noop } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { EditPlaygroundModalComponent } from '../edit-playground-modal/edit-playground-modal.component';
import { FooterComponent } from '../footer/footer.component';
import { Center, Marker } from '../leaflet';
import { Coordinate, Playground } from '../model';
import { LocationService, PlaygroundService } from '../service';
import { shareLatest, truthy, withLength } from '../utils/rxjs-utils';

@Component({
  selector: 'loop-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  playgrounds$: Observable<Playground[]> | undefined;
  playground$!: Observable<Playground | undefined>;
  location$: Observable<Coordinate> = this.locationService.location$;
  center: Center = new Center(56.360029, 10.746635);
  markers$: Observable<Marker> | undefined;
  footerComponent = FooterComponent;

  constructor(
    private service: PlaygroundService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private modal: NgbModal,
  ) {
  }

  ngOnInit() {
    this.playground$ = this.route.params.pipe(
      map(params => params.id),
      switchMap(id => this.service.getById(id)),
      shareLatest(),
    );
    this.locationService.location$.subscribe(location => {
      this.center = new Center(location.lat, location.lng, 12);
    });
    this.markers$ = merge(
      this.locationService.location$.pipe(map(location => new Marker('me', location.lat, location.lng))),
      this.playground$.pipe(truthy(), map(p => new Marker('playground', p!.position.lat, p!.position.lng, p!.name))),
    );

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
