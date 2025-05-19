import { inject, Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, catchError, of, ReplaySubject, shareReplay, switchMap, tap } from 'rxjs';
import { Playground } from 'src/app/shared';
import { RxjsPlaygroundService } from './rxjs-playground.service';

@UntilDestroy()
@Injectable()
export class RxjsPlaygroundStore {

  #service = inject(RxjsPlaygroundService);
  #reload = new BehaviorSubject<void>(undefined);

  #update = new BehaviorSubject<Playground | undefined>(undefined);
  #updateSubscription = this.#update.pipe(
    switchMap(playground => {
      if (!playground) {
        return of(null);
      }
      return this.#service.update(playground.id, playground).pipe(
        tap(() => this.#reload.next()),
        catchError(error => {
          this.updateError.next(error);
          return of(null);
        })
      );
    }),
    untilDestroyed(this),
  ).subscribe();

  readonly updateError = new ReplaySubject<any>();

  readonly playgroundsLoading = new BehaviorSubject<boolean>(true);
  readonly playgroundsError = new ReplaySubject<any>();
  readonly playgrounds = this.#reload.pipe(
    tap(() => this.playgroundsLoading.next(true)),
    switchMap(() => this.#service.list()),
    catchError(error => {
      this.playgroundsError.next(error);
      return of([]);
    }),
    tap(() => this.playgroundsLoading.next(false)),
    shareReplay(1)
  );


  update(playground: Playground) {
    this.#update.next(playground);
  }
}

