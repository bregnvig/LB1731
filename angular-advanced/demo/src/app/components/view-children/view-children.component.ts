import { AfterViewInit, Component, effect, viewChildren, ChangeDetectionStrategy } from '@angular/core';
import { StopWatchComponent } from '../stop-watch/stop-watch.component';

@Component({
  selector: 'loop-view-children',
  template: `
    <section>
      <h5>Hardcoded</h5>
      <div class="tiles">
        <loop-stop-watch #watch1/>
        <loop-stop-watch #watch2/>
      </div>
    </section>
    <section>
      <h5>Dynamic</h5>
      <div class="tiles">
        @for (no of watchNos; track no) {
          <span>{{$index + 1}}. <loop-stop-watch/></span>
        }
        <button type="button" class="btn btn-outline-primary" (click)="watchNos.push(watchNos.length)">Add stopwatch</button>
      </div>
    </section>
    `,
  styles: `
    @import "src/scss/variables";

    section {
      margin-bottom: 2rem;
    }

    h5 {
      font-size: 1.25rem;
      font-stretch: 80%;
    }

    .tiles {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
      gap: 1rem;
    }

    // Each stopwatch is a tile; the hardcoded ones show their template ref
    .tiles > loop-stop-watch,
    .tiles > span {
      position: relative;
      display: flex;
      align-items: baseline;
      gap: .5rem;
      min-height: 7rem;
      padding: 2.5rem 1.25rem 1.25rem;
      border-radius: $border-radius-lg;
      background: $navy;
      color: $white;
      font-family: $font-family-monospace;
    }

    .tiles > loop-stop-watch::before {
      position: absolute;
      top: 1rem;
      left: 1.25rem;
      color: $signal;
      font-size: .875rem;
    }

    .tiles > loop-stop-watch:nth-child(1)::before { content: "#watch1"; }
    .tiles > loop-stop-watch:nth-child(2)::before { content: "#watch2"; }

    .tiles > span {
      flex-direction: column;
      justify-content: space-between;
      padding-top: 1rem;
      color: $signal;
      font-size: .875rem;
    }

    span loop-stop-watch {
      color: $white;
      font-family: $font-family-monospace;
      font-size: .9375rem;
    }

    .tiles > .btn {
      min-height: 7rem;
      border: 2px dashed $gray-400;
      border-radius: $border-radius-lg;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [StopWatchComponent]
})
export class ViewChildrenComponent implements AfterViewInit {

  watchNos: number[] = [0, 1, 2, 3, 4];
  watches = viewChildren<StopWatchComponent>('watch1, watch2');
  dynamicWatches = viewChildren(StopWatchComponent);

  constructor() {
    effect(() => {
      this.dynamicWatches()?.filter(({ isRunning }) => !isRunning).forEach(w => w.start());
    });

  }

  ngAfterViewInit(): void {
    console.log('Hardcoded', this.watches().length);
    console.log('No of stopwatches', this.dynamicWatches().length);
  }

  addWatch() {
    this.watchNos.push(this.watchNos.length);
  }

}
