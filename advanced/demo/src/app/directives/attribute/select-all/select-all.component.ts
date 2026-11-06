import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'loop-select-all',
    templateUrl: './select-all.component.html',
    styleUrls: ['./select-all.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SelectAllComponent {

  text = 'lorem ipsum dolor';
  hasFocus = false;

}
