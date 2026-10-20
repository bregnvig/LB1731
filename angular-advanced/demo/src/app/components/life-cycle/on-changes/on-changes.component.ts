import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnChangeDisplayListComponent } from './on-change-display-list/on-change-display-list.component';

@Component({
    selector: 'loop-on-changes',
    template: `
      <div class="form-group row">
        <div class="col">
          <input id="text" type="text" placeholder="Skriv tekst" class="form-control" (keydown.enter)="add()" [formControl]="control">
        </div>
      </div>
      <article class="row">
        <section class="col-6">
          <loop-on-change-display-list [inputItems]="items1" />
        </section>
        <section class="col-6">
          <loop-on-change-display-list [inputItems]="items2" />
        </section>
      </article>
      `,
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
