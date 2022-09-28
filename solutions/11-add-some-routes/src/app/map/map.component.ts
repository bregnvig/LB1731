import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, merge, Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { Center, Marker } from './../leaflet';
import { LocationService } from './../shared/location.service';
import { Playground } from './../shared/playground';
import { PlaygroundService } from './../shared/playground.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public playgrounds: Playground[];
  public playground: Playground;
  public center: Center = new Center(56.360029, 10.746635);
  public markers$: Observable<Marker>;

  public constructor(
    private service: PlaygroundService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  public ngOnInit() {
    this.service.getPlaygrounds().subscribe(playgrounds => this.playgrounds = playgrounds);
    const playground$: Observable<Playground> = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.service.find(id)),
      shareReplay(1),
    );
    combineLatest([
      playground$,
      this.locationService.current,
    ]).subscribe(([playground, location]) => {
      this.playground = playground;
      this.center = playground
        ? new Center(playground.position.lat, playground.position.lng, 12)
        : new Center(location.lat, location.lng, 14);
    });
    this.markers$ = merge(
      this.locationService.current.pipe(map(location => new Marker('me', location.lat, location.lng))),
      playground$.pipe(map(p => new Marker('legeplads', p.position.lat, p.position.lng))),
    );
  }

  playgroundSelected(playground: Playground): void {
    this.router.navigate([playground.id]);
    console.log('Playground selected', playground);
  }

}
