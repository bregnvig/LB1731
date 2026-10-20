import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { PlaygroundService } from 'src/app/shared';
import { PlaygroundListItemSingleSlotComponent } from './playground-list-item/playground-list-item-single-slot.component';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'loop-single-slot-content-projection',
  template: `
    <ul class="list-group">
      @for (playground of playgrounds$ | async; track playground) {
        <loop-playground-list-item-single-slot [playground]="playground">
          <!-- <span>{{playground.description}}</span> -->
          <button class="btn btn-action btn-light btn-sm" [ngbPopover]="'Edit ' + playground.name">
            <fa-icon [icon]="['fas', 'pen']" />
          </button>
        </loop-playground-list-item-single-slot>
      }
    </ul>
    `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [PlaygroundListItemSingleSlotComponent, NgbPopover, FaIconComponent, AsyncPipe]
})
export class SingleSlotContentProjectionComponent {

  playgrounds$ = inject(PlaygroundService).playgrounds$;
}
