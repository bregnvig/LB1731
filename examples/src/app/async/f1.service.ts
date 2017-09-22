import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Driver } from './driver';


@Injectable()
export class F1SimpleService {

  constructor(private http: Http) { }

  public getDrivers(): Observable<Response> {
    return this.http.get(`http://ergast.com/api/f1/2017/drivers.json`);
  }
}

@Injectable()
export class F1BetterService {

  private request$: Observable<Driver[]>

  constructor(http: Http) {
    this.request$ = http.get(`http://ergast.com/api/f1/2017/drivers.json`)
      .map(response => response.json().MRData.DriverTable.Drivers)
  }

  public getDrivers(): Observable<Driver[]> {
    return this.request$;
  }
}

@Injectable()
export class F1CachedService {

  private request$: Observable<Driver[]>

  constructor(http: Http) {
    this.request$ = http.get(`http://ergast.com/api/f1/2017/drivers.json`)
      .map(response => response.json().MRData.DriverTable.Drivers)
      .publishLast()
      .refCount();
  }

  public getDrivers(): Observable<Driver[]> {
    return this.request$;
  }
}

@Injectable()
export class F1AutoRefreshService {

  private request$: Observable<Driver[]>

  constructor(http: Http) {
    this.request$ = Observable.interval(10000)
    .startWith(null)
    .flatMap(() => http.get(`http://ergast.com/api/f1/2017/drivers.json`))
    .map(response => response.json().MRData.DriverTable.Drivers)
    .publishReplay(1)
    .refCount();
  }

  public getDrivers(): Observable<Driver[]> {
    return this.request$;
  }
}
