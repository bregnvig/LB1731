import { Component } from '@angular/core';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
})
export class PropertyComponent {

  protected showRed = false;
  protected show = false;

  protected toggleRed() {
    this.showRed = !this.showRed;
  }
  protected toggleShow() {
    this.show = !this.show;
  }

}
