import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Playground } from './playground';

@Injectable()
export class PlaygroundService {

  private request$: Observable<Playground[]>;

  constructor(http: HttpClient) {
    this.request$ = http.get<Playground[]>('assets/copenhagen.json').pipe(
      shareReplay(1),
    );
  }

  public getPlaygrounds(): Observable<Playground[]> {
    return this.request$;
  }
}
