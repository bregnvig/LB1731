
import {interval,  Observable, of } from 'rxjs';

import {publishReplay, mergeMap, startWith, map, publishLast, refCount, switchMap, tap, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';


import { Driver } from './driver';
import {HttpClient} from '@angular/common/http';



@Injectable()
export class F1SimpleService {

  constructor(private http: HttpClient) { }

  public getDrivers(): Observable<any> {
    return this.http.get(`http://ergast.com/api/f1/2019/drivers.json`);
  }
}

@Injectable()
export class F1BetterService {

  private request$: Observable<Driver[]>;

  constructor(service: F1SimpleService) {
    this.request$ = service.getDrivers().pipe(
      map((response: any) => response.MRData.DriverTable.Drivers)
    )
  }

  public getDrivers(): Observable<Driver[]> {
    return this.request$;
  }
}

@Injectable()
export class F1CachedService {

  private request$: Observable<Driver[]>

  constructor(service: F1BetterService) {
    this.request$ = service.getDrivers().pipe(
      publishLast(),
      refCount(),
    );
  }

  public getDrivers(): Observable<Driver[]> {
    return this.request$;
  }
}

@Injectable()
export class F1AutoRefreshService {

  private request$: Observable<Driver[]>;

  constructor(service: F1BetterService) {
    this.request$ = interval(10000).pipe(
      startWith(null),
      switchMap(() => service.getDrivers()),
      publishReplay(1),
      refCount(),
    );
  }

  public getDrivers(): Observable<Driver[]> {
    return this.request$;
  }
}

@Injectable()
export class F1LocalStorageCache {
  private request$: Observable<Driver[]>;

  constructor(service: F1BetterService) {
    this.request$ = service.getDrivers().pipe(
      tap(drivers => localStorage.setItem('drivers', JSON.stringify(drivers))),
      catchError(error=> {
        console.log(error);
        return of<Driver[]>(JSON.parse(localStorage.getItem('drivers')) || [])
      })
    )
  }

  public getDrivers(): Observable<Driver[]> {
    return this.request$;
  }
}