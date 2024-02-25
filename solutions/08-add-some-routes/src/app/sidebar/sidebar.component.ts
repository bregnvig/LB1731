import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Playground } from '../shared';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
})
export class SidebarComponent {
  @Input() playgrounds?: Playground[];
  @Input() selectedPlayground?: Playground;
  @Output() selected = new EventEmitter<Playground>();
}
