import { Component, OnDestroy } from '@angular/core';

type LigthState = 'red' | 'yellow' | 'green';

const code = `
<div class="d-flex flex-column">
  <div class="trafic-light">
    <div [class.active]="state === 'red'" class="light red"></div>
  </div>
  <div class="trafic-light">
    <div [class.active]="state === 'yellow'" class="light yellow"></div>
  </div>
  <div class="trafic-light">
    <div [class.active]="state === 'green'" class="light green"></div>
  </div>
</div>
`;

@Component({
  selector: 'loop-builtin-attribute',
  templateUrl: './builtin-attribute.component.html',
  styleUrls: ['./builtin-attribute.component.scss']
})
export class BuiltinAttributeComponent implements OnDestroy {

  code = code;
  get state(): LigthState {
    return this.states[this.index];
  };

  states: LigthState[] = [
    'red',
    'yellow',
    'green',
    'yellow',
  ];

  private index = 0;
  private _interval: any;

  constructor() {
    this._interval = setInterval(() => (this.index = this.index + 1 === this.states.length ? 0 : this.index + 1), 1000);
  }

  ngOnDestroy() {
    clearInterval(this._interval);
  }

}
