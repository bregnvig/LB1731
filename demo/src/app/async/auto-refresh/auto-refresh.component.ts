import { Component, signal } from '@angular/core';
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

  drivers = signal<Driver[] | undefined>(undefined);

  constructor(private service: F1AutoRefreshService) {
    // Should unsubscribe this, ellse we'll have a memory leak'
    service.getDrivers().pipe(
      takeUntilDestroyed()
    ).subscribe(drivers => {
      console.log('Updating drivers array with new drivers');
      this.drivers.set(drivers);
    });
  }

  addSubscribtion() {
    this.service.getDrivers().subscribe(drivers => console.log(`Found ${drivers.length} drivers`));
  }

}
