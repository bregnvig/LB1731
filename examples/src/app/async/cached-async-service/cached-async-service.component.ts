import { Component, OnInit } from '@angular/core';

import { Driver } from '../driver';
import { F1CachedService } from '../f1.service';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-cached-async-service',
    templateUrl: './cached-async-service.component.html',
    standalone: true,
    imports: [NgFor],
})
export class CachedAsyncServiceComponent implements OnInit {

  drivers?: Driver[];

  constructor(private service: F1CachedService) {
  }

  ngOnInit() {
    this.service.getDrivers().subscribe(drivers => {
      this.drivers = drivers;
    });
  }

  addSubscribtion() {
    this.service.getDrivers().subscribe(drivers => console.log(`Found ${drivers.length} drivers`));
  }
}
