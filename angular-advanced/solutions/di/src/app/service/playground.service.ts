import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Playground } from '../model';
import { shareLatest } from '../utils/rxjs-utils';

export const PLAYGROUNDS_URL = new InjectionToken<string>('PlaygroundsURL', {
  providedIn: 'root',
  factory: () => 'assets/copenhagen.json'
});

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  playgrounds$: Observable<Playground[]>;

  constructor(http: HttpClient, @Inject(PLAYGROUNDS_URL) url: string) {
    this.playgrounds$ = http.get<Playground[]>(url).pipe(
      shareLatest()
    );
  }
}
