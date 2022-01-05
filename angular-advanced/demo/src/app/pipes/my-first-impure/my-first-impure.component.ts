import { Component } from '@angular/core';

@Component({
  selector: 'loop-my-first-impure',
  templateUrl: './my-first-impure.component.html',
  styleUrls: ['./my-first-impure.component.scss']
})
export class MyFirstImpureComponent {

  myFirst = 'pipe';

  noop() {
  }
}
