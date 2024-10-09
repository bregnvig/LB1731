
import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { control, latLng, LatLng, Map, map, Marker as LeafletMarker, TileLayer, tileLayer } from 'leaflet';
import { Observable, Subscription } from 'rxjs';
import { Center } from './center';
import { Marker } from './marker';
import { MarkerFactory } from './marker-factory';

/* tslint:disable:component-selector-name */
/* tslint:disable:component-selector-prefix */
@Component({
  selector: 'leaflet',
  template: `<div class="leaflet-100" id="playgroundsMap"></div>`,
  styles: `
    .leaflet-100 {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  `,
  standalone: true,
})
export class LeafletComponent implements AfterViewInit, OnDestroy {

  baseMaps: { [name: string]: TileLayer };

  private map: Map | undefined;
  private _zoom = 8;
  private _center: LatLng | undefined;

  private _markers$: Observable<Marker> | undefined;
  private namedMarkers: { [key: string]: LeafletMarker | undefined } = {};
  private subscriptions: Subscription[] = [];



  constructor() {
    this.baseMaps = {
      OpenStreetMap: tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    };
  }

  ngAfterViewInit() {
    this.map = map('playgroundsMap', {
      zoomControl: false,
      center: this._center,
      zoom: this._zoom,
      minZoom: 4,
      maxZoom: 19,
      layers: [this.baseMaps['OpenStreetMap']]
    });
    control.zoom({ position: 'topleft' }).addTo(this.map);
    control.scale().addTo(this.map);
    this.subscribe();
  }

  ngOnDestroy() {
    (this.subscriptions || []).forEach(s => s.unsubscribe());
  }

  @Input()
  set center(center: Center) {
    console.log('Updating center', center, this._zoom);
    this._center = center && latLng(center.latitude, center.longitude);
    if (center && center.zoom) {
      this._zoom = center.zoom;
    }
    if (this.map && center) {
      this.map.setView(this._center, this._zoom);
    }
  }

  @Input() set markers(value: Observable<Marker> | undefined) {
    this._markers$ = value;
    this.subscribe();
  }

  @Input()
  set zoom(zoom: number) {
    console.log('Setting zoom', zoom);
    this._zoom = zoom;
    this.map && this.map.setZoom(zoom, {});
  }

  private subscribe() {
    if (this._markers$ && this.map) {
      this.subscriptions.push(this._markers$.subscribe(marker => this.addMarker(marker)));
    }
  }

  private addMarker(marker: Marker): LeafletMarker | undefined {

    this.removeMarker(marker.name);
    if (marker.hasPosition && this.map) {
      const position = latLng(marker.latitude, marker.longitude);
      console.log('Adding marker', position);
      this.namedMarkers[marker.name] = MarkerFactory.newMarker(position, false, marker.message).addTo(this.map);
      return this.namedMarkers[marker.name]!;
    }
    return;
  }

  private removeMarker(name: string): void {
    if (this.namedMarkers[name] && this.map) {
      console.log('Removing marker', name, this.namedMarkers[name]!.getLatLng());
      this.map.removeLayer(this.namedMarkers[name]!);
      this.namedMarkers[name] = undefined;
    }
  }
}
