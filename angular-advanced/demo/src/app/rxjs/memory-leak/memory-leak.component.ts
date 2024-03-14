import { Component } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

let creation = 0;

@Component({
  selector: 'loop-memory-leak',
  template: `
    <button type="button" class="btn btn-primary" (click)="go()">Start</button>
    <ul>
      @for (no of nos; track no) {
        <li>{{no}}</li>
      }
    </ul>
    <!-- <ul>
    <li *ngFor="let no of nos$ | async">{{no}}</li>
    </ul> -->
    `,
})
export class MemoryLeakComponent {

  nos: number[] = [];
  instanceNo = creation++;

  nos$: Observable<number[]> | undefined;

  go() {
    this.nos$ = interval(1).pipe(scan((acc, no) => {
      acc.push(no);
      return acc;
    }, [] as number[]));
    interval(1).subscribe(no => {
      console.log(`Creation ${this.instanceNo}`, no);
      this.nos.push(no);
    });
  }
}
