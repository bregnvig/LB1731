import { Component, inject, inputBinding, outputBinding, viewChild, ViewContainerRef } from '@angular/core';
import { Playground, PlaygroundService } from 'src/app/shared';
import { PopoverService } from './popover.service';

@Component({
  selector: 'loop-dynamic-view-container-ref-component',
  template: `
    <div class="list-group list-group-action">
      @for (playground of playgrounds$ | async; track playground) {
        <button 
          class="list-group-item list-group-item-action">
          <span container="body" [ngbPopover]="popoverContent" (shown)="createPopover(playground)">{{playground.name}}</span>
          <ng-template #popoverContent>
            <ng-container #dynamicContainer/>
          </ng-template>
        </button>
      }
    </div>
    `,
  standalone: false
})
export class DynamicViewContainerRefComponentComponent {

  #popover = inject(PopoverService).popoverComponent;
  playgrounds$ = inject(PlaygroundService).playgrounds$;
  container = viewChild('dynamicContainer', { read: ViewContainerRef });

  createPopover(playground: Playground) {
    const container = this.container();
    if (container) {
      container.createComponent(this.#popover, {
        bindings: [
          inputBinding('playground', () => playground),
          outputBinding('modernVote', (vote: 'up' | 'down') => {
            console.log(playground.name, vote);
          })
        ]
      });
    }
  }

}
