import { AsyncPipe, NgIf, } from '@angular/common';
import { Component, Signal, computed, signal } from '@angular/core';
import { FooterComponent } from "./footer/footer.component";
import { LeafletModule, Marker } from './leaflet';
import { Playground } from './model';
import { LocationService, PlaygroundService } from './service';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'loop-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [FooterComponent, SidebarComponent, AsyncPipe, LeafletModule, NgIf],
})
export class AppComponent {

  playgrounds: Signal<Playground[]>;
  playground: Signal<Playground | undefined>;
  selectedId = signal<string | undefined>(undefined);
  center = computed(() => ({ ...(this.locationService.location() ?? { lat: 56.360029, lng: 10.746635 }), zoom: 14 }));

  markers = computed(() => [
    this.locationService.location(),
    this.playground()?.position
  ] as Marker[]);

  constructor(
    service: PlaygroundService,
    private locationService: LocationService,
  ) {
    const getDistance = locationService.getDistance;

    this.playgrounds = computed(() => {
      return service.playgrounds().sort((a, b) => {
        const location = this.locationService.location();
        return location
          ? getDistance(a.position, location) - getDistance(b.position, location)
          : 0;
      });
    });
    this.playground = computed(() => {
      return this.playgrounds().find(({ id }) => this.selectedId() === id);
    });
  }

}
