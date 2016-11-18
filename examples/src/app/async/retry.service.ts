import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Driver } from './driver';
@Injectable()
export class RetryService {

  public readonly drivers$: Observable<Driver[]>;

  constructor(http: Http) {
    this.drivers$ = http.get(`http://ergast.com/api/f1/2016/drivers.json`)
      .retryWhen(err => {
        if (!window.navigator.onLine) {
          return Observable.fromEvent(window, 'online');
        }
        return Observable.throw('Could not fetch drivers');
      })
      .map(response => response.json().MRData.DriverTable.Drivers);
  }
}
