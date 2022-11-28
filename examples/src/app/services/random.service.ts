import { Injectable, InjectionToken } from '@angular/core';
import { LoggerService } from './logger.service';

export const RANDOM_FACTORY = new InjectionToken<RandomService>('RandomFactory');

export const factoryMethod = () => () => new RandomService();

@Injectable()
export class RandomService {

  private _random: number = Math.floor(Math.random() * 100);

  constructor() {
    window.setInterval(() => this._random = Math.floor(Math.random() * 100), 1000);
  }

  get random(): number {
    return this._random;
  }
}

@Injectable()
export class RandomLoggerService {

  private _random = Math.floor(Math.random() * 100);

  constructor(logger: LoggerService) {
    window.setInterval(() => {
      this._random = Math.floor(Math.random() * 100);
      logger.log('Generated new random number', this._random);
    }, 1000);
  }

  get random(): number {
    return this._random;
  }
}
