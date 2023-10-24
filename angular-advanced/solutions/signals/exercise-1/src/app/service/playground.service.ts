import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Playground } from '../model';

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  readonly playgrounds: Signal<Playground[]>;

  constructor(http: HttpClient) {
    this.playgrounds = toSignal(http.get<Playground[]>('assets/copenhagen.json'), {
      initialValue: JSON.parse(localStorage.getItem('playgrounds') || '[]')
    });
    effect(() => localStorage.setItem('playgrounds', JSON.stringify(this.playgrounds())));
  }

}
