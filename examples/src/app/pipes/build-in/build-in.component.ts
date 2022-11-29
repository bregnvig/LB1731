import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-build-in',
  templateUrl: './build-in.component.html',
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
