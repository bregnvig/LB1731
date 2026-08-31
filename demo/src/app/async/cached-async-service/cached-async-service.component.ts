import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';

import { Driver } from '../driver';
import { DriverListItemComponent } from "../driver-list-item.component";
import { F1CachedService } from '../f1.service';

@Component({
  selector: 'app-cached-async-service',
  template: `
    <h2>Cached async service</h2>
    <div>
      <button class="btn btn-primary fixed-size" (click)="addSubscription()">Add subscribe</button>
    </div>
    <ul class="mt-3 list-group">
      @for(driver of drivers(); track driver.driverNumber) {
        <app-driver-list-item [driver]="driver"/>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DriverListItemComponent]
})
export class CachedAsyncServiceComponent {

  protected drivers = signal<Driver[] | undefined>(undefined);
  #service = inject(F1CachedService);

  constructor() {
    this.#service.getDrivers().subscribe(drivers => this.drivers.set(drivers));
  }

  protected addSubscription() {
    this.#service.getDrivers().subscribe(drivers => console.log(`Found ${drivers.length} drivers`));
  }
}
