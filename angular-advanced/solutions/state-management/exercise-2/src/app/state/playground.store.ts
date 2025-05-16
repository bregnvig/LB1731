import { inject } from "@angular/core";
import { BehaviorSubject, catchError, Observable, of, ReplaySubject, shareReplay, switchMap, tap } from "rxjs";
import { Playground } from "../model";
import { PlaygroundService } from "../service";
import { withLength } from "../utils";

export class PlaygroundStore {

  #service = inject(PlaygroundService);
  #reload = new BehaviorSubject<void>(undefined);
  error = new ReplaySubject<any>();
  loading = new BehaviorSubject<boolean>(true);

  playgrounds = this.#reload.pipe(
    switchMap(() => this.#service.list()),
    withLength(),
    catchError(error => {
      this.error.next(error);
      return of([]);
    }),
    tap(() => this.loading.next(false)),
    shareReplay(1)
  );

  update(playground: Playground): Observable<Playground> {
    return this.#service.update(playground.id, playground).pipe(
      tap(() => {
        this.#reload.next();
        this.loading.next(true);
      })
    );
  }

  delete(playgroundId: string): Observable<void> {
    return this.#service.delete(playgroundId).pipe(
      tap(() => {
        this.#reload.next();
        this.loading.next(true);
      })
    );
  }
}