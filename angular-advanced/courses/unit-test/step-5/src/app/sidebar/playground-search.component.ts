import { Component, computed, input, signal } from '@angular/core';
import { filterPlaygrounds } from '../model/filter-playgrounds';
import { Playground } from '../model/playground';

@Component({
  selector: 'loop-playground-search',
  template: `
    <label for="playground-search" class="form-label">Søg efter legeplads</label>
    <input id="playground-search" #field type="text" class="form-control" [value]="query()" (input)="query.set(field.value)">
    <ul class="list-group mt-2">
      @for (playground of filteredPlaygrounds(); track playground.id) {
        <li class="list-group-item">{{ playground.name }}</li>
      } @empty {
        <li class="list-group-item">Ingen legepladser</li>
      }
    </ul>
  `,
})
export class PlaygroundSearchComponent {

  readonly playgrounds = input<Playground[]>([]);
  readonly query = signal('');
  readonly filteredPlaygrounds = computed(() => filterPlaygrounds(this.playgrounds(), this.query()));

}
