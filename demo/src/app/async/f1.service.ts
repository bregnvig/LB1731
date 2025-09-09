
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Driver } from './driver';

interface OpenF1Driver {
  session_key: number;
  meeting_key: number;
  broadcast_name: string;
  country_code: string;
  first_name: string;
  full_name: string;
  headshot_url: string;
  last_name: string;
  driver_number: number;
  team_colour: string;
  team_name: string;
  name_acronym: string;
}

const mapper = (response: OpenF1Driver): Driver => ({
  driverNumber: response.driver_number.toString(),
  firstName: response.first_name ?? response.full_name,
  photoURL: response.headshot_url,
  lastName: response.last_name,
});

@Injectable({ providedIn: 'root' })
export class F1SimpleService {

  constructor(private http: HttpClient) { }

  getDrivers(): Observable<any> {
    return this.http.get(`https://api.openf1.org/v1/drivers?session_key=latest`);
  }
}

@Injectable({ providedIn: 'root' })
export class F1BetterService {

  #drivers$: Observable<Driver[]>;

  constructor(service: F1SimpleService) {
    this.#drivers$ = service.getDrivers().pipe(
      map((response: OpenF1Driver[]) => response.map(mapper)),
    );
  }

  getDrivers(): Observable<Driver[]> {
    return this.#drivers$;
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
      map((response: OpenF1Driver[]) => response.map(mapper)),
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