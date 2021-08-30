import { Component } from '@angular/core';
import { RandomService } from '../service/random.service';

@Component({
  selector: 'loop-random-wrapper',
  template: `
    <p>
      I'm a wrapped random component
      <ng-content></ng-content>
    </p>
  `,
  providers: [RandomService],
})
export class RandomWrapperComponent {

}
