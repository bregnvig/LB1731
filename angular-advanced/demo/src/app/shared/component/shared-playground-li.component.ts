import { Component, input } from "@angular/core";
import { Playground } from "../model";

@Component({
  selector: 'loop-shared-playground-li',
  template: `
    <strong>{{ playground().name }}</strong> - {{ playground().addressDescription || 'No address available' }}
    <br>
    <small>Coordinates: {{ playground().position.lat }}, {{ playground().position.lng }}</small><br>
    <em>{{ playground().description || 'No description available' }}</em>
  `,
  host: {
    class: 'list-group-item'
  }
})
export class SharedPlaygroundLiComponent {
  playground = input.required<Playground>();
}