import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, afterNextRender, viewChild } from '@angular/core';
import { StopWatchComponent } from '../stop-watch/stop-watch.component';

@Component({
  selector: 'loop-view-child',
  template: `
    <section class="demo-surface">
      <div class="watch">
        <loop-stop-watch />
      </div>
      <div class="controls">
        <button class="btn btn-light" [disabled]="running" (click)="start()">Start</button>
        <button class="btn btn-light" [disabled]="!running" (click)="stop()">Stop</button>
      </div>
    </section>
    `,
  styles: `
    @import "src/scss/variables";

    section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      padding: 3.5rem 2rem;
    }

    // The queried child, on its own white card
    .watch {
      display: grid;
      place-items: center;
      width: 16rem;
      aspect-ratio: 1;
      border-radius: $border-radius-xl;
      background: $white;
      color: $navy;
      box-shadow: 0 24px 48px -16px rgba($navy, .55);
    }

    loop-stop-watch {
      flex-direction: column;
      align-items: center;
      font-size: 1.5rem;
    }

    .controls {
      display: flex;
      gap: .75rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [StopWatchComponent]
})
export class ViewChildComponent implements OnInit, AfterViewInit {

  stopWatch = viewChild.required(StopWatchComponent);
  running = true;

  constructor() {
    // this.start();
    afterNextRender(() => this.stopWatch()?.start());
  }

  ngOnInit() {
    // this.start();
  }

  ngAfterViewInit() {
    // this.start();
  }

  start() {
    this.stopWatch().start();
    this.running = true;
  }
  stop() {
    this.stopWatch().stop();
    this.running = false;
  }
}
