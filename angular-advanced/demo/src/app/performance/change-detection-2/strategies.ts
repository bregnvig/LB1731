import { Injectable, signal } from '@angular/core';

export type Strategy = 'Eager' | 'OnPush';

/** Which strategy each node uses. Kept here, so toggling a branch does not reset its leaves. */
@Injectable()
export class Strategies {
  #strategies = signal<Record<string, Strategy>>({
    A: 'Eager',
    B: 'Eager', B1: 'Eager', B2: 'OnPush',
    C: 'OnPush', C1: 'Eager', C2: 'OnPush',
  });

  of(name: string) {
    return this.#strategies()[name];
  }

  toggle(name: string) {
    this.#strategies.update(all => ({ ...all, [name]: all[name] === 'Eager' ? 'OnPush' : 'Eager' }));
  }

  setAll(strategy: Strategy) {
    this.#strategies.update(all => Object.fromEntries(Object.keys(all).map(name => [name, strategy])));
  }
}
