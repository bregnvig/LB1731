import { Component } from '@angular/core';
import { PlaygroundService } from 'src/app/shared';

@Component({
  selector: 'loop-content-projection',
  template: `
    <ul class="list-group">
      <loop-playground-list-item *ngFor="let playground of playgrounds$ | async" [playground]="playground">
        <button class="btn btn-action btn-light btn-sm" [ngbPopover]="'Edit ' + playground.name">
          <fa-icon [icon]="['fas', 'pen']"></fa-icon>      
        </button>
      </loop-playground-list-item>
    </ul>
  `,
})
export class ContentProjectionComponent {

  playgrounds$ = this.service.playgrounds$;

  constructor(private service: PlaygroundService) { }



}
