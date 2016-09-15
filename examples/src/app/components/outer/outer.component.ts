import { Component, OnInit } from '@angular/core';

import { InnerComponent } from '../inner';

@Component({
  selector: 'app-outer',
  templateUrl: 'outer.component.html',
  styleUrls: ['outer.component.css'],
  directives: [InnerComponent]
})
export class OuterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
