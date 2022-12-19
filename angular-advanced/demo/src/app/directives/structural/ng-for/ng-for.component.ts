import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'loop-ng-for',
  templateUrl: './ng-for.component.html',
  styleUrls: ['./ng-for.component.scss']
})
export class NgForComponent {

  numberOfCards = this.createArray();
  trackByControl = new FormControl<boolean>(true);

  trackByIndexFn = (_: number, o: { index: number; }) => o.index;

  simulate() {
    this.numberOfCards = this.createArray();
  }

  createArray() {
    return Array.from({ length: 5000 }, (_, index) => ({ index }));
  }
}
