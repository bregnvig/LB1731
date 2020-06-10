import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unless',
  templateUrl: './unless.component.html',
  styleUrls: ['./unless.component.css']
})
export class UnlessComponent {

   show = true;

   toggle() {
    this.show = !this.show;
  }

}
