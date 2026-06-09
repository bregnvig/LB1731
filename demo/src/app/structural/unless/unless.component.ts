import { Component } from '@angular/core';
import { Unless } from '../unless.directive';

@Component({
  selector: 'app-unless',
  template: `
    <h1>Unless</h1>
    <div class="pane-container center-content">
      <div class="pane fixed-size">
        <button class="btn btn-default" (click)="toggle()">Toggle show</button>
        <p>Value of show: <b>{{show}}</b></p>
        <p *unless="show">unless="true"</p>
        <p *unless="!show">unless="false"</p>
      </div>
    </div>
  `,
  imports: [Unless]
})
export class UnlessComponent {

  protected show = true;

  protected toggle() {
    this.show = !this.show;
  }

}
