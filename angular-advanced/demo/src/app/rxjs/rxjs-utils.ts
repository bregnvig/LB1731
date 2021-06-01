import { Directive, OnDestroy } from "@angular/core";
import { fromEvent, Observable, pipe, Subject, Subscriber, Subscription, UnaryFunction } from "rxjs";
import { switchMapTo, takeUntil, tap } from "rxjs/operators";

export function useCacheOnError(key: string) {
  return function <T>(source: Observable<T>): Observable<T> {
    let innerSub: Subscription;
    const subscribeForCacheAndRetry = function (innerSource: Observable<T>, subscriber: Subscriber<T>) {
      innerSub?.unsubscribe();
      innerSub = innerSource.subscribe({
        next(value) {
          localStorage.setItem(key, JSON.stringify(value));
          subscriber.next(value);
        },
        error(error) {
          console.log('Problems fetching data', error);
          localStorage.getItem(key) && subscriber.next(JSON.parse(localStorage.getItem(key)!));
          !window.navigator.onLine && subscribeForCacheAndRetry(fromEvent(window, 'online').pipe(
            switchMapTo(source),
          ), subscriber);
          window.navigator.onLine && !localStorage.getItem(key) && subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        }
      });
    }

    return new Observable(subscriber => {
      subscribeForCacheAndRetry(source, subscriber)
      return () => {
        console.log(`Unsubscribing from source`);
        innerSub?.unsubscribe()
      };
    })
  }
}

export function debug<T>(tag: string) {
  return tap<T>({
    next(value) {
      console.log(`%c[${tag}: Next]`, "background: #009688; color: #fff; padding: 3px; font-size: 9px;", value)
    },
    error(error) {
      console.log(`%c[${tag}: Error]`, "background: #E91E63; color: #fff; padding: 3px; font-size: 9px;", error)
    },
    complete() {
      console.log(`%c[${tag}]: Complete`, "background: #00BCD4; color: #fff; padding: 3px; font-size: 9px;")
    },
  })
}

@Directive()
export abstract class AbstractSubscribeUnsubscribeDirective implements OnDestroy {

  protected readonly subscriptions: Subscription[] = [];

  protected destroyed$ = new Subject<boolean>();

  ngOnDestroy() {
    this.destroyed$.next(true);
    (this.subscriptions || []).forEach(s => s.unsubscribe);
  }

  takeUntilDestroyed<T>(): UnaryFunction<Observable<T>, Observable<T>> {
    return pipe(takeUntil<T>(this.destroyed$));
  }

}
