import { LocationService } from './../shared/location.service';
import { PlaygroundService } from './../shared/playground.service';
import { Observable } from 'rxjs';
import { Center, Marker } from './../leaflet';
import { Playground } from './../shared/playground';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

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
    const playground$ = this.route.params
      .pluck<Params, string>('id')
      .filter(id => !!id)
      .switchMap(id => this.service.find(id))
      .filter(playground => !!playground);

    playground$.subscribe(playground => {
      this.playground = playground;
      this.center = new Center(playground.position.lat, playground.position.lng, 17);
    });
    this.markers$ = this.locationService.current
      .map(location => new Marker('me', location.lat, location.lng))
      .merge(playground$.map(playground => new Marker('playground', playground.position.lat, playground.position.lng)));
  }

  public playgroundSelected(playground: Playground): void {
    this.playground = playground;
    this.router.navigate(['/', playground.id]);
    console.log('Playground selected', playground);
  }

}
