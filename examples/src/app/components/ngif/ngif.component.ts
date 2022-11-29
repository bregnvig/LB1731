import { Component } from '@angular/core';

@Component({
  selector: 'app-ngif',
  templateUrl: './ngif.component.html',
})
export class NgifComponent {

  show = true;

  toggle() {
    this.show = !this.show;
  }

}
