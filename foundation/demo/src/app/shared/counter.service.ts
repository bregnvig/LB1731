import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  #count = 0;

  increment(): void {
    this.#count += 1;
  }

  get count(): number {
    return this.#count;
  }
}
