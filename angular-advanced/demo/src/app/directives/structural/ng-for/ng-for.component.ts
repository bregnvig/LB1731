import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'loop-ng-for',
  templateUrl: './ng-for.component.html',
  styleUrls: ['./ng-for.component.scss']
})
export class NgForComponent implements OnInit {

  numberOfCards = this.createArray();
  trackByControl = new UntypedFormControl(true);

  trackByIndexFn = (_: number, o: { index: number; }) => o.index;

  ngOnInit(): void {
  }

  simulate() {
    this.numberOfCards = this.createArray();
  }

  createArray() {
    return Array.from({ length: 5000 }, (_, index) => ({ index }));
  }
}
