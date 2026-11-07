import { Component, computed, effect, inject, Signal, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Center, LeafletModule, Marker } from '@loopme/leaflet';
import { map, switchMap } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';
import { LocationService, Playground } from '../shared';
import { PlaygroundService } from '../shared/playground.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-map',
  template: `
    <main class="vh-100 d-flex justify-content-center align-items-center">
      <leaflet [center]="center()" [markers]="markers()" />
    </main>
    <app-sidebar [playgrounds]="appPlaygrounds()" [selectedPlayground]="playground()" (selected)="playgroundSelected($event)" />
    <app-footer [playground]="playground()" />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
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

  private router = inject(Router);

  constructor() {
    const service = inject(PlaygroundService);
    const locationService = inject(LocationService);
    const route = inject(ActivatedRoute);

    this.appPlaygrounds = toSignal(service.getPlaygrounds(), { initialValue: [] });
    effect(() => {
      const current = locationService.current();
      if (current) {
        console.log('Got your location', current);
      }
    });

    this.playground = toSignal<Playground | undefined>(
      route.params.pipe(
        map(params => params['id']),
        switchMap(id => service.find(id)),
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
      return playground?.position ? { ...playground.position, zoom: 14 } : { lat: 56.360029, lng: 10.746635, zoom: 7 };
    });
  }

  playgroundSelected(playground: Playground) {
    console.log(playground);
    this.router.navigate([playground.id]);
  }

}
