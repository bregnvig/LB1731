import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, merge, noop, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { EditPlaygroundModalComponent } from '../edit-playground-modal/edit-playground-modal.component';
import { FooterComponent } from '../footer/footer.component';
import { Center, Marker } from '../leaflet';
import { LeafletComponent } from '../leaflet/leaflet.component';
import { Coordinate, Playground } from '../model';
import { LocationService, PlaygroundService } from '../service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { shareLatest, truthy, withLength } from '../utils/rxjs-utils';

@Component({
  selector: 'loop-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @ViewChild(LeafletComponent, { static: true }) leaflet!: LeafletComponent;
  @ViewChild(SidebarComponent, { static: true }) sidebar!: SidebarComponent;

  playgrounds$: Observable<Playground[]> | undefined;
  playground$!: Observable<Playground | undefined>;
  term$: Observable<string> = this.route.queryParams.pipe(map(params => params.term));
  location$: Observable<Coordinate> = this.locationService.location$;
  center: Center = new Center(56.360029, 10.746635);
  markers$: Observable<Marker> | undefined;
  footerComponent = FooterComponent;

  constructor(
    private service: PlaygroundService,
    private locationService: LocationService,
    private router: Router,
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
    combineLatest([
      this.locationService.location$,
      this.route.queryParams.pipe(
        map(params => params.zoom || 12),
      )
    ]).subscribe(([location, zoomLevel]) => {
      this.center = new Center(location.lat, location.lng, zoomLevel);
    });
    combineLatest([
      this.leaflet.zoomed.pipe(debounceTime(200)),
      this.sidebar.filter.pipe(debounceTime(300), startWith(this.route.snapshot.queryParams.term)),
    ]).subscribe(([zoom, term]) => this.router.navigate([], { queryParams: { zoom, term } }));
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
        map(params => params.term || ''),
        map(term => new RegExp(term, 'i')),
      )
    ]).pipe(
      map(([playgrounds, location, matcher]) =>
        playgrounds
          .filter(p => matcher.test(p.name))
          .sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      )
    );
  }

  edit(playground: Playground) {
    EditPlaygroundModalComponent.open(this.modal, playground).then(playground => this.service.update(playground), noop);
  }


}
