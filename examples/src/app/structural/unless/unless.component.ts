import { Component, OnInit } from '@angular/core';
import { Unless } from '../unless.directive';

@Component({
  moduleId: module.id,
  selector: 'app-unless',
  templateUrl: 'unless.component.html',
  styleUrls: ['unless.component.css'],
  directives: [Unless]
})
export class UnlessComponent {

  public show = true;

  public toggle() {
    this.show = !this.show;
  }

}
