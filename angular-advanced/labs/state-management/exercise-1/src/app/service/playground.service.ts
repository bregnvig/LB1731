import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as localForage from "localforage";
import { Observable, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Playground } from '../model';

localForage.config({ driver: localForage.INDEXEDDB, name: 'state-management', version: 1.0, size: 4980736, storeName: 'state-management-store' });

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  constructor(private http: HttpClient) {
  }

  list(): Observable<Playground[]> {
    return from(localForage.getItem<Playground[]>('playgrounds')).pipe(
      switchMap(playgrounds => playgrounds ? of(playgrounds) : this.http.get<Playground[]>('assets/copenhagen.json')),
      switchMap(playgrounds => from(localForage.setItem('playgrounds', playgrounds)).pipe(
        map(() => playgrounds)
      )),
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
