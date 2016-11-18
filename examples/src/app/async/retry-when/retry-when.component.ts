import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RetryService } from '../retry.service';
import { Driver } from '../driver';
@Component({
  selector: 'app-retry-when',
  templateUrl: './retry-when.component.html',
  styleUrls: ['./retry-when.component.css']
})
export class RetryWhenComponent implements OnInit {

  public drivers: Driver[];

  constructor(private service: RetryService) { }

  ngOnInit() {
    this.service.drivers$.subscribe(drivers => this.drivers = drivers, console.error);
  }

}
