import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import { StopWatchComponent } from '../stop-watch/stop-watch.component';

@Component({
  selector: 'loop-view-children',
  templateUrl: './view-children.component.html',
  styleUrls: ['./view-children.component.scss']
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
