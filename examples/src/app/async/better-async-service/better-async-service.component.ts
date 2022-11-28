import { Component, OnInit } from '@angular/core';

import { Driver } from '../driver';
import { F1BetterService } from '../f1.service';

@Component({
  selector: 'app-better-async-service',
  templateUrl: './better-async-service.component.html',
  styleUrls: ['./better-async-service.component.css'],
  providers: [F1BetterService]
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
