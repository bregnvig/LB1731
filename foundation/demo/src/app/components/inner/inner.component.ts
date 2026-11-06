import { Component, DestroyRef, inject } from '@angular/core';

@Component({
  selector: 'app-inner',
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
