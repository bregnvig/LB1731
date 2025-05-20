import { inject, Injectable, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, of, shareReplay, switchMap, tap } from 'rxjs';
import { Playground } from 'src/app/shared';
import { SignalPlaygroundService } from './signal-playground.service';

@Injectable()
export class SignalPlaygroundStore {

  #service = inject(SignalPlaygroundService);
  #refresh = new BehaviorSubject<void>(undefined);
  #updatePayload = new BehaviorSubject<Playground | undefined>(undefined);
  #updatePlayground = toSignal(this.#updatePayload.pipe(
    switchMap(playground => !playground ? of(null) : this.#service.update(playground).pipe(
      tap(() => this.#refresh.next()),
      catchError(error => {
        this.updateError.set(error);
        return of(null);
      })
    )
    ),
  ))
  updateError = signal<any>(undefined);

  playgroundsError = signal<any>(undefined);
  playgroundsLoading = signal<boolean>(false);
  playgrounds: Signal<Playground[]> = toSignal(
    this.#refresh.pipe(
      tap(() => this.playgroundsLoading.set(true)),
      switchMap(() => this.#service.list()),
      shareReplay(1),
      tap(() => this.playgroundsLoading.set(false)),
      catchError(error => {
        this.playgroundsError.set(error);
        throw error;
      }),
    ),
    { initialValue: [] }
  );

  update(playground: Playground) {
    this.#updatePayload.next(playground);
  }


}

