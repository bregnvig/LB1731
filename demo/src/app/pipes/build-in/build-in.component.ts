import { Component, OnInit } from '@angular/core';
import { UpperCasePipe, LowerCasePipe, JsonPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-build-in',
    templateUrl: './build-in.component.html',
    standalone: true,
    imports: [
        FormsModule,
        UpperCasePipe,
        LowerCasePipe,
        JsonPipe,
        CurrencyPipe,
        DatePipe,
    ],
})
export class BuildInComponent implements OnInit {

  today = new Date();
  format = 'G';
  name = 'Angular';
  object = {
    a: 'b',
    b: 'c',
    c: 42
  };

  constructor() { }

  ngOnInit() {
  }

}
