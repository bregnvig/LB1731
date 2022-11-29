import { ChangeDetectionStrategy, Component, Input } from '@angular/core';


@Component({
  selector: 'app-directly-child',
  template: '<p>{{value1}}</p> <p>{{value2}}</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectlyChildComponent {
  @Input() value1?: string;
  @Input() value2?: string;

}

@Component({
  selector: 'app-directly',
  template: `
    <h2>Parent -> child directly</h2>
    <app-directly-child value1="My value" [value2]="fromProperty"></app-directly-child>
    <input class="form-control" [(ngModel)]="fromProperty">
  `,
})
export class DirectlyComponent {

  fromProperty = 'From property';

}

