import { Injectable, InjectionToken, signal } from '@angular/core';

export const RANDOM_FACTORY = new InjectionToken<RandomService>('RandomFactory');

export const factoryMethod = () => () => new RandomService();

@Injectable()
export class RandomService {

  #random = signal(Math.floor(Math.random() * 100));

  constructor() {
    window.setInterval(() => this.#random.set(Math.floor(Math.random() * 100)), 1000);
  }

  get random(): number {
    return this.#random();
  }
}
