import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import { StopWatchComponent } from '../stop-watch/stop-watch.component';

@Component({
  selector: 'loop-view-children',
  template: `
    <div class="row">
      <div class="col"><button class="btn btn-primary" (click)="addWatch()">Add stopwatch</button></div>
    </div>
    <div class="row" *ngFor="let no of watchNos">
      <div class="col">
        Stop watch {{no}} - <loop-stop-watch></loop-stop-watch>
      </div>
    </div>
  `,
})
export class ViewChildrenComponent implements AfterViewInit {

  watchNos: number[] = [0];
  @ViewChildren(StopWatchComponent) watches!: QueryList<StopWatchComponent>;

  ngAfterViewInit(): void {
    this.watches.forEach(w => w.start());
    this.watches.changes.subscribe(list => list.last.start());
  }

  addWatch() {
    this.watchNos.push(this.watchNos.length);
  }

}
