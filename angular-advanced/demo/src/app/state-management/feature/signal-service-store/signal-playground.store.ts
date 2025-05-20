import { inject, Injectable, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, firstValueFrom, of, shareReplay, switchMap, tap } from 'rxjs';
import { Playground } from 'src/app/shared';
import { SignalPlaygroundService } from './signal-playground.service';

@Injectable()
export class SignalPlaygroundStore {
  
  #service = inject(SignalPlaygroundService);
  #refresh = new BehaviorSubject<void>(undefined);
  error = signal<any>(undefined);
  updateError = signal<any>(undefined);
  loading = signal<boolean>(false);
  
  playgrounds: Signal<Playground[]> = toSignal(this.#refresh.pipe(
    tap(() => this.loading.set(true)),
    switchMap(() => this.#service.list()),
    tap(() => this.error.set(undefined)),
    catchError(error => { this.error.set(error); return of([]) }),
    tap(() => this.loading.set(false)),
    shareReplay(1),
  ), { initialValue: [] });
  
  update(playground: Playground): Promise<void> {
    return firstValueFrom(this.#service.update(playground).pipe(
      tap(() => this.#refresh.next()),
      catchError(error => { this.updateError.set(error); throw error; })
    ))
  }
}
