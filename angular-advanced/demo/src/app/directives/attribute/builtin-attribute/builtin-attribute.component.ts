import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { AbstractSubscribeUnsubscribeDirective } from 'src/app/rxjs/rxjs-utils';

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
export class BuiltinAttributeComponent extends AbstractSubscribeUnsubscribeDirective implements OnInit {

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

  ngOnInit() {
    interval(1000).pipe(this.takeUntilDestroyed()).subscribe(() => (this.index = this.index + 1 === this.states.length ? 0 : this.index + 1));
  }
}
