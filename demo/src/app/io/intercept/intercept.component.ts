import { booleanAttribute, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-intercept-child',
  template: `
  <p>{{value()}}</p>
  <p>Is nice - {{isNice()}}</p>
  `,
})
export class InterceptChildComponent {

  value = input.required<string, string>({
    transform: value => value.toUpperCase()
  });

  isNice = input<boolean, boolean | string>(true, {
    transform: booleanAttribute
  });

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

  protected fromProperty = 'From property';
}
