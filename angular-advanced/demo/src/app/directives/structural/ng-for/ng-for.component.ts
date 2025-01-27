import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'loop-ng-for',
    templateUrl: './ng-for.component.html',
    styleUrls: ['./ng-for.component.scss'],
    standalone: false
})
export class NgForComponent {

  numberOfCards = this.createArray();
  trackByIndexFn = (_: number, item: { orderNo: number; }) => item.orderNo;
  trackByControl = new FormControl<boolean>(true);


  simulate() {
    this.numberOfCards = this.createArray();
  }

  createArray() {
    return Array.from({ length: 2500 }, (_, index) => ({ orderNo: index, timestamp: new Date() }));
  }
}
