import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {catchError, publishLast, refCount} from 'rxjs/operators';




import { Playground } from './playground';

@Injectable()
export class PlaygroundService {

  private request$: Observable<Playground[]>;

  constructor(http: HttpClient) {
    this.request$ = http.get<Playground[]>('assets/copenhagen.json').pipe(
      publishLast(),
      refCount()
    );
  }

  public getPlaygrounds(): Observable<Playground[]> {
    return this.request$;
  }
}
