import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Driver } from './driver';

@Component({
  selector: 'app-driver-list-item',
  template: `
  @if(driver) {
    <li class="list-group-item">
      <img [src]="driver.photoURL?? 'user-regular.svg'" height="40" width="40" class="me-3"> 
      {{driver.firstName}} {{driver.lastName}}
    </li>
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DriverListItemComponent {
  @Input({ required: true }) driver?: Driver;
}