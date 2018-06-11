
import {throwError as observableThrowError, fromEvent as observableFromEvent, Observable} from 'rxjs';

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
          return observableFromEvent(window, 'online');
        }
        return observableThrowError('Could not fetch drivers');
      })
    )
  }
}
