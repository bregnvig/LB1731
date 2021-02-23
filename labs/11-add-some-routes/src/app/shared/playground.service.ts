import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, publishLast, refCount } from 'rxjs/operators';
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

  getPlaygrounds(): Observable<Playground[]> {
    return this.request$;
  }

  find(id: string): Observable<Playground> {
    return this.getPlaygrounds().pipe(
      map(playgrounds => playgrounds.find(p => p.id === id))
    );
  }
}
