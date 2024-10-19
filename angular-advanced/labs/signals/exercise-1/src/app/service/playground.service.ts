import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { Playground } from '../model';

@Injectable({
  providedIn: 'root',
})
export class PlaygroundService {

  playgrounds$: Observable<Playground[]>;

  constructor(http: HttpClient) {
    this.playgrounds$ = timer(3000).pipe(
      switchMap(() => http.get<Playground[]>('/assets/copenhagen.json')),
    );

    // this.playgrounds$ = http.get<Playground[]>('/assets/copenhagen.json');

  }

  getById(id: string): Observable<Playground | undefined> {
    return this.playgrounds$.pipe(
      map(playgrounds => playgrounds.find(playground => playground.id === id)),
    );
  }
}
