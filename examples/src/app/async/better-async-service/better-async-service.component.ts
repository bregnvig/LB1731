import { Component, OnInit } from '@angular/core';

import { Driver } from '../driver';
import { F1BetterService } from '../f1.service';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-better-async-service',
    templateUrl: './better-async-service.component.html',
    providers: [F1BetterService],
    standalone: true,
    imports: [NgFor]
})
export class BetterAsyncServiceComponent implements OnInit {

  drivers?: Driver[];

  constructor(private service: F1BetterService) {
  }

  ngOnInit() {
    this.service.getDrivers().subscribe(drivers => this.drivers = drivers);
  }

  addSubscribtion() {
    this.service.getDrivers().subscribe(drivers => console.log(`Found ${drivers.length} drivers`));
  }

}
