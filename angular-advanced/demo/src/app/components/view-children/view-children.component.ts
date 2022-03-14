import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import { StopWatchComponent } from '../stop-watch/stop-watch.component';

@Component({
  selector: 'loop-view-children',
  template: `
    <!-- <div class="row">
      <div class="col"><button class="btn btn-primary" (click)="addWatch()">Add stopwatch</button></div>
    </div> -->
    <div class="row flex-wrap">
      <div class="mt-3 col-12">
        <h5>Harcoded</h5>
        <loop-stop-watch #watch1></loop-stop-watch>
        <loop-stop-watch #watch2></loop-stop-watch>
      </div>
      <!-- <div class="mt-3 col-12">
        <h5>Dynamic</h5>
        <loop-stop-watch *ngFor="let no of watchNos"></loop-stop-watch>
      </div> -->
    </div>
  `,
})
export class ViewChildrenComponent implements AfterViewInit {

  watchNos: number[] = [0, 1, 2, 3, 4];
  @ViewChildren('watch1, watch2') watches!: QueryList<StopWatchComponent>;
  // @ViewChildren(StopWatchComponent) watches!: QueryList<StopWatchComponent>;

  ngAfterViewInit(): void {
    this.watches.forEach(w => w.start());
    this.watches.changes.subscribe(list => list.last.start());
  }

  addWatch() {
    this.watchNos.push(this.watchNos.length);
  }

}
