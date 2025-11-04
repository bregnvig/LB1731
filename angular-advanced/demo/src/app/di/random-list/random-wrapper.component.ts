import { Component } from '@angular/core';
import { RandomService } from '../service/random.service';

@Component({
  selector: 'loop-random-wrapper',
  template: `
    <p>
      I'm a wrapped random component<br>
      <ng-content/>
    </p>
  `,
  providers: [RandomService],
  standalone: false
})
export class RandomWrapperComponent {

}
