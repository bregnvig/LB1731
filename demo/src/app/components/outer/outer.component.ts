import { Component } from '@angular/core';
import { InnerComponent } from '../inner/inner.component';


@Component({
    selector: 'app-outer',
    template: `
    <h2>Outer & inner components</h2>
    <p>I'm outer</p>
    <app-inner />
  `,
    imports: [InnerComponent]
})
export class OuterComponent {

}
