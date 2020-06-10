import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ngif',
  templateUrl: './ngif.component.html',
  styleUrls: ['./ngif.component.css']
})
export class NgifComponent implements OnInit {

   show = true;

  constructor() { }

  ngOnInit() {
  }

   toggle() {
    this.show = !this.show;
  }

}
