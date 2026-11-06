import { Component, computed, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Center, LeafletModule, Marker } from '@loopme/leaflet';
import { FooterComponent } from './footer/footer.component';
import { LocationService } from './shared';
import { Playground } from './shared/playground';
import { PlaygroundService } from './shared/playground.service';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [LeafletModule, SidebarComponent, FooterComponent]
})
export class AppComponent {

  appPlaygrounds: Signal<Playground[]>;
  playground?: Playground;
  center: Center = { lat: 56.360029, lng: 10.746635 };
  markers: Signal<Marker[]>;

  constructor(service: PlaygroundService, locationService: LocationService) {

    this.appPlaygrounds = toSignal(service.getPlaygrounds(), { initialValue: [] });
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
