import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'loop-locale',
  template: `
    <loop-default-locale/><br>
    <loop-da-locale/>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class LocaleComponent {

}
