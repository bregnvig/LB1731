import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Playground, PlaygroundService } from 'src/app/shared';
import { PopoverService } from './popover.service';

@Component({
  selector: 'loop-ng-dynamic-component',
  template: `
    <div class="list-group">
      @for (playground of playgrounds(); track playground.id) {
        <button class="list-group-item list-group-item-action">
          <span container="body" [ngbPopover]="popoverContent">{{playground.name}}</span>
          <ng-template #popoverContent>
            <ng-template 
              [ngComponentOutlet]="component" 
              [ndcDynamicInputs]="{ playground }" 
              [ndcDynamicOutputs]="{
                vote: {
                  handler: $any(vote), args: ['$event', playground]
                }
              }"/>
          </ng-template>
        </button>
      }
    </div>
  `,
  standalone: false
})
export class NgDynamicComponentComponent {
  playgrounds = toSignal(inject(PlaygroundService).playgrounds$);
  component = inject(PopoverService).popoverComponent;
  vote(vote: 'up' | 'down', playground: Playground) {
    console.log(playground.name, vote);
  }
}
