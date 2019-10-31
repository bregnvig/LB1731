import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import { MOCK_PLAYGROUNDS } from '../shared/mock-playgrounds';
import { Playground } from '../shared';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  @Input() playgrounds: Playground[];
  @Input() public selectedPlayground: Playground;
  @Output() public selected = new EventEmitter<Playground>();

  public selectPlayground(playground: Playground): void {
    this.selected.emit(playground);
  }

}
