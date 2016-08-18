import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/share';

import { Coordinate } from './coordinate';

@Injectable()
export class LocationService {

  private locationStream: Observable<Coordinate>;

  constructor() {
    this.locationStream = Observable
      .create(observer => {
        const watchId = window.navigator.geolocation.watchPosition(position => {
          observer.next(position)
        }, error => observer.error(error));
        return () => window.navigator.geolocation.clearWatch(watchId);
      })
      .map((position: Position) => {
        return {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      })
      .publishReplay(1)
      .refCount();
  }

  public get current(): Observable<Coordinate> {
    return this.locationStream;
  }

}
