import { Component, OnInit } from '@angular/core';

import { PurePipe, ImpurePipe } from '../pure.pipe';

@Component({
  moduleId: module.id,
  selector: 'app-pure',
  templateUrl: 'pure.component.html',
  styleUrls: ['pure.component.css'],
  pipes: [PurePipe, ImpurePipe]
})
export class PureComponent {

  public noop() {
  }

}
