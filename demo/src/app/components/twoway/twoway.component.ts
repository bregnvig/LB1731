import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-twoway',
    template: `
    <h2>[(twoWay)]</h2>
    <h3>{{myTitle}}</h3>
    <input class="form-control" [(ngModel)]="myTitle" autofocus>
  `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule]
})
export class TwowayComponent {

  protected myTitle = 'Two way binding!!!';

}
