import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Driver } from '../driver';
import { DriverListItemComponent } from "../driver-list-item.component";
import { RetryService } from '../retry.service';
@Component({
  selector: 'app-retry-when',
  templateUrl: './retry-when.component.html',
  imports: [DriverListItemComponent]
})
export class RetryWhenComponent implements OnInit {

  drivers?: Driver[];

  constructor(private service: RetryService) { }

  ngOnInit() {
    this.service.drivers$.subscribe(drivers => this.drivers = drivers, console.error);
  }

}
