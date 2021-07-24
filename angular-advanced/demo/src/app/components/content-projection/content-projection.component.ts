import { Component } from '@angular/core';
import { PlaygroundService } from 'src/app/shared';

@Component({
  selector: 'loop-content-projection',
  templateUrl: './content-projection.component.html',
  styleUrls: ['./content-projection.component.scss']
})
export class ContentProjectionComponent {

  playgrounds$ = this.service.playgrounds$;

  constructor(private service: PlaygroundService) { }



}
