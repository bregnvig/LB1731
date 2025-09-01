import { Component, computed, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Center, LeafletModule, Marker } from '@loopme/leaflet';
import { map, shareReplay, switchMap } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';
import { LocationService, Playground } from '../shared';
import { PlaygroundService } from '../shared/playground.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-map',
  template: `
    <main class="vh-100 d-flex justify-content-center align-items-center">
      <leaflet [center]="center()" [markers]="markers()"></leaflet>
    </main>
    <app-sidebar [playgrounds]="appPlaygrounds()" [selectedPlayground]="playground()" (selected)="playgroundSelected($event)"/>
    @if(playground(); as playground) {
      <app-footer [playground]="playground"/>
    }
  `,
  imports: [
    LeafletModule,
    SidebarComponent,
    FooterComponent,
  ],
})
export class MapComponent {

  appPlaygrounds: Signal<Playground[]>;
  playground: Signal<Playground | undefined>;
  center: Signal<Center>;
  markers: Signal<Marker[]>;

  constructor(
    service: PlaygroundService,
    locationService: LocationService,
    route: ActivatedRoute,
    private router: Router) {

    this.appPlaygrounds = toSignal(service.getPlaygrounds(), { initialValue: [] });

    this.playground = toSignal<Playground | undefined>(
      route.params.pipe(
        map(params => params['id']),
        switchMap(id => service.find(id)),
        shareReplay(1),
      ));
    this.markers = computed(() => {
      const current = locationService.current();
      const playground = this.playground();
      return [
        current,
        playground?.position
      ];
    });
    this.center = computed(() => {
      const playground = this.playground();
      return playground?.position ?? { lat: 56.360029, lng: 10.746635 };
    });
  }

  playgroundSelected(playground: Playground) {
    console.log(playground);
    this.router.navigate([playground.id]);
  }

}
