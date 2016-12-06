import { Component, OnInit } from '@angular/core';

import { Playground } from '../shared';
import { MOCK_PLAYGROUNDS } from '../shared/mock-playgrounds';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public playgrounds: Playground[] = MOCK_PLAYGROUNDS;

  constructor() { 
  }

  ngOnInit() {
  }

}
