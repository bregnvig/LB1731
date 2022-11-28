import { Component } from '@angular/core';


@Component({
  selector: 'app-outer',
  template: `
    <h2>Outer & inner components</h2>
    <p>I'm outer</p>
    <app-inner></app-inner>  
  `,
})
export class OuterComponent {

}
