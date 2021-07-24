import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Playground } from 'src/app/shared';

@Component({
  selector: 'loop-playground-list-item',
  template: `
    <li class="list-group-item d-flex">
      <span class="flex-item">{{playground?.name}}</span>
      <div>
        <div class="btn-group">
          <ng-content></ng-content>
        </div>
      </div>
    </li>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaygroundListItemComponent {

  @Input() playground: Playground | undefined;

}
