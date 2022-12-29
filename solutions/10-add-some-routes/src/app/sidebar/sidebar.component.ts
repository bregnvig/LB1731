import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Playground } from '../shared';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() playgrounds?: Playground[];
  @Output() selected = new EventEmitter<Playground>();
  @Input() selectedPlayground?: Playground;
}
