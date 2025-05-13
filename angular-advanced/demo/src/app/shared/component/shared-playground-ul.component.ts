import { Component, effect, input } from "@angular/core";
import { Playground } from "../model";
import { SharedPlaygroundLiComponent } from "./shared-playground-li.component";

@Component({
  selector: 'loop-shared-playground-ul',
  imports: [SharedPlaygroundLiComponent],
  template: `
      <ul class="list-group">
        @for (playground of playgrounds(); track playground.id) {
          <loop-shared-playground-li [playground]="playground"/>
        }
      </ul>
    `,
  host: {
    class: 'list-group-item'
  }
})
export class SharedPlaygroundUlComponent {
  playgrounds = input.required<Playground[]>();

  constructor() {
    effect(() => console.log('SharedPlaygroundUlComponent', this.playgrounds()));
  }

}