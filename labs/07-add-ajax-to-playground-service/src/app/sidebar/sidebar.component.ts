import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Playground, PlaygroundService } from '../shared';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public playgrounds: Playground[];
  @Output('playground-selected')
  public playgroundSelected = new EventEmitter<Playground>();

  constructor(private playgroundService: PlaygroundService) { }

  public ngOnInit() {
    this.playgrounds = this.playgroundService.getPlaygrounds();
  }

  public selectedPlayground: Playground;

  public selectPlayground(playground: Playground): void {
    this.selectedPlayground = playground;
    this.playgroundSelected.emit(playground);
  }

}
