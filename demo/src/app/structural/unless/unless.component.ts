import { Component } from '@angular/core';
import { Unless } from '../unless.directive';

@Component({
  selector: 'app-unless',
  templateUrl: './unless.component.html',
  styleUrls: ['./unless.component.css'],
  imports: [Unless]
})
export class UnlessComponent {

  protected show = true;

  protected toggle() {
    this.show = !this.show;
  }

}
