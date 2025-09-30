import { Component, inject } from '@angular/core';
import { PlaygroundService } from 'src/app/shared';
import { PopoverService } from './popover.service';

@Component({
  selector: 'loop-dynamic-component',
  template: `
    <div class="list-group list-group-action">
      @for (playground of playgrounds$ | async; track playground) {
        <button 
          class="list-group-item list-group-item-action">
          <span container="body" [ngbPopover]="popoverContent">{{playground.name}}</span>
          <ng-template #popoverContent>
            <ng-container *ngComponentOutlet="popover; inputs:{playground}" />
          </ng-template>
      </button>
      }
    </div>
    `,
  standalone: false
})
export class DynamicComponentComponent {

  playgrounds$ = inject(PlaygroundService).playgrounds$;
  popover = inject(PopoverService).popoverComponent;
}
