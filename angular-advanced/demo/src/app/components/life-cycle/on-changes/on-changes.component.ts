import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnChangeDisplayListComponent } from './on-change-display-list/on-change-display-list.component';

@Component({
    selector: 'loop-on-changes',
    templateUrl: './on-changes.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, ReactiveFormsModule, OnChangeDisplayListComponent]
})
export class OnChangesComponent {

  control = new FormControl<string>('', { nonNullable: true });
  items1: string[] = ['D', 'C', 'B', 'A'];
  items2: string[] = ['D', 'C', 'B', 'A'];

  add() {
    this.items1 = [...this.items1, this.control.value];
    this.items2.push(this.control.value);
  }

}
