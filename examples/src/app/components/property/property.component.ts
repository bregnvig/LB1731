import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {

  public showRed = false;
  public show = false;

  constructor() { }

  ngOnInit() {
  }

  public toggleRed() {
    this.showRed = !this.showRed;
  }
  public toggleShow() {
    this.show = !this.show;
  }

}
