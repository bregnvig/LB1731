import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Playground } from '../model';

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  playgrounds$: Observable<Playground[]>;

  private altered$ = new BehaviorSubject<Playground[]>([]);

  constructor(http: HttpClient) {

    this.playgrounds$ = combineLatest([
      http.get<Playground[]>('assets/copenhagen.json'),
      this.altered$,
    ]).pipe(
      map(([playgrounds, altered]) => playgrounds.map(p => altered.find(({ id }) => id === p.id) ?? p)),
      shareReplay(1),
    );
  }

  update(playground: Playground) {
    console.log('Saving', playground);
    this.altered$.next([...this.altered$.value.filter(p => p.id !== playground.id), playground]);
  }
}
