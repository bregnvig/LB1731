import { Component } from '@angular/core';

@Component({
  selector: 'app-twoway',
  template: `
    <h2>[(twoWay)]</h2>
    <h3>{{myTitle}}</h3>
    <input class="form-control" [(ngModel)]="myTitle" autofocus>
  `,
})
export class TwowayComponent {

  myTitle = 'Two way binding!!!';

}
