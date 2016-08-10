import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Playground, PlaygroundService } from '../shared';
import { DefaultDescriptionPipe, DistancePipe, HumanizeDistancePipe } from '../shared/pipes';
@Component({
  moduleId: module.id,
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.css'],
  pipes: [DefaultDescriptionPipe, DistancePipe, HumanizeDistancePipe]
})
export class SidebarComponent implements OnInit {

  private aaaa: any;
  public playgrounds: Playground[];
  @Output('playground-selected')
  public playgroundSelected = new EventEmitter<Playground>();

  constructor(private playgroundService: PlaygroundService) { }

  public ngOnInit() {
    this.playgroundService.getPlaygrounds().subscribe(playgrounds => this.playgrounds = playgrounds);
  }

  public selectedPlayground: Playground;

  public selectPlayground(playground: Playground): void {
    this.selectedPlayground = playground;
    this.playgroundSelected.emit(playground);
  }

}
