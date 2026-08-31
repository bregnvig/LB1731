import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-directly-child',
  template: '<p>{{value1()}}</p> <p>{{value2()}}</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectlyChildComponent {
  value1 = input.required<string>();
  value2 = input<string>();
}

@Component({
  selector: 'app-directly',
  template: `
    <h2>Parent -> child directly</h2>
    <app-directly-child value1="My value" [value2]="fromProperty" />
    <input class="form-control" [(ngModel)]="fromProperty">
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DirectlyChildComponent, FormsModule]
})
export class DirectlyComponent {

  protected fromProperty = 'Dynamic property';

}

