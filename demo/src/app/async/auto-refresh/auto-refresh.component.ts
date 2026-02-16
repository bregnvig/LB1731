import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Driver } from '../driver';
import { DriverListItemComponent } from "../driver-list-item.component";
import { F1AutoRefreshService } from '../f1.service';


@Component({
  selector: 'app-auto-refresh',
  templateUrl: './auto-refresh.component.html',
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
