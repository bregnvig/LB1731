import { Component } from '@angular/core';
import { InnerComponent } from '../inner/inner.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-ngif',
    templateUrl: './ngif.component.html',
    standalone: true,
    imports: [NgIf, InnerComponent],
})
export class NgifComponent {

  show = true;

  toggle() {
    this.show = !this.show;
  }

}
