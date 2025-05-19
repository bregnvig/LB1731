import { inject } from "@angular/core";
import { BehaviorSubject, catchError, Observable, of, ReplaySubject, shareReplay, switchMap, tap } from "rxjs";
import { Playground } from "../model";
import { PlaygroundService } from "../service";
import { withLength } from "../utils";

export class PlaygroundStore {

  #service = inject(PlaygroundService);
  #reload = new BehaviorSubject<void>(undefined);
  playgroundsError = new ReplaySubject<any>();
  updateError = new ReplaySubject<any>();
  deleteError = new ReplaySubject<any>();
  loading = new BehaviorSubject<boolean>(true);

  playgrounds = this.#reload.pipe(
    tap(() => this.loading.next(true)),
    switchMap(() => this.#service.list()),
    withLength(),
    catchError(error => {
      this.playgroundsError.next(error);
      return of([]);
    }),
    tap(() => this.loading.next(false)),
    shareReplay(1)
  );

  update(playground: Playground): Observable<void> {
    return this.#service.update(playground.id, playground).pipe(
      tap(() => {
        this.updateError.next(undefined);
        this.#reload.next();
      }),
      catchError(error => {
        this.updateError.next(error);
        throw error;
      }),
    );
  }

  delete(playgroundId: string): Observable<void> {
    return this.#service.delete(playgroundId).pipe(
      tap(() => {
        this.deleteError.next(undefined);
        this.#reload.next();
      }),
      catchError(error => {
        this.deleteError.next(error);
        throw error;
      }),
    );
  }
}