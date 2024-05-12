import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'loop-performance',
  template: `
<article>
  <div class="form-group row">
    <div class="col">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="selector" [formControl]="control">
        <label class="form-check-label" for="selector">Use new control flow</label>
      </div>
    </div>
  </div>
  {{control.value}}
  @if(!control.value) {
  <div>
    <p *ngFor="let item of numbers">
    {{ item | date: 'short' }}
    </p>
  </div>
  } @else {
    <div>
      @for( item of numbers; track $index) {
        <p>
        {{ item | date: 'short' }}
        </p>
      }
  </div>
  }
</article>    
`
})

export class PerformanceComponent implements OnInit {

  control = new FormControl(false);
  numbers = new Array(20000).fill(new Date());

  constructor() { }

  ngOnInit() { }
}