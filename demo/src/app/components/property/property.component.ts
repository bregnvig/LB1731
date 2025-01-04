import { Component } from '@angular/core';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
})
export class PropertyComponent {

  showRed = false;
  show = false;

  toggleRed() {
    this.showRed = !this.showRed;
  }
  toggleShow() {
    this.show = !this.show;
  }

}
