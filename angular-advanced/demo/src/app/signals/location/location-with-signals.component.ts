import { JsonPipe } from '@angular/common';
import { Component, Signal, computed } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { MapOptions } from 'leaflet';
import { Coordinate, LocationService } from 'src/app/shared';
import { createOptions } from './location-with-rxjs.component';

@Component({
  selector: 'loop-location-with-signals',
  standalone: true,
  imports: [NgbAlert, JsonPipe, LeafletModule],
  template: `
  <ngb-alert type="info" class="mt-3" [dismissible]="false">
    <code><pre class="text-white mb-0">{{location() | json}}</pre></code>
  </ngb-alert>
  @if (options(); as options) {
    <div style="height: 500px;"
      leaflet
      [leafletOptions]="options">
    </div>
  }`,
})
export class LocationWithSignalsComponent {

  location: Signal<Coordinate | undefined>;
  options: Signal<MapOptions | undefined>;

  constructor(service: LocationService) {
    this.location = service.location;
    this.options = computed(() => {
      const location = this.location();
      return location ? createOptions(location) : undefined;
    });
  }
}
