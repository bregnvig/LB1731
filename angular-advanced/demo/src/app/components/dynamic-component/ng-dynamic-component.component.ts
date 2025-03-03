import { Component } from '@angular/core';
import { PlaygroundService } from 'src/app/shared';
import { PopoverService } from './popover.service';

@Component({
    selector: 'loop-ng-dynamic-component',
    templateUrl: './ng-dynamic-component.component.html',
    styleUrls: ['./ng-dynamic-component.component.scss'],
    standalone: false
})
export class NgDynamicComponentComponent {

  playgrounds$ = this.service.playgrounds$;
  component = this.popoverService.popoverComponent;

  constructor(private service: PlaygroundService, private popoverService: PopoverService) { }

}
