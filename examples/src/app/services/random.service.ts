import { LoggerService } from './logger.service';
import { Injectable, InjectionToken } from '@angular/core';

export const RANDOM_FACTORY = new InjectionToken<RandomService>('RandomFactory');

export const factoryMethod = () => () => new RandomService();

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

@Injectable()
export class RandomLoggerService {

  private _random: number;

  constructor(logger: LoggerService) {
    window.setInterval(() => {
      this._random = Math.floor(Math.random() * 100);
      logger.log('Generated new random number');
    }, 1000);
  }

  public get random(): number {
    return this._random;
  }
}
