import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'loop-json',
  templateUrl: './json.component.html',
  styleUrls: ['./json.component.scss']
})
export class JsonComponent implements OnInit {

  login: any = {};

  constructor() { }

  ngOnInit(): void {
  }

}
