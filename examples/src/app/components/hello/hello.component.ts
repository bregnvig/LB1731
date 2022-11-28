import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  template: `
    <h1>
      {{title}}
    </h1>
  `,
  styles: [
    `h1 {
      color: darkred !important;
    } `
  ]
})
export class HelloComponent {

  title = 'Hello world!';

}
