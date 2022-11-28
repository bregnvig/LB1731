import { Component, OnInit } from '@angular/core';
import { Driver } from '../driver';
import { F1LocalStorageCache } from '../f1.service';

@Component({
  selector: 'app-catch-error',
  templateUrl: './catch-error.component.html',
  styleUrls: ['./catch-error.component.css']
})
export class CatchErrorComponent implements OnInit {
  drivers?: Driver[];

  constructor(private service: F1LocalStorageCache) {
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
