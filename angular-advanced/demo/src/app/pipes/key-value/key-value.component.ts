import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'loop-key-value',
  template: `
    <article class="row g-4">
      <section class="col-md-6">
        <h5>My object</h5>
        <dl class="readout mt-3">
          @for (entry of myObject | keyvalue; track entry) {
            <dt>{{entry.key | uppercase}}</dt>
            <dd>{{entry.value}}</dd>
          }
        </dl>
      </section>
      <section class="col-md-6">
        <h5>My map</h5>
        <dl class="readout mt-3">
          @for (entry of myMap | keyvalue; track entry) {
            <dt>{{entry.key | uppercase}}</dt>
            <dd>{{entry.value}}</dd>
          }
        </dl>
      </section>
    </article>
`,
  styles: `
    .readout { gap: 0 1.5rem; padding: .5rem 1.25rem; }
    dt, dd { padding: .625rem 0; }
    dt:not(:first-of-type), dt:not(:first-of-type) + dd { border-top: 1px solid #d3dbe6; }
    dt { font: 600 1rem var(--bs-font-monospace); color: #0b7fc4; }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class KeyValueComponent {

  myObject = {
    b: 'B is the second',
    a: 'A is the first letter',
  };

  myMap = new Map<string, string>([
    ['c', 'C is the third'],
    ['a', 'A is the first letter'],
    ['b', 'B is the second'],
  ]);


  originalOrder = () => 0;
}
