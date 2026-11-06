import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Playground } from '../model';

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  #http = inject(HttpClient);
  #altered$ = new BehaviorSubject<Playground[]>([]);

  playgrounds$: Observable<Playground[]> = combineLatest([
    this.#http.get<Playground[]>('assets/copenhagen.json'),
    this.#altered$,
  ]).pipe(
    map(([playgrounds, altered]) => playgrounds.map(p => altered.find(({ id }) => id === p.id) ?? p)),
    shareReplay(1),
  );

  update(playground: Playground) {
    console.log('Saving', playground);
    this.#altered$.next([...this.#altered$.value.filter(p => p.id !== playground.id), playground]);
  }

  getById(id: string): Observable<Playground | undefined> {
    return this.playgrounds$.pipe(
      map(playgrounds => playgrounds.find(playground => playground.id === id))
    );
  }
}
