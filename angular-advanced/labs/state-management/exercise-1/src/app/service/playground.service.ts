import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import * as localForage from "localforage";
import { from, Observable, of } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';
import { Playground } from '../model';


@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  #http = inject(HttpClient);

  list(): Observable<Playground[]> {
    return from(localForage.getItem<Playground[]>('playgrounds')).pipe(
      switchMap(playgrounds => playgrounds ? of(playgrounds) : this.#http.get<Playground[]>('assets/copenhagen.json')),
      switchMap(playgrounds => from(localForage.setItem('playgrounds', playgrounds)).pipe(
        map(() => playgrounds)
      )),
      delay(3000) // Simulate network delay
    );
  }

  get(id: string): Observable<Playground | undefined> {
    return this.list().pipe(
      map(playgrounds => playgrounds.find(playground => playground.id === id))
    );
  }

  create(playground: Playground): Observable<Playground> {
    return this.list().pipe(
      map(playgrounds => [...playgrounds, playground]),
      switchMap(playgrounds => from(localForage.setItem('playgrounds', playgrounds)).pipe(
        map(() => playgrounds)
      )),
      map(playgrounds => playgrounds.find(p => p.id === playground.id)!)
    );
  }

  update(id: string, playground: Partial<Playground>): Observable<Playground> {
    if (/[13579]$/.test(id)) {
      throw new Error(`${playground.name} is readonly and cannot be changed`);
    }
    return this.list().pipe(
      map(playgrounds => playgrounds.map(p => p.id === id ? { ...p, ...playground } : p)),
      switchMap(playgrounds => from(localForage.setItem('playgrounds', playgrounds)).pipe(
        map(() => playgrounds)
      )),
      map(playgrounds => playgrounds.find(p => p.id === id)!)
    );
  }

  delete(id: string): Observable<void> {
    return this.list().pipe(
      map(playgrounds => playgrounds.filter(p => p.id !== id)),
      switchMap(playgrounds => from(localForage.setItem('playgrounds', playgrounds)).pipe(
        map(() => playgrounds)
      )),
      map(() => undefined)
    );
  }

}
