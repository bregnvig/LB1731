import { Component, OnInit, inject, signal } from '@angular/core';
import { Driver } from '../driver';
import { DriverListItemComponent } from "../driver-list-item.component";
import { F1LocalStorageCache } from '../f1.service';

@Component({
  selector: 'app-catch-error',
  template: `
    <h2>Cached async service</h2>
    <div>
      <button class="btn btn-primary" (click)="addSubscribtion()">Add subscribe</button>
    </div>
    <ul class="mt-3 list-group">
      @for(driver of drivers(); track driver.driverNumber) {
        <app-driver-list-item [driver]="driver"/>
      }
    </ul>
  `,
  imports: [DriverListItemComponent]
})
export class CatchErrorComponent implements OnInit {
  protected drivers = signal<Driver[] | undefined>(undefined);
  #service = inject(F1LocalStorageCache);

  constructor() {
  }

  ngOnInit() {
    this.#service.getDrivers().subscribe(drivers => {
      this.drivers.set(drivers);
    });
  }

  protected addSubscribtion() {
    this.#service.getDrivers().subscribe(drivers => console.log(`Found ${drivers.length} drivers`));
  }

}
