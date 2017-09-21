import { Injectable, InjectionToken } from '@angular/core';

export const RANDOM_FACTORY = new InjectionToken<RandomService>('RandomFactory');

@Injectable()
export class RandomService {

  private _random: number;

  constructor() {
    window.setInterval(() => this._random = Math.floor(Math.random() * 100), 1000);
  }

  public get random(): number {
    return this._random;
  }
}
