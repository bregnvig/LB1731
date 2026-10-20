import { Component, inject, inputBinding, outputBinding, viewChild, ViewContainerRef, ChangeDetectionStrategy } from '@angular/core';
import { Playground, PlaygroundService } from 'src/app/shared';
import { PopoverService } from './popover.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe } from '@angular/common';

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
  providers: [
  // {
  //   provide: PopoverService,
  //   useClass: FancyPopoverService,
  // }
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NgbPopover, AsyncPipe]
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
