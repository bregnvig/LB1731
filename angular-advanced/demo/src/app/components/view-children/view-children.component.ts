import { AfterViewInit, Component, effect, viewChildren } from '@angular/core';
import { StopWatchComponent } from '../stop-watch/stop-watch.component';

@Component({
  selector: 'loop-view-children',
  template: `
    <div class="row flex-wrap">
      <div class="mt-3 col-12">
        <h5>Hardcoded</h5>
        <loop-stop-watch #watch1/>
        <loop-stop-watch #watch2/>
      </div>
      <div class="mt-3 col-12 d-flex flex-column">
        <h5>Dynamic</h5>
        @for (no of watchNos; track no) {
          <span>{{$index + 1}}. <loop-stop-watch/></span>
        }
        <div class="mt-3">
          <button type="button" class="btn btn-outline-primary" (click)="watchNos.push(watchNos.length)">Add stopwatch</button>
        </div>
      </div>
    </div>
    `,
  standalone: false
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
    this.watches().forEach(w => w.start());

    // Note: viewChildren signals automatically update, no need for changes subscription
  }

  addWatch() {
    this.watchNos.push(this.watchNos.length);
  }

}
