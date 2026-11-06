import { inject, Injectable } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, catchError, Observable, of, ReplaySubject, shareReplay, switchMap, tap } from 'rxjs';
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
    tap(() => this.error.next(undefined)),
    catchError(error => { this.error.next(error); return of([]) }),
    tap(() => this.loading.next(false)),
    shareReplay(1),
  );

  update(playground: Playground): Observable<void> {
    return this.#service.update(playground).pipe(
      catchError(error => { this.updateError.next(error); throw error; }),
      tap(() => { this.#refresh.next(); this.updateError.next(undefined); }),
    );
  }
}

