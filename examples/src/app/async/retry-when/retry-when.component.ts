import { Component, OnInit } from '@angular/core';
import { Driver } from '../driver';
import { RetryService } from '../retry.service';
@Component({
  selector: 'app-retry-when',
  templateUrl: './retry-when.component.html',
  styleUrls: ['./retry-when.component.css']
})
export class RetryWhenComponent implements OnInit {

  drivers?: Driver[];

  constructor(private service: RetryService) { }

  ngOnInit() {
    this.service.drivers$.subscribe(drivers => this.drivers = drivers, console.error);
  }

}
