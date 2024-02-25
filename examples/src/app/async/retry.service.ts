
import { fromEvent, Observable, throwError } from 'rxjs';

import { Injectable } from '@angular/core';
import { retry } from 'rxjs/operators';
import { Driver } from './driver';
import { F1BetterService } from './f1.service';

@Injectable({ providedIn: 'root' })
export class RetryService {

  readonly drivers$: Observable<Driver[]>;

  constructor(service: F1BetterService) {
    this.drivers$ = service.getDrivers().pipe(
      retry({
        delay: () => {
          if (!window.navigator.onLine) {
            return fromEvent(window, 'online');
          }
          return throwError(() => 'Could not fetch drivers');
        }
      })
    );
  }
}
