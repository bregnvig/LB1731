import { Component, OnInit } from '@angular/core';
import { Playground } from '../shared';
import { MOCK_PLAYGROUNDS } from '../shared/mock-playgrounds';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  playgrounds: Playground[];

  constructor() {
  }

  ngOnInit() {
    this.playgrounds = MOCK_PLAYGROUNDS;
  }

}
