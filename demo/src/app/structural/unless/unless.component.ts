import { Component } from '@angular/core';
import { Unless } from '../unless.directive';

@Component({
  selector: 'app-unless',
  templateUrl: './unless.component.html',
  styleUrls: ['./unless.component.css'],
  imports: [Unless]
})
export class UnlessComponent {

  show = true;

  toggle() {
    this.show = !this.show;
  }

}
