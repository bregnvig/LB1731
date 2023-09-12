import { Injectable } from '@angular/core';
import { Observable, Subscriber, noop } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Coordinate } from './coordinate';

@Injectable()
export class LocationService {

    private location$: Observable<Coordinate>;

    constructor() {
        this.location$ = new Observable((subscriber: Subscriber<GeolocationPosition>) => {
            const watchId = window.navigator.geolocation.watchPosition(
                position => subscriber.next(position),
                error => noop,
            );
            return () => window.navigator.geolocation.clearWatch(watchId);
        }).pipe(
            map((position: GeolocationPosition) => ({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            })),
            shareReplay({ bufferSize: 1, refCount: true })
        );
    }

    get current(): Observable<Coordinate> {
        return this.location$;
    }

    getDistance(p1: Coordinate, p2: Coordinate) {

        const c = Math.cos;
        const p = 0.017453292519943295; // Math.PI / 180
        const a = 0.5 - c((p2.lat - p1.lat) * p) / 2 + c(p1.lat * p) * c(p2.lat * p) * (1 - c((p2.lng - p1.lng) * p)) / 2;

        return Math.floor(12742000 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    }

}
