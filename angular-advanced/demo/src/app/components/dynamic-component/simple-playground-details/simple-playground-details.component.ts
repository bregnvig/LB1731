import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Playground } from 'src/app/shared';

@Component({
  selector: 'loop-simple-playground-details',
  template: `
    <p>{{playground?.description}}, {{playground?.addressDescription}}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimplePlaygroundDetailsComponent {

  @Input() playground: Playground | undefined;
}
