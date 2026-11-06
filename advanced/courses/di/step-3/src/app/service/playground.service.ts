import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Playground } from '../model';

export const PLAYGROUND_URL = new InjectionToken<string>('Playground URL');

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  readonly playgrounds$: Observable<Playground[]> = inject(HttpClient).get<Playground[]>(inject(PLAYGROUND_URL));

}
