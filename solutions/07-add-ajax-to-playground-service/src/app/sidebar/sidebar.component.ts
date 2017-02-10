import { Subscription } from 'rxjs';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';

import { Playground, PlaygroundService } from '../shared';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public playgrounds: Playground[];
  @Output('playground-selected')
  public playgroundSelected = new EventEmitter<Playground>();

  constructor(private playgroundService: PlaygroundService) { }

  public ngOnInit() {
    this.subscriptions.push(
      this.playgroundService.getPlaygrounds().subscribe(playgrounds => this.playgrounds = playgrounds)
    );
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public selectedPlayground: Playground;

  public selectPlayground(playground: Playground): void {
    this.selectedPlayground = playground;
    this.playgroundSelected.emit(playground);
  }

}
