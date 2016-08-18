import { Component, OnInit } from '@angular/core';

import { MOCK_PLAYGROUNDS } from '../shared/mock-playgrounds';

@Component({
  moduleId: module.id,
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public playgrounds = MOCK_PLAYGROUNDS;

  constructor() { 
  }

  ngOnInit() {
  }

}
