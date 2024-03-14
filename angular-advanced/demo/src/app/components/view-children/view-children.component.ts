import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import { StopWatchComponent } from '../stop-watch/stop-watch.component';

@Component({
  selector: 'loop-view-children',
  template: `
    <div class="row flex-wrap">
      <div class="mt-3 col-12">
        <h5>Hardcoded</h5>
        <loop-stop-watch #watch1></loop-stop-watch>
        <loop-stop-watch #watch2></loop-stop-watch>
      </div>
      <div class="mt-3 col-12 d-flex flex-column">
        <h5>Dynamic</h5>
        @for (no of watchNos; track no; let i = $index) {
          <span>{{i + 1}}. <loop-stop-watch></loop-stop-watch></span>
        }
        <div class="mt-3">
          <button type="button" class="btn btn-outline-primary" (click)="watchNos.push(watchNos.length)">Add stopwatch</button>
        </div>
      </div>
    </div>
    `,
})
export class ViewChildrenComponent implements AfterViewInit {

  watchNos: number[] = [0, 1, 2, 3, 4];
  @ViewChildren('watch1, watch2') watches!: QueryList<StopWatchComponent>;
  @ViewChildren(StopWatchComponent) dynamicWatches!: QueryList<StopWatchComponent>;

  ngAfterViewInit(): void {
    this.watches.forEach(w => w.start());
    this.dynamicWatches.forEach(w => w.start());
    console.log('No of stopwatches', this.dynamicWatches.length);

    this.dynamicWatches.changes.subscribe(list => list.last.start());
  }

  addWatch() {
    this.watchNos.push(this.watchNos.length);
  }

}
