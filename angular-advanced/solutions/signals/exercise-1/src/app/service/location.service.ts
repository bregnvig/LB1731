import { Injectable, Signal, computed, signal } from '@angular/core';
import { Observable, noop } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Coordinate } from '../model';
import { toSignal } from '@angular/core/rxjs-interop';

const geolocation$ = new Observable<GeolocationPosition>(observer => {
  let watchId = 0;
  navigator.geolocation.getCurrentPosition(position => {
    observer.next(position);
    watchId = window.navigator.geolocation.watchPosition(position => {
      console.log('Looking for geolocation...');
      observer.next(position);
      console.log('Got for geolocation...');
    }, noop);
  }
  );
  return () => window.navigator.geolocation.clearWatch(watchId);
});

@Injectable({ providedIn: 'root' })
export class LocationService {

  private watchId?: number;
  private readonly _location = signal<Coordinate | undefined>(undefined);

  constructor() {
    this.watchId = window.navigator.geolocation.watchPosition(position => this._location.update(() => ({ lat: position.coords.latitude, lng: position.coords.longitude })));
  }

  getDistance(p1: Coordinate, p2: Coordinate) {
    const c = Math.cos;
    const p = 0.017453292519943295;    // Math.PI / 180

    const a = 0.5 - c((p2.lat - p1.lat) * p) / 2 + c(p1.lat * p) * c(p2.lat * p) * (1 - c((p2.lng - p1.lng) * p)) / 2;

    return Math.floor(12742000 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
  }

  get location(): Signal<Coordinate | undefined> {
    return computed(() => this._location());
  } 
}
