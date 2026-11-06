import { DestroyRef, inject, Injectable } from '@angular/core';

@Injectable()
export class RouteProvidedService {

  time = new Date();
  intervalId = setInterval(() => this.time = new Date(), 1000);

  constructor() {
    console.log('Route provided service created');
    inject(DestroyRef).onDestroy(() => {
      console.log('Route provided service destroyed');
      clearInterval(this.intervalId);
    });
  }

}