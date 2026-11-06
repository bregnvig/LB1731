import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RandomService } from '../service/random.service';

@Component({
  selector: 'loop-random-wrapper',
  template: `
    <figure>
      <figcaption>I'm a wrapped random component</figcaption>
      <ng-content/>
    </figure>
  `,
  styles: `
    figure { margin: 0; padding: .5rem; border: 2px dashed #8fb4d9; border-radius: 1rem; }
    figcaption { padding: .25rem .5rem .5rem; font-size: .8125rem; font-weight: 600; color: #0a6aa6; }
  `,
  providers: [RandomService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class RandomWrapperComponent {

}
