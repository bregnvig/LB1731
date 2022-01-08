import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'loop-ng-for',
  templateUrl: './ng-for.component.html',
  styleUrls: ['./ng-for.component.scss']
})
export class NgForComponent implements OnInit {

  numberOfCards = this.createArray();
  trackByControl = new FormControl(true);

  trackByIndexFn = (_: number, { index }: { index: number; }) => index;

  ngOnInit(): void {
  }

  simulate() {
    this.numberOfCards = this.createArray();
  }

  createArray() {
    return Array.from({ length: 5000 }, (_, index) => ({ index }));
  }
}
