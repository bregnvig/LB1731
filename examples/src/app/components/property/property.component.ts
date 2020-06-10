import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {

   showRed = false;
   show = false;

  constructor() { }

  ngOnInit() {
  }

   toggleRed() {
    this.showRed = !this.showRed;
  }
   toggleShow() {
    this.show = !this.show;
  }

}
