import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-intercept-child',
  template: '<p>{{value}}</p>',
  standalone: true
})
export class InterceptChildComponent {
  private _value?: string;

  @Input({ required: true })
  set value(value: string | undefined) {
    this._value = value?.toUpperCase();
  }

  get value() {
    return this._value;
  }
}

@Component({
    selector: 'app-intercept',
    template: `
    <h2>Parent -> child intercept</h2>
    <app-intercept-child [value]="fromProperty"></app-intercept-child>
    <input class="form-control" [(ngModel)]="fromProperty">
  `,
    imports: [InterceptChildComponent, FormsModule]
})
export class InterceptComponent {

  fromProperty = 'From property';
}
