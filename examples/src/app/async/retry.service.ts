import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Driver} from "./driver";
import {F1BetterService} from "./f1.service";

@Injectable()
export class RetryService {

  public readonly drivers$: Observable<Driver[]>;

  constructor(service: F1BetterService) {
    this.drivers$ = service.getDrivers()
      .retryWhen(err => {
        if (!window.navigator.onLine) {
          return Observable.fromEvent(window, 'online');
        }
        return Observable.throw('Could not fetch drivers');
      })
  }
}
