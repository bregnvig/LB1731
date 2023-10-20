import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Playground } from '../model';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  readonly originalPlaygounds = toSignal(inject(HttpClient).get<Playground[]>('assets/copenhagen.json'), { initialValue: [] });
  readonly alteredPlaygounds = signal<Playground[]>([]);
  readonly playgrounds = computed(() => this.originalPlaygounds().map(p => this.alteredPlaygounds().find(({ id }) => id === p.id) ?? p));

  update(playground: Playground) {
    console.log('Saving', playground);
    this.alteredPlaygounds.update(alteredPlaygounds => [...alteredPlaygounds.filter(p => p.id !== playground.id), playground]);
  }

  getById(id: string): Playground | undefined {
    return this.playgrounds().find(playground => playground.id === id);
  }
}
