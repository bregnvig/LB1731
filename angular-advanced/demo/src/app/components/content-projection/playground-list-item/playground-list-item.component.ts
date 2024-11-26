import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Playground } from 'src/app/shared';

@Component({
  selector: 'loop-playground-list-item',
  template: `
    <li class="list-group-item d-flex">
      <div class="flex-item d-flex flex-column">
        <span class="flex-item">{{playground?.name}}</span>
        <!-- <small><ng-content/></small> -->
      </div>
      <div>
        <div class="btn-group">
          <ng-content select="button, a" />
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
