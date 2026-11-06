import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DriverListItemComponent } from "../../async/driver-list-item.component";
import { Driver } from './../../async/driver';
import { F1BetterService, F1SimpleService } from './../../async/f1.service';

@Component({
  selector: 'app-async',
  template: `
    <h2>Async pipe</h2>
    <ul class="list-group">
      @for(driver of drivers$ | async; track driver.driverNumber) {
        <app-driver-list-item [driver]="driver"/>
      }
    </ul>
  `,
  providers: [F1SimpleService, F1BetterService],
  imports: [AsyncPipe, DriverListItemComponent]
})
export class AsyncComponent implements OnInit {

  protected drivers$!: Observable<Driver[]>;

  constructor(private service: F1BetterService) { }

  ngOnInit() {
    this.drivers$ = this.service.getDrivers();
  }

}
