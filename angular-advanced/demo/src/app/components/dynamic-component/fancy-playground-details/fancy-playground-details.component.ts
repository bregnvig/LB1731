import { Component, effect, EventEmitter, input, Output } from '@angular/core';
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
    <p class="mt-3 mb-0">
      <button class="btn btn-sm btn-secondary">
        <fa-icon size="2x" [icon]="['far', 'thumbs-up']" (click)="vote.emit('up')"/>
      </button>
      <button class="ms-2 btn btn-sm btn-secondary">
        <fa-icon size="2x" [icon]="['far', 'thumbs-down']" (click)="vote.emit('down')"/>
      </button>
    </p>
    }
    `,
  styles: [],
  standalone: false
})
export class FancyPlaygroundDetailsComponent {

  title: string | undefined;
  options: MapOptions | undefined;

  playground = input.required<Playground>();
  @Output() vote = new EventEmitter<'up' | 'down'>();

  constructor() {
    effect(() => {
      const value = this.playground();
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
    });
  }

}
