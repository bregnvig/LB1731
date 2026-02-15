import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Driver } from './driver';

@Component({
  selector: 'app-driver-list-item',
  template: `
  @if(driver(); as driver) {

    <li class="list-group-item">
      <img [src]="driver.photoURL?? 'user-regular.svg'" height="40" width="40" class="me-3"> 
      {{driver.firstName}} {{driver.lastName}}
    </li>
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DriverListItemComponent {
  driver = input.required<Driver>();
}