import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, Observable, shareReplay, switchMap } from 'rxjs';
import { Center, Marker } from '../leaflet';
import { LocationService, Playground } from '../shared';
import { PlaygroundService } from '../shared/playground.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  appPlaygrounds?: Playground[];
  playground?: Playground;
  center: Center = { lat: 56.360029, lng: 10.746635 };
  markers$: Observable<Marker[]>;

  constructor(
    service: PlaygroundService,
    locationService: LocationService,
    route: ActivatedRoute,
    private router: Router) {

    service.getPlaygrounds().subscribe(playgrounds => this.appPlaygrounds = playgrounds);
    const playground$ = route.params.pipe(
      map(params => params['id']),
      switchMap(id => service.find(id)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.markers$ = combineLatest([
      locationService.current,
      playground$.pipe(map(p => p?.position))
    ]);
    playground$.subscribe(playground => {
      this.playground = playground;
      playground && (this.center = { ...playground.position, zoom: 14 });
    });
  }

  playgroundSelected(playground: Playground) {
    console.log(playground);
    this.router.navigate([playground.id]);
  }

}
