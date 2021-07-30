import { Component } from '@angular/core';
import { PlaygroundService } from 'src/app/shared';

@Component({
  selector: 'loop-dynamic-component',
  templateUrl: './dynamic-component.component.html',
  styleUrls: ['./dynamic-component.component.scss']
})
export class DynamicComponentComponent {

  playgrounds$ = this.service.playgrounds$;

  constructor(private service: PlaygroundService) { }

}
