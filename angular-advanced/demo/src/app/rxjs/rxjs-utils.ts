import { Directive, OnDestroy } from "@angular/core";
import { Observable, OperatorFunction, Subject, Subscriber, Subscription, UnaryFunction, fromEvent, pipe } from "rxjs";
import { filter, shareReplay, switchMap, takeUntil, tap } from "rxjs/operators";

export function useCacheOnError(localStorageKey: string) {
  return function <T>(source: Observable<T>): Observable<T> {
    let innerSubscription: Subscription;
    const subscribeForCacheAndRetry = function (innerSource: Observable<T>, subscriber: Subscriber<T>) {
      innerSubscription?.unsubscribe(); // If we are here again, lets unsubscribe
      innerSubscription = innerSource.subscribe({
        next(value) {
          localStorage.setItem(localStorageKey, JSON.stringify(value));
          subscriber.next(value);
        },
        error(error) {
          console.log('Problems fetching data', error);
          localStorage.getItem(localStorageKey) && subscriber.next(JSON.parse(localStorage.getItem(localStorageKey)!));
          !window.navigator.onLine && subscribeForCacheAndRetry(fromEvent(window, 'online').pipe(
            switchMap(() => source),
          ), subscriber);
          window.navigator.onLine && !localStorage.getItem(localStorageKey) && subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        }
      });
    };

    return new Observable(subscriber => {
      subscribeForCacheAndRetry(source, subscriber);
      return () => {
        console.log(`Unsubscribing from source`);
        innerSubscription?.unsubscribe();
      };
    });
  };
}

export function debug<T>(tag: string) {
  return tap<T>({
    next(value) {
      console.log(`%c[${tag}: Next]`, "background: #009688; color: #fff; padding: 3px; font-size: 9px;", value);
    },
    error(error) {
      console.log(`%c[${tag}: Error]`, "background: #E91E63; color: #fff; padding: 3px; font-size: 9px;", error);
    },
    complete() {
      console.log(`%c[${tag}]: Complete`, "background: #00BCD4; color: #fff; padding: 3px; font-size: 9px;");
    },
  });
}
type nullish = null | undefined;
export const shareLatest = <T>() => pipe(shareReplay<T>({ bufferSize: 1, refCount: true }));
export const truthy = <T>() => pipe(filter(x => !!x) as OperatorFunction<T | nullish | '', T>);
export const falsy = <T>() => pipe(filter(x => !x) as OperatorFunction<T | nullish, T extends number ? (nullish | 0) : T extends string ? (nullish | '') : nullish>);
export const truthyWithGuard = <T>() => pipe(filter(x => !!x) as OperatorFunction<T | undefined | null | '', T>);


@Directive()
export abstract class AbstractSubscribeUnsubscribeDirective implements OnDestroy {

  protected readonly subscriptions: Subscription[] = [];

  protected destroyed$ = new Subject<boolean>();

  constructor() {
    console.log('Created', this['constructor'].name);
  }

  ngOnDestroy() {
    console.log('Destroyed', this['constructor'].name);

    this.destroyed$.next(true);
    (this.subscriptions || []).forEach(s => s.unsubscribe());
  }

  takeUntilDestroyed<T>(): UnaryFunction<Observable<T>, Observable<T>> {
    return takeUntil<T>(this.destroyed$);
  }

}
