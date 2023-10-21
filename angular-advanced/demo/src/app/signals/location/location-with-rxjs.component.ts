import { JsonPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { MapOptions, icon, latLng, marker, tileLayer } from 'leaflet';
import { Subscription } from 'rxjs';
import { Coordinate, LocationService } from 'src/app/shared';

export const createOptions = (...coordinates: Coordinate[]): MapOptions => {
  return {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
      ...coordinates.map(coordinate => marker(coordinate, {
        icon: icon({
          iconUrl: 'assets/marker-icon.png',
          shadowUrl: 'assets/marker-shadow.png'
        })
      })),
    ],
    zoom: 17,
    center: latLng(coordinates[0]),
  };
};

@Component({
  selector: 'loop-location-with-rxjs',
  standalone: true,
  imports: [NgIf, JsonPipe, NgbAlert, LeafletModule],
  template: `
  <button type="button" class="btn btn-primary" (click)="subscription.unsubscribe()">Unsubscribe</button>
  <ngb-alert type="info" class="mt-3" [dismissible]="false">
<code><pre class="text-white mb-0">{{location | json}}</pre></code>
  </ngb-alert>
  <div *ngIf="options" style="height: 500px;"
      leaflet 
      [leafletOptions]="options">
  </div>

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
