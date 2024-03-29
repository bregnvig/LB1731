import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Playground } from '../model';

export const PLAYGROUND_SERVICE_URL = new InjectionToken<string>('Playground service URL', {
  providedIn: 'root',
  factory: () => 'assets/copenhagen.json'
});

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  playgrounds$: Observable<Playground[]>;

  constructor(http: HttpClient, @Inject(PLAYGROUND_SERVICE_URL) url: string) {
    console.log('Angular just created the PlaygroundService');
    this.playgrounds$ = http.get<Playground[]>(url).pipe(
      // shareReplay({ bufferSize: 1, refCount: false })
    );
  }

  getById(id: string): Observable<Playground | undefined> {
    return this.playgrounds$.pipe(
      map(playgrounds => playgrounds.find(p => p.id === id))
    );
  }
}
