import { Component, computed, effect, inject, Signal, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Center, LeafletModule, Marker } from '@loopme/leaflet';
import { FooterComponent } from './footer/footer.component';
import { LocationService } from './shared';
import { Playground } from './shared/playground';
import { PlaygroundService } from './shared/playground.service';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  template: `
    <main class="vh-100 d-flex justify-content-center align-items-center">
      <leaflet [center]="center" [markers]="markers()" />
    </main>
    <app-sidebar [playgrounds]="appPlaygrounds()" (selected)="playgroundSelected($event)" />
    <app-footer [playground]="playground" />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LeafletModule, SidebarComponent, FooterComponent]
})
export class AppComponent {

  appPlaygrounds: Signal<Playground[]>;
  playground?: Playground;
  center: Center = {
    lat: 56.360029,
    lng: 10.746635,
  };
  markers: Signal<Marker[]>;

  constructor() {
    const service = inject(PlaygroundService);
    const locationService = inject(LocationService);

    this.appPlaygrounds = toSignal(service.getPlaygrounds(), { initialValue: [] });
    effect(() => {
      const current = locationService.current();
      if (current) {
        console.log('Got your location', current);
      }
    });
    this.markers = computed(() => {
      const current = locationService.current();
      return [current];
    });
  }

  playgroundSelected(playground: Playground) {
    console.log(playground);
    this.playground = playground;
  }
}
