import { Component, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-stopwatch',
  template: '{{seconds()}}',
})
export class StopwatchComponent implements OnDestroy {

  protected seconds = signal<number>(0);
  #intervalNo?: number;

  ngOnDestroy() {
    console.log('Destroyed');
    this.stop();
  }

  start() {
    this.#intervalNo = window.setInterval(() => {
      console.log(this.seconds());
      this.seconds.update(s => s + 1);
    }, 1000);
  }

  stop() {
    window.clearInterval(this.#intervalNo);
  }

  reset() {
    this.stop();
    this.seconds.set(0);
  }

}
