import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { PlaygroundService } from 'src/app/shared';
import { PlaygroundListItemComponent } from './playground-list-item/playground-list-item.component';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'loop-content-projection',
  template: `
    <ul class="list-group">
      @for (playground of playgrounds$ | async; track playground) {
        <loop-playground-list-item [playground]="playground">
          <button class="btn btn-action btn-light btn-sm" [ngbPopover]="'Edit ' + playground.name">
            <fa-icon [icon]="['fas', 'pen']" />
          </button>
          <a class="btn btn-action btn-light btn-sm" [ngbPopover]="'Edit ' + playground.name">
            <fa-icon [icon]="['fas', 'user']" />
          </a>
          <!-- <span>{{playground.description}}</span> -->
      </loop-playground-list-item>
    }
    </ul>
    `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [PlaygroundListItemComponent, NgbPopover, FaIconComponent, AsyncPipe]
})
export class ContentProjectionComponent {

  playgrounds$ = inject(PlaygroundService).playgrounds$;
}
