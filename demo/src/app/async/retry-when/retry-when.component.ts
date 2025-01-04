import { Component, OnInit } from '@angular/core';
import { Driver } from '../driver';
import { RetryService } from '../retry.service';
import { NgFor } from '@angular/common';
@Component({
    selector: 'app-retry-when',
    templateUrl: './retry-when.component.html',
    imports: [NgFor]
})
export class RetryWhenComponent implements OnInit {

  drivers?: Driver[];

  constructor(private service: RetryService) { }

  ngOnInit() {
    this.service.drivers$.subscribe(drivers => this.drivers = drivers, console.error);
  }

}
