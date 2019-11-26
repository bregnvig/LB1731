import { LocationService } from './../shared/location.service';
import { PlaygroundService } from './../shared/playground.service';
import { Observable, merge } from 'rxjs';
import { Center, Marker } from './../leaflet';
import { Playground } from './../shared/playground';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { pluck, filter, switchMap, share, map, shareReplay } from 'rxjs/operators';

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
    const playground$ = this.route.params.pipe(
        pluck<Params, string>('id'),
        filter(id => !!id),
        switchMap(id => this.service.find(id)),
        filter(playground => !!playground),
        shareReplay(),
    )
      
    playground$.subscribe(playground => {
      this.playground = playground;
      this.center = new Center(playground.position.lat, playground.position.lng, 12);
    });
    this.markers$ = merge(
      this.locationService.current.pipe(map(location => new Marker('me', location.lat, location.lng))),
      playground$.pipe(map(p => new Marker(p.name, p.position.lat, p.position.lng))),
    );
  }

  public playgroundSelected(playground: Playground): void {
    // this.playground = playground;
    this.router.navigate([playground.id]);
    console.log('Playground selected', playground);
  }

}
