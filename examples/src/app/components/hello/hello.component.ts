import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  template: `
    <h2>
      {{title}}
    </h2>
  `,
  styles: [
    `h2 {
      color: darkred !important;
    } `
  ]
})
export class HelloComponent {

  title = 'Hello world!';

}
