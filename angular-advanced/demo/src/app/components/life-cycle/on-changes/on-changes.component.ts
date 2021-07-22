import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'loop-on-changes',
  templateUrl: './on-changes.component.html',
  styleUrls: ['./on-changes.component.scss']
})
export class OnChangesComponent implements OnInit {

  control = new FormControl();
  items1: string[] = ['D', 'C', 'B', 'A'];
  items2: string[] = ['D', 'C', 'B', 'A'];

  constructor() { }

  ngOnInit(): void {
  }

  add() {
    this.items1 = [...this.items1, this.control.value];
    this.items2.push(this.control.value);
  }

}
