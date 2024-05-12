import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Playground } from '../shared';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
})
export class SidebarComponent {
  @Input() playgrounds?: Playground[] | null;
  @Output() selected = new EventEmitter<Playground>();

  selectedPlayground?: Playground;

  selectPlayground(playground: Playground) {
    this.selectedPlayground = playground;
    this.selected.emit(playground);
  }
}
