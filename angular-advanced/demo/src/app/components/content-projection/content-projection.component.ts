import { Component, inject } from '@angular/core';
import { PlaygroundService } from 'src/app/shared';

@Component({
  selector: 'loop-content-projection',
  template: `
    <ul class="list-group">
      @for (playground of playgrounds$ | async; track playground) {
        <loop-playground-list-item [playground]="playground">
          <button class="btn btn-action btn-light btn-sm" [ngbPopover]="'Edit ' + playground.name">
            <fa-icon [icon]="['fas', 'pen']"></fa-icon>
          </button>
          <a class="btn btn-action btn-light btn-sm" [ngbPopover]="'Edit ' + playground.name">
            <fa-icon [icon]="['fas', 'user']"></fa-icon>
          </a>
          <!-- <span>{{playground.description}}</span> -->
      </loop-playground-list-item>
    }
    </ul>
    `,
  standalone: false
})
export class ContentProjectionComponent {

  playgrounds$ = inject(PlaygroundService).playgrounds$;
}
