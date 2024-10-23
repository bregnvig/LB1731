import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { MapOptions } from 'leaflet';
import { Subscription } from 'rxjs';
import { Coordinate, LocationService } from 'src/app/shared';
import { createOptions } from './create-options';


@Component({
  selector: 'loop-location-with-rxjs',
  standalone: true,
  imports: [JsonPipe, NgbAlert, LeafletModule],
  template: `
    <button type="button" class="btn btn-primary" (click)="subscription.unsubscribe()">Unsubscribe</button>
    <ngb-alert type="info" class="mt-3" [dismissible]="false">
      <code><pre class="text-white mb-0">{{location | json}}</pre></code>
    </ngb-alert>
    @if (options) {
      <div style="height: 500px;"
        leaflet
        [leafletOptions]="options">
      </div>
    }
  `
})
export class LocationWithRxjsComponent {

  subscription: Subscription;
  location?: Coordinate;
  options?: MapOptions;

  constructor(service: LocationService) {
    this.subscription = service.location$.subscribe(location => {
      this.location = location;
      this.options = createOptions(location);
    });
  }
}
