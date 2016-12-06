import { Component, OnInit } from '@angular/core';

import { Driver } from '../driver';
import { F1AutoRefreshService } from '../f1.service';

@Component({
  selector: 'app-auto-refresh',
  templateUrl: './auto-refresh.component.html',
  styleUrls: ['./auto-refresh.component.css']
})
export class AutoRefreshComponent {

  public drivers: Driver[];

  constructor(private service: F1AutoRefreshService) {
    // Should unsubscribe this, ellse we'll have a memory leak'
    const sub = service.getDrivers().subscribe(drivers => {
      console.log('Updating drivers array with new drivers');
      this.drivers = drivers
    });
  }

  public addSubscribtion() {
    this.service.getDrivers().subscribe(drivers => console.log(`Found ${drivers.length} drivers`));
  }

}
