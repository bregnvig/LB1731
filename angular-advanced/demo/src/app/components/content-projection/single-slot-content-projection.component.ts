import { Component, inject } from '@angular/core';
import { PlaygroundService } from 'src/app/shared';

@Component({
  selector: 'loop-single-slot-content-projection',
  template: `
    <ul class="list-group">
      @for (playground of playgrounds$ | async; track playground) {
        <loop-playground-list-item-single-slot [playground]="playground">
          <!-- <span>{{playground.description}}</span> -->
          <button class="btn btn-action btn-light btn-sm" [ngbPopover]="'Edit ' + playground.name">
            <fa-icon [icon]="['fas', 'pen']"></fa-icon>
          </button>
        </loop-playground-list-item-single-slot>
      }
    </ul>
    `,
})
export class SingleSlotContentProjectionComponent {

  playgrounds$ = inject(PlaygroundService).playgrounds$;
}
