import { Component, Input } from '@angular/core';
import { icon, latLng, MapOptions, marker, tileLayer } from 'leaflet';
import { Playground } from 'src/app/shared';

@Component({
  selector: 'loop-fancy-playground-details',
  template: `
    <h5>{{title}}</h5>
    @if (options) {
      <div style="height: 300px;"
        leaflet
        [leafletOptions]="options">
      </div>
    }
    `,
  styles: [
  ],
})
export class FancyPlaygroundDetailsComponent {

  title: string | undefined;
  options: MapOptions | undefined;

  @Input({ required: true })
  set playground(value: Playground) {
    this.title = value.name;
    this.options = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
        marker([value.position.lat, value.position.lng], {
          icon: icon({
            iconUrl: 'assets/marker-icon.png',
            shadowUrl: 'assets/marker-shadow.png'
          })
        }),
      ],
      zoom: 17,
      center: latLng(value.position.lat, value.position.lng),
    };
  }

}
