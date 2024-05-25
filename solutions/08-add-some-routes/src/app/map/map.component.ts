import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Center, LeafletModule, Marker } from '@loopme/leaflet';
import { Observable, combineLatest, map, shareReplay, switchMap } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';
import { LocationService, Playground } from '../shared';
import { PlaygroundService } from '../shared/playground.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-map',
  template: `
    <main class="vh-100 d-flex justify-content-center align-items-center">
      <leaflet [center]="center" [markers]="markers$ | async"></leaflet>
    </main>
    <app-sidebar [playgrounds]="appPlaygrounds" [selectedPlayground]="playground" (selected)="playgroundSelected($event)"></app-sidebar>
    @if(playground) {
      <app-footer [playground]="playground"></app-footer>
    }
  `,
  standalone: true,
  imports: [
    LeafletModule,
    SidebarComponent,
    FooterComponent,
    AsyncPipe,
  ],
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
      shareReplay(1),
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
