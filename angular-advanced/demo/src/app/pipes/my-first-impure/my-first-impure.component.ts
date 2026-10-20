import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'loop-my-first-impure',
    templateUrl: './my-first-impure.component.html',
    styleUrls: ['./my-first-impure.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MyFirstImpureComponent {

  myFirst = 'pipe';

  usingAMethod(value: string) {
    console.log('In a method');
    return `Using method ${value}`;
  }

  noop() {
  }
}
