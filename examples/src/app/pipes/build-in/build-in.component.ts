import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-build-in',
  templateUrl: './build-in.component.html',
  styleUrls: ['./build-in.component.css']
})
export class BuildInComponent implements OnInit {

  public today = new Date();
  public format = 'G';
  public name = 'Angular';
  public object = {
    a: 'b',
    b: 'c',
    c: 42
  }

  constructor() { }

  ngOnInit() {
  }

}
