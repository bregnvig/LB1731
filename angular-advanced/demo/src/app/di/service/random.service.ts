import { Injectable, OnDestroy } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class RandomService implements OnDestroy {

  no: number = 0;

  private intervalId: number | undefined;

  constructor() {
    this.intervalId = window.setInterval(() => this.no = Math.floor(Math.random() * 1000), 1000);
  }

  ngOnDestroy() {
    console.log(`Service is being destroyed`);
    window.clearInterval(this.intervalId);
  }
}