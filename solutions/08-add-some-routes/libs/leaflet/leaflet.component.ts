import { AfterViewInit, Component, effect, input, signal } from '@angular/core';
import { control, latLng, LayerGroup, layerGroup, Map, map as mapContructor, tileLayer } from 'leaflet';
import { Center } from './center';
import { Marker } from './marker';
import { MarkerFactory } from './marker-factory';

const isMarker = (marker: Marker | undefined): marker is Marker => !!marker;

/* tslint:disable:component-selector-name */
/* tslint:disable:component-selector-prefix */
@Component({
  selector: 'leaflet',
  standalone: false,
  template: '<div class="vh-100 vw-100 overflow-hidden" [id]="mapId()"></div>',
})
export class LeafletComponent implements AfterViewInit {

  mapId = input<string>('leafletMap');
  markers = input<(Marker | undefined)[] | undefined | null>(undefined);
  center = input.required<Center | undefined>();
  #map = signal<Map | undefined>(undefined);
  #markerGroup: LayerGroup = layerGroup([]);

  constructor() {
    effect(() => {
      const center = this.center();
      const map = this.#map();
      if (center && map) {
        map.setView(latLng(center!.lat, center!.lng));
      }
    });
    effect(() => {
      const map = this.#map();
      const markers = this.markers() ?? [];
      if (map) {
        this.#markerGroup.clearLayers();
        markers
          .filter(isMarker)
          .map(m => m && MarkerFactory.newMarker(latLng(m.lat, m.lng), false, m.message ?? ''))
          .forEach(layer => this.#markerGroup.addLayer(layer!));
      }
    });
  }

  ngAfterViewInit() {
    const _map = mapContructor(this.mapId(), {
      zoomControl: false,
      center: undefined,
      zoom: 7,
      minZoom: 4,
      maxZoom: 19,
      layers: [
        tileLayer('///{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }),
      ]
    });
    control.zoom({ position: 'topleft' }).addTo(_map);
    control.scale().addTo(_map);
    this.#markerGroup.addTo(_map);
    this.#map.set(_map);
  }
}