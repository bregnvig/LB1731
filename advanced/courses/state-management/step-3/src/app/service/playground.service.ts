import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import * as localForage from 'localforage';
import { defer, from, Observable, of } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { Playground } from '../model';
import { getNetworkErrorsState } from '../network-errors.component';


@Injectable({
  providedIn: 'root',
})
export class PlaygroundService {

  #http = inject(HttpClient);
  #list = defer(() => localForage.getItem<Playground[]>('playgrounds')).pipe(
    switchMap(playgrounds => playgrounds ? of(playgrounds) : this.#http.get<Playground[]>('assets/aarhus.json')),
    switchMap(playgrounds => from(localForage.setItem('playgrounds', playgrounds)).pipe(
      map(() => playgrounds),
    )));

  list(): Observable<Playground[]> {
    return this.#list.pipe(
      delay(1000), // Simulate network delay
      tap(() => {
        if (getNetworkErrorsState().read) throw new Error('Network read error');
      }),
    );
  }

  update(id: string, playground: Partial<Playground>): Observable<void> {
    return this.#list.pipe(
      map(playgrounds => playgrounds.map(p => p.id === id ? { ...p, ...playground } : p)),
      tap(() => {
        if (getNetworkErrorsState().update) throw new Error('Network update error');
      }),
      switchMap(playgrounds => from(localForage.setItem('playgrounds', playgrounds))),
      map(() => undefined)
    );
  }

  delete(id: string): Observable<void> {
    return this.#list.pipe(
      map(playgrounds => playgrounds.filter(p => p.id !== id)),
      tap(() => {
        if (getNetworkErrorsState().delete) throw new Error('Network delete error');
      }),
      switchMap(playgrounds => from(localForage.setItem('playgrounds', playgrounds)).pipe(
        map(() => playgrounds),
      )),
      map(() => undefined),
    );
  }

}
