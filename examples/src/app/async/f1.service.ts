
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable, of } from 'rxjs';
import { catchError, map, publishLast, publishReplay, refCount, startWith, switchMap, tap } from 'rxjs/operators';
import { Driver } from './driver';






@Injectable()
export class F1SimpleService {

  constructor(private http: HttpClient) { }

  getDrivers(): Observable<any> {
    return this.http.get(`http://ergast.com/api/f1/2020/drivers.json`);
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

  getDrivers(): Observable<Driver[]> {
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

  getDrivers(): Observable<Driver[]> {
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

  getDrivers(): Observable<Driver[]> {
    return this.request$;
  }
}

@Injectable()
export class F1LocalStorageCache {
  private request$: Observable<Driver[]>;

  constructor(service: F1BetterService) {
    this.request$ = service.getDrivers().pipe(
      tap(drivers => localStorage.setItem('drivers', JSON.stringify(drivers))),
      catchError(error => {
        console.log(error);
        return of<Driver[]>(JSON.parse(localStorage.getItem('drivers')) || [])
      })
    )
  }

  getDrivers(): Observable<Driver[]> {
    return this.request$;
  }
}