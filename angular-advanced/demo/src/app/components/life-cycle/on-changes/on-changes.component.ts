import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'loop-on-changes',
  templateUrl: './on-changes.component.html',
  styleUrls: ['./on-changes.component.scss']
})
export class OnChangesComponent {

  control = new UntypedFormControl();
  items1: string[] = ['D', 'C', 'B', 'A'];
  items2: string[] = ['D', 'C', 'B', 'A'];

  add() {
    this.items1 = [...this.items1, this.control.value];
    this.items2.push(this.control.value);
  }

}
