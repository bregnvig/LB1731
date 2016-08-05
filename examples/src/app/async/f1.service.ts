import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/publishLast';

import { Driver } from './driver';


@Injectable()
export class F1SimpleService {

  constructor(private http: Http) { }

  public getDrivers(): Observable<Response> {
    return this.http.get(`http://ergast.com/api/f1/2016/drivers.json`);
  }
}

@Injectable()
export class F1BetterService {

  private requestStream: Observable<Driver[]>

  constructor(http: Http) {
    this.requestStream = http.get(`http://ergast.com/api/f1/2016/drivers.json`)
      .map(response => response.json().MRData.DriverTable.Drivers)
  }

  public getDrivers(): Observable<Driver[]> {
    return this.requestStream;
  }
}

@Injectable()
export class F1CachedService {

  private requestStream: Observable<Driver[]>

  constructor(http: Http) {
    let streamNo = 1;
    this.requestStream = http.get(`http://ergast.com/api/f1/2016/drivers.json`)
      .map(response => response.json().MRData.DriverTable.Drivers)
      .publishLast()
      .refCount();
  }

  public getDrivers(): Observable<Driver[]> {
    return this.requestStream;
  }
}
