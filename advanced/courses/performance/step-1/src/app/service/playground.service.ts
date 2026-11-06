import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { Playground } from '../model';
import { shareLatest } from '../utils/rxjs-utils';

@Injectable({
  providedIn: 'root',
})
export class PlaygroundService {

  private http = inject(HttpClient);

  playgrounds$: Observable<Playground[]> = timer(3000).pipe(
    switchMap(() => this.http.get<Playground[]>('/assets/copenhagen.json')),
    shareLatest(),
  );

  getById(id: string): Observable<Playground | undefined> {
    return this.playgrounds$.pipe(
      map(playgrounds => playgrounds.find(playground => playground.id === id)),
    );
  }
}
