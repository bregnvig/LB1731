import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { Playground } from '../shared';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  @Input() public playground: Playground;
}
