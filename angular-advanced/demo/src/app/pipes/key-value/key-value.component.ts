import { Component } from '@angular/core';

@Component({
  selector: 'loop-key-value',
  template: `
    <article>
      <h5>My object</h5>
      <div class="row mt-3">
        <div class="col">
          @for (entry of myObject | keyvalue; track entry) {
            <p>
              {{entry.key | uppercase}}: {{entry.value}}
            </p>
          }
        </div>
      </div>
      <h5>My map</h5>
      <div class="row mt-3">
        <div class="col">
          @for (entry of myMap | keyvalue; track entry) {
            <p>
              {{entry.key | uppercase}}: {{entry.value}}
            </p>
          }
        </div>
      </div>
    </article>
`,
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
