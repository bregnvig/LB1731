import { Component, DestroyRef, inject, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-stopwatch',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '{{seconds()}}',
})
export class StopwatchComponent {

  protected seconds = signal<number>(0);
  #intervalNo?: number;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      console.log('Destroyed');
      this.stop();
    });
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
