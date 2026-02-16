import { Component, OnInit } from '@angular/core';
import { UpperCasePipe, LowerCasePipe, JsonPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-build-in',
    templateUrl: './build-in.component.html',
    imports: [
        FormsModule,
        UpperCasePipe,
        LowerCasePipe,
        JsonPipe,
        CurrencyPipe,
        DatePipe,
    ]
})
export class BuildInComponent implements OnInit {

  protected today = new Date();
  protected format = 'G';
  protected name = 'Angular';
  protected object = {
    a: 'b',
    b: 'c',
    c: 42
  };

  constructor() { }

  ngOnInit() {
  }

}
