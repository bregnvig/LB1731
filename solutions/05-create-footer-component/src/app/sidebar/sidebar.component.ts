import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { MOCK_PLAYGROUNDS } from '../shared/mock-playgrounds';
import { Playground } from '../shared';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  public playgrounds = MOCK_PLAYGROUNDS;
  @Output('playground-selected') public playgroundSelected = new EventEmitter<Playground>();

  public selectedPlayground: Playground;

  public selectPlayground(playground: Playground): void {
    this.selectedPlayground = playground;
    this.playgroundSelected.emit(playground);
  }

}
