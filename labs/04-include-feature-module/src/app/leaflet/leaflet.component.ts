import { AfterViewInit, Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { control, latLng, map as mapContructor, tileLayer } from 'leaflet';
import { filter, map, pairwise, ReplaySubject, startWith, Subscription } from 'rxjs';
import { Center } from './center';
import { Marker } from './marker';
import { MarkerFactory } from './marker-factory';

const isMarker = (marker: Marker | undefined): marker is Marker => !!marker;

/* tslint:disable:component-selector-name */
/* tslint:disable:component-selector-prefix */
@UntilDestroy({ arrayName: 'subscribtions' })
@Component({
  selector: 'leaflet',
  template: '<div class="vh-100 vw-100 overflow-hidden" [id]="mapId"></div>',
})
export class LeafletComponent implements AfterViewInit {

  @Input() mapId = 'leafletMap';

  private subscriptions: Subscription[] = [];
  private center$ = new ReplaySubject<Center | undefined>(1);
  private markers$ = new ReplaySubject<Marker[] | undefined>(1);

  @Input() set markers(value: (Marker | undefined)[] | undefined | null) {
    this.markers$.next(value ?? undefined);
  }

  @Input() set center(center: Center | undefined) {
    this.center$.next(center);
  }

  ngAfterViewInit() {
    const _map = mapContructor(this.mapId, {
      zoomControl: false,
      center: undefined,
      zoom: 7,
      minZoom: 4,
      maxZoom: 19,
      layers: [tileLayer('///{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })]
    });
    control.zoom({ position: 'topleft' }).addTo(_map);
    control.scale().addTo(_map);
    this.subscriptions.push(
      this.center$.pipe(map(center => center?.zoom), filter(zoom => !!zoom)).subscribe(zoom => _map.setZoom(zoom!)),
      this.center$.pipe(filter(center => !!center)).subscribe(center => _map.setView(latLng(center!.lat, center!.lng))),
      this.markers$.pipe(
        startWith([]),
        map(markers => (markers?.filter(isMarker) ?? []) as Marker[]),
        map(markers => markers?.map(m => m && MarkerFactory.newMarker(latLng(m.lat, m.lng), false, m.message ?? ''))),
        pairwise(),
      ).subscribe(([previous, current]) => {
        previous?.forEach(m => m && _map.removeLayer(m));
        current?.forEach(m => m && m.addTo(_map));
      })
    );
  }

}
