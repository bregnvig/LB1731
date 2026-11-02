import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'loop-performance',
    template: `
<article>
  <div class="d-flex align-items-center gap-4 mb-4">
    <div class="form-check form-switch m-0">
      <input class="form-check-input" type="checkbox" role="switch" id="selector" [formControl]="control">
      <label class="form-check-label" for="selector">Use new control flow</label>
    </div>
    <dl class="readout"><dt>control.value</dt><dd>{{control.value}}</dd></dl>
  </div>
  @if(!control.value) {
  <div class="dates">
    <p *ngFor="let item of numbers">
    {{ item | date: 'short' }}
    </p>
  </div>
  } @else {
    <div class="dates">
      @for( item of numbers; track $index) {
        <p>
        {{ item | date: 'short' }}
        </p>
      }
  </div>
  }
</article>    
`,
    styles: `
.dates {
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  background: #e8edf4;
  font: .8125rem "JetBrains Mono", monospace;
  color: #3c4b61;
}
p { margin: 0; }
`,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})

export class PerformanceComponent implements OnInit {

  control = new FormControl(false);
  numbers = new Array(20000).fill(new Date());

  constructor() { }

  ngOnInit() { }
}