import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-unless',
  templateUrl: 'unless.component.html',
  styleUrls: ['unless.component.css']
})
export class UnlessComponent {

  public show = true;

  public toggle() {
    this.show = !this.show;
  }

}
