import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Driver } from './../../async/driver';
import { F1BetterService } from './../../async/f1.service';

@Component({
  selector: 'app-async',
  templateUrl: './async.component.html',
  styleUrls: ['./async.component.css']
})
export class AsyncComponent implements OnInit {

  drivers$!: Observable<Driver[]>;

  constructor(private service: F1BetterService) { }

  ngOnInit() {
    this.drivers$ = this.service.getDrivers();
  }

}
