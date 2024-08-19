import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-stopwatch',
  template: '{{seconds}}',
  standalone: true,
})
export class StopwatchComponent implements OnDestroy {

  seconds: number = 0;
  #intervalNo?: number;

  ngOnDestroy() {
    console.log('Destroyed');
    this.stop();
  }

  start() {
    this.#intervalNo = window.setInterval(() => {
      console.log(this.seconds);
      this.seconds += 1;
    }, 1000);
  }

  stop() {
    window.clearInterval(this.#intervalNo);
  }

  reset() {
    this.stop();
    this.seconds = 0;
  }

}
