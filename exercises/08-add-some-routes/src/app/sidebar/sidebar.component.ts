import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Playground } from '../shared';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    standalone: true,
    imports: [NgFor]
})
export class SidebarComponent {
  @Input() playgrounds?: Playground[];
  @Output() selected = new EventEmitter<Playground>();

  selectedPlayground?: Playground;

  selectPlayground(playground: Playground) {
    this.selectedPlayground = playground;
    this.selected.emit(playground);
  }
}
