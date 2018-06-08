import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {catchError, publishLast, refCount, map} from 'rxjs/operators';




import { Playground } from './playground';

@Injectable()
export class PlaygroundService {

  private request$: Observable<Playground[]>;

  constructor(http: HttpClient) {
    this.request$ = http.get<Playground[]>('assets/copenhagen.json').pipe(
      catchError((error: Response) => {
        console.error('Unable to fetch playgrounds', error.statusText);
        return of([]);
      }),
      publishLast(),
      refCount()
    );
  }

  public getPlaygrounds(): Observable<Playground[]> {
    return this.request$;
  }

  public find(id: string): Observable<Playground> {
    return this.getPlaygrounds().pipe(map(playgrounds => playgrounds.find(playground => playground.id === id)));
  }
}
