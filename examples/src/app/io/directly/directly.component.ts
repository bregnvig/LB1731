import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-directly-child',
    template: '<p>{{value1}}</p> <p>{{value2}}</p>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
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
    standalone: true,
    imports: [DirectlyChildComponent, FormsModule],
})
export class DirectlyComponent {

  fromProperty = 'Dynamic property';

}

