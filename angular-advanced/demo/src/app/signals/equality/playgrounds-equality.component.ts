import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Playground } from 'src/app/shared';

const initialPlaygrounds: Playground[] = [
  { id: '1', name: 'Playground 1', position: { lat: 52.520008, lng: 13.404954, } },
  { id: '2', name: 'Playground 2', position: { lat: 52.520008, lng: 13.404954, } },
  { id: '3', name: 'Playground 3', position: { lat: 52.520008, lng: 13.404954, } },
];

const modifiedPlaygrounds: Playground[] = [
  { id: '1', name: 'Playground 1', position: { lat: 52.520008, lng: 13.404954, } },
  { id: '2', name: 'Playground 2', position: { lat: 52.520008, lng: 13.404954, } },
  { id: '3', name: 'Playground 3', position: { lat: 52.520008, lng: 13.404954, } },
  { id: '4', name: 'Playground 4', position: { lat: 52.520008, lng: 13.404954, } },
];

const code = {
  initialPlaygrounds: `
    { id: '1', name: 'Playground 1', ... } },
    { id: '2', name: 'Playground 2', ... } },
    { id: '3', name: 'Playground 3', ... } },
  `,
  modifiedPlaygrounds: `
    { id: '1', name: 'Playground 1', ... } },
    { id: '2', name: 'Playground 2', ... } },
    { id: '3', name: 'Playground 3', ... } },
    { id: '4', name: 'Playground 4', ... } },
  `,
};

@Component({
  selector: 'loop-playgrounds-equality',
  standalone: true,
  imports: [NgFor, NgbAlert],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="d-flex">
    <div>
      <button type="button" class="btn btn-primary" (click)="setInitialPlaygrounds()">setInitialPlaygrounds</button>
      <ngb-alert type="info" class="mt-3" [dismissible]="false">
        <pre class="m-0">
          <code [innerHTML]="code.initialPlaygrounds"></code>
        </pre>
      </ngb-alert>
    </div>
    <div class="ms-5">
      <button type="button" class="btn btn-primary" (click)="setModifiedPlaygrounds()">setModifiedPlaygrounds</button>
      <ngb-alert type="info" class="mt-3" [dismissible]="false">
        <pre class="m-0">
          <code [innerHTML]="code.modifiedPlaygrounds"></code>
        </pre>
      </ngb-alert>
    </div>
  </div>
    <ul class="mt-3 list-group">
      <li *ngFor="let playground of playgrounds()" class="list-group-item">  
        {{playground.name}}
      </li>
    </ul>
  `,
})
export class PlaygroundsEqualityComponent {
  code = code;
  playgrounds = signal(initialPlaygrounds, { equal: (arr1, arr2) => JSON.stringify(arr1) === JSON.stringify(arr2) });

  constructor() {
    effect(() => {
      console.log('playgrounds changes', this.playgrounds());
    });
  }

  setInitialPlaygrounds(): void {
    this.playgrounds.set([...initialPlaygrounds]);
  }

  setModifiedPlaygrounds(): void {
    this.playgrounds.set([...modifiedPlaygrounds]);
  }

}
