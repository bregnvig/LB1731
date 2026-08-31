import { Component, DestroyRef, inject, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-inner',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
  <p>
    I'm inner
  </p>
 `,
})
export class InnerComponent {

  constructor() {
    console.log('Constructed');
    inject(DestroyRef).onDestroy(() => console.log('Destroyed!!'));
  }

}
