
import {throwError, fromEvent, Observable} from 'rxjs';

import {retryWhen} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Driver} from './driver';
import {F1BetterService} from './f1.service';

@Injectable()
export class RetryService {

  public readonly drivers$: Observable<Driver[]>;

  constructor(service: F1BetterService) {
    this.drivers$ = service.getDrivers().pipe(
      retryWhen(err => {
        if (!window.navigator.onLine) {
          return fromEvent(window, 'online');
        }
        return throwError('Could not fetch drivers');
      })
    )
  }
}
