import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Playground } from 'src/app/shared';

@Component({
    selector: 'loop-playground-list-item-single-slot',
    template: `
    <li class="list-group-item d-flex">
      <div class="flex-item d-flex flex-column">
        <span class="flex-item">{{playground?.name}}</span>
      </div>
      <div>
        <div class="btn-group">
          <ng-content></ng-content>
        </div>
      </div>
    </li>
  `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class PlaygroundListItemSingleSlotComponent {

  @Input() playground: Playground | undefined;

}
