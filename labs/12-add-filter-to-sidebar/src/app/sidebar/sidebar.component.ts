import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Playground, PlaygroundService } from '../shared';

import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  public playgrounds: Playground[];
  @Output('playground-selected')
  public playgroundSelected = new EventEmitter<Playground>();

  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private playgroundService: PlaygroundService) { }

  public ngOnInit() {
    console.log('SidebarComponent is being initialized');
    
    this.playgroundService.getPlaygrounds().subscribe(playgrounds => this.playgrounds = playgrounds);
    this.subscription = this.activatedRoute.params
      .map(params => params['id'])
      .filter(id => id)
      .flatMap(id => this.playgroundService.find(id))
      .subscribe((playground: Playground) => setTimeout(() => this.playgroundSelected.emit(playground)));
  }

  public ngOnDestroy() {
    console.log('SidebarComponent is being destroyed');
    this.subscription.unsubscribe();
  }
}
