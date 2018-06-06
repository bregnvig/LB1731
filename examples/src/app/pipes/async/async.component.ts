import { Driver } from './../../async/driver';
import { Observable } from 'rxjs';
import { F1BetterService } from './../../async/f1.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-async',
  templateUrl: './async.component.html',
  styleUrls: ['./async.component.css']
})
export class AsyncComponent implements OnInit {

  public drivers$: Observable<Driver[]>;

  constructor(private service: F1BetterService) { }

  ngOnInit() {
    this.drivers$ = this.service.getDrivers();
  }

}
