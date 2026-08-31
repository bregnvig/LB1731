import { Component, ChangeDetectionStrategy } from '@angular/core';
import { InnerComponent } from '../inner/inner.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-ngif',
    templateUrl: './ngif.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgIf, InnerComponent]
})
export class NgifComponent {

  protected show = true;

  protected toggle() {
    this.show = !this.show;
  }

}
