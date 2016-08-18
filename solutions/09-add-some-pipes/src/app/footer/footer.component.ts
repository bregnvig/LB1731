import { Component, OnInit, Input } from '@angular/core';

import { Playground } from '../shared';
@Component({
  moduleId: module.id,
  selector: 'app-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.css']
})
export class FooterComponent {

  @Input()
  public playground: Playground;
}
