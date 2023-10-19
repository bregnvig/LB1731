import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Playground } from '../model';

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  readonly playgrounds: Signal<Playground[]>;
  readonly playground: Signal<Playground | undefined>;

  #id = signal<string | undefined>(undefined);

  constructor(http: HttpClient) {
    this.playgrounds = toSignal(http.get<Playground[]>('assets/copenhagen.json'), { initialValue: [] });
    this.playground = computed(() => {
      return this.playgrounds().find(({ id }) => this.#id() === id);
    });
  }

  setSelectedId(id: string) {
    this.#id.set(id);
  }
}
