import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Driver } from '../driver';
import { F1AutoRefreshService } from '../f1.service';

@Component({
  selector: 'app-auto-refresh',
  templateUrl: './auto-refresh.component.html',
  styleUrls: ['./auto-refresh.component.css']
})
export class AutoRefreshComponent implements OnDestroy {

  public drivers: Driver[];

  private subscription: Subscription;

  constructor(private service: F1AutoRefreshService) {
    // Should unsubscribe this, ellse we'll have a memory leak'
    this.subscription = service.getDrivers().subscribe(drivers => {
      console.log('Updating drivers array with new drivers');
      this.drivers = drivers
    });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public addSubscribtion() {
    this.service.getDrivers().subscribe(drivers => console.log(`Found ${drivers.length} drivers`));
  }

}
