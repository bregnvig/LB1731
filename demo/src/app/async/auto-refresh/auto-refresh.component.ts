import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Driver } from '../driver';
import { DriverListItemComponent } from "../driver-list-item.component";
import { F1AutoRefreshService } from '../f1.service';


@Component({
  selector: 'app-auto-refresh',
  template: `
    <h2>Auto refresh service - with memory leak</h2>
    <div>
      <button class="btn btn-primary pane fixed-size" (click)="addSubscribtion()">Add subscribe</button>
    </div>
    <ul class="mt-3 list-group">
      @for(driver of drivers(); track driver.driverNumber) {
        <app-driver-list-item [driver]="driver"/>
      }
    </ul>
  `,
  imports: [DriverListItemComponent]
})
export class AutoRefreshComponent {

  protected drivers = signal<Driver[] | undefined>(undefined);
  #service = inject(F1AutoRefreshService);

  constructor() {
    // Should unsubscribe this, ellse we'll have a memory leak'
    this.#service.getDrivers().pipe(
      takeUntilDestroyed()
    ).subscribe(drivers => {
      console.log('Updating drivers array with new drivers');
      this.drivers.set(drivers);
    });
  }

  protected addSubscribtion() {
    this.#service.getDrivers().subscribe(drivers => console.log(`Found ${drivers.length} drivers`));
  }

}
