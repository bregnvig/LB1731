import { inject, Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, catchError, of, ReplaySubject, shareReplay, switchMap, tap } from 'rxjs';
import { Playground } from 'src/app/shared';
import { RxjsPlaygroundService } from './rxjs-playground.service';

@UntilDestroy()
@Injectable()
export class RxjsPlaygroundStore {

  #service = inject(RxjsPlaygroundService);
  #refresh = new BehaviorSubject<void>(undefined);

  readonly updateError = new BehaviorSubject<Playground | undefined>(undefined);
  readonly loading = new BehaviorSubject<boolean>(true);
  readonly error = new ReplaySubject<any>();
  readonly playgrounds = this.#refresh.pipe(
    tap(() => this.loading.next(true)),
    switchMap(() => this.#service.list()),
    catchError(error => {
      this.error.next(error);
      return of([]);
    }),
    tap(() => this.loading.next(false)),
    shareReplay(1)
  );


  update(playground: Playground) {
    this.#service.update(playground.id, playground).pipe(
      tap(() => this.#refresh.next()),
      catchError(error => {
        this.updateError.next(error);
        return of(null);
      })
    ).subscribe();
  }
}

