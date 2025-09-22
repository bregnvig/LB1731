import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { noop } from 'rxjs';
import { Coordinate } from './coordinate';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  #current = signal<Coordinate | undefined>(undefined);
  current = this.#current.asReadonly();

  constructor() {
    const watchId = window.navigator.geolocation.watchPosition(
      position => this.#current.set({ lat: position.coords.latitude, lng: position.coords.longitude }),
      error => noop,
    );
    inject(DestroyRef).onDestroy(() => window.navigator.geolocation.clearWatch(watchId));
  }

  getDistance(p1: Coordinate, p2: Coordinate) {

    const c = Math.cos;
    const p = 0.017453292519943295; // Math.PI / 180
    const a = 0.5 - c((p2.lat - p1.lat) * p) / 2 + c(p1.lat * p) * c(p2.lat * p) * (1 - c((p2.lng - p1.lng) * p)) / 2;

    return Math.floor(12742000 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
  }

}
