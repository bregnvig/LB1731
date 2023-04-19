import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Playground } from '../model';

export const PLAYGROUND_URL = new InjectionToken<string>('Playground URL');

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  playgrounds$: Observable<Playground[]>;

  constructor(http: HttpClient, @Inject(PLAYGROUND_URL) url: string) {
    this.playgrounds$ = http.get<Playground[]>(url);
  }
}
