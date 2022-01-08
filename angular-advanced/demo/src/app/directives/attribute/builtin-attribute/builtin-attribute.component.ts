import { Component, OnInit } from '@angular/core';

type LigthState = 'red' | 'yellow' | 'green';

@Component({
  selector: 'loop-builtin-attribute',
  templateUrl: './builtin-attribute.component.html',
  styleUrls: ['./builtin-attribute.component.scss']
})
export class BuiltinAttributeComponent implements OnInit {


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

  constructor() { }

  ngOnInit(): void {
    setInterval(() => (this.index = this.index + 1 === this.states.length ? 0 : this.index + 1), 1000);
  }

}
