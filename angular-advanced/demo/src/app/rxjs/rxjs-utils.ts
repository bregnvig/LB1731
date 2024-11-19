import { DestroyRef, Directive, inject, OnDestroy } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { fromEvent, merge, Observable, of, OperatorFunction, pipe, Subject, Subscriber, Subscription, throwError, UnaryFunction } from "rxjs";
import { catchError, filter, retry, shareReplay, switchMap, takeUntil, tap } from "rxjs/operators";

export function useCacheOnError(localStorageKey: string) {
  return function <T>(sourceObservable: Observable<T>): Observable<T> {
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
            switchMap(() => sourceObservable),
          ), subscriber);
          window.navigator.onLine && !localStorage.getItem(localStorageKey) && subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        }
      });
    };

    return new Observable(observer => {
      subscribeForCacheAndRetry(sourceObservable, observer);
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
export const retryWhenOnline = <T>() => pipe(
  retry<T>({
    delay: (error) => window.navigator.onLine
      ? throwError(() => error)
      : fromEvent(window, 'online')
  })
);
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

/**
 * Example using the `takeUntilDestroyed` method from rxjs-interop
 */
@Directive()
export abstract class AbstractSubscribeUnsubscribeInteropDirective {

  protected readonly subscriptions: Subscription[] = [];
  protected destroyRef = inject(DestroyRef);

  constructor() {
    inject(DestroyRef).onDestroy(() => (this.subscriptions || []).forEach(s => s.unsubscribe()));
  }


  takeUntilDestroyed<T>(): UnaryFunction<Observable<T>, Observable<T>> {
    // When using `takeUntilDestroyed` outside of an injection context, you need to pass the `DestroyRef` explicitly
    return takeUntilDestroyed(this.destroyRef);
  }

  // Example usage
  // interval(1000).pipe(this.takeUntilDestroyed()).subscribe(console.log);

}

export const useCacheAndRetryWhenOnline = (cacheKey: string) => <T>(source: Observable<T>): Observable<T> => {
  return source.pipe(
    catchError((error) => {
      if (!window.navigator.onLine && !localStorage.getItem(cacheKey)) {
        throw error;
      }
      // Needs better error handling if the cache is corrupted
      const cachedData = JSON.parse(localStorage.getItem(cacheKey)!) as T;
      return merge(of(cachedData), fromEvent(window, 'online').pipe(
        switchMap(() => useCacheAndRetryWhenOnline(cacheKey)(source))
      ));
    }),
    tap(data => localStorage.setItem(cacheKey, JSON.stringify(data))),
  );
};
