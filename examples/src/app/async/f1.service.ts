
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Driver } from './driver';

@Injectable({ providedIn: 'root' })
export class F1SimpleService {

  constructor(private http: HttpClient) { }

  getDrivers(): Observable<any> {
    return this.http.get(`http://ergast.com/api/f1/2022/drivers.json`);
  }
}

@Injectable({ providedIn: 'root' })
export class F1BetterService {

  private drivers$: Observable<Driver[]>;

  constructor(service: F1SimpleService) {
    this.drivers$ = service.getDrivers().pipe(
      map(response => response.MRData.DriverTable.Drivers),
    );
  }

  getDrivers(): Observable<Driver[]> {
    return this.drivers$;
  }
}

@Injectable({ providedIn: 'root' })
export class F1CachedService {

  private drivers$: Observable<Driver[]>;

  // We could of course have used the F1BetterService
  // This is just to show that we can have multiple 
  // operators in a pipe
  constructor(service: F1SimpleService) {
    this.drivers$ = service.getDrivers().pipe(
      map(response => response.MRData.DriverTable.Drivers),
      shareReplay(1),
    );
  }

  getDrivers(): Observable<Driver[]> {
    return this.drivers$;
  }
}

@Injectable({ providedIn: 'root' })
export class F1AutoRefreshService {

  private drivers$: Observable<Driver[]>;

  constructor(service: F1BetterService) {
    this.drivers$ = timer(0, 10000).pipe(
      switchMap(() => service.getDrivers()),
      shareReplay(1),
    );
  }

  getDrivers(): Observable<Driver[]> {
    return this.drivers$;
  }
}

@Injectable({ providedIn: 'root' })
export class F1LocalStorageCache {
  private request$: Observable<Driver[]>;

  constructor(service: F1BetterService) {
    this.request$ = service.getDrivers().pipe(
      tap(drivers => localStorage.setItem('drivers', JSON.stringify(drivers))),
      catchError(error => {
        console.log(error);
        return of(JSON.parse(localStorage.getItem('drivers') || '[]') as Driver[]);
      })
    );
  }

  getDrivers(): Observable<Driver[]> {
    return this.request$;
  }
}