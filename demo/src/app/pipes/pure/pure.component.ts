import { Component, OnInit } from '@angular/core';
import { PurePipe, ImpurePipe } from '../pure.pipe';

@Component({
    selector: 'app-pure',
    templateUrl: './pure.component.html',
    imports: [PurePipe, ImpurePipe]
})
export class PureComponent {

  noop() {
  }

}
