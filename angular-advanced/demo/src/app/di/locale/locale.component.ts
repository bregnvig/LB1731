import { Component } from '@angular/core';

@Component({
  selector: 'loop-locale',
  template: `
    <loop-default-locale/><br>
    <loop-da-locale/>
  `,
  standalone: false
})
export class LocaleComponent {

}
