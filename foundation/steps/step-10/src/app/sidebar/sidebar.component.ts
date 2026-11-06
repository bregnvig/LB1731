import { Component, input, output } from '@angular/core';
import { Playground } from '../shared';

@Component({
  selector: 'app-sidebar',
  template: `
    <aside class="shadow" tabindex="1">
      <nav>
        <ul class="list-group">
          @for(playground of playgrounds(); track playground.id) {
            <li [class.active]="playground.id === selectedPlayground()?.id"  (click)="selected.emit(playground)" class="list-group-item list-group-item-action" role="button">
              <h4>{{playground.name}}</h4>
              <p class="m-0">{{playground.description}}</p>
            </li>
          }
        </ul>
      </nav>
    </aside>
  `,
})
export class SidebarComponent {
  playgrounds = input.required<Playground[]>();
  selected = output<Playground>();
  selectedPlayground = input<Playground | undefined>(undefined);
}
