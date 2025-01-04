import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Driver } from './../../async/driver';
import { F1BetterService, F1SimpleService } from './../../async/f1.service';
import { NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-async',
    templateUrl: './async.component.html',
    providers: [F1SimpleService, F1BetterService],
    standalone: true,
    imports: [NgFor, AsyncPipe]
})
export class AsyncComponent implements OnInit {

  drivers$!: Observable<Driver[]>;

  constructor(private service: F1BetterService) { }

  ngOnInit() {
    this.drivers$ = this.service.getDrivers();
  }

}
