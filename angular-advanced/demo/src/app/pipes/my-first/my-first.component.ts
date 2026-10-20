import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'loop-my-first',
  templateUrl: './my-first.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class MyFirstComponent {

  myInput = 'pipe';

}
