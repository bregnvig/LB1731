import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, ReplaySubject, shareReplay, switchMap, tap } from 'rxjs';
import { Playground } from 'src/app/shared';
import { RxjsPlaygroundService } from './rxjs-playground.service';

@Injectable()
export class RxjsPlaygroundStore {

  #service = inject(RxjsPlaygroundService);
  #reload = new BehaviorSubject<void>(undefined);
  error = new ReplaySubject<any>();
  loading = new BehaviorSubject<boolean>(true);

  playgrounds = this.#reload.pipe(
    switchMap(() => this.#service.list()),
    catchError(error => {
      this.error.next(error);
      return of([]);
    }),
    tap(() => this.loading.next(false)),
    shareReplay(1)
  );

  update(playground: Playground): Observable<Playground> {
    console.log('Updating playground:', playground.id);
    return this.#service.update(playground.id, playground).pipe(
      tap(() => {
        this.#reload.next();
        this.loading.next(true);
      })
    );
  }
} 

