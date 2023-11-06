import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, noop } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Coordinate } from '../model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  readonly location$: Observable<Coordinate>;
  readonly location: Signal<Coordinate | undefined>;

  constructor() {

    this.location$ = new Observable<GeolocationPosition>(observer => {
      const watchId = window.navigator.geolocation.watchPosition(position => {
        console.log('Looking for geolocation...');
        observer.next(position);
        console.log('Got geolocation...');
      }, noop);
      return () => window.navigator.geolocation.clearWatch(watchId);
    }).pipe(
      map((position: GeolocationPosition) => {
        return {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
    this.location = toSignal(this.location$, { initialValue: undefined });
  }

  getDistance(p1: Coordinate, p2: Coordinate) {

    const c = Math.cos;
    const p = 0.017453292519943295;    // Math.PI / 180

    const a = 0.5 - c((p2.lat - p1.lat) * p) / 2 + c(p1.lat * p) * c(p2.lat * p) * (1 - c((p2.lng - p1.lng) * p)) / 2;

    return Math.floor(12742000 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
  }
}
