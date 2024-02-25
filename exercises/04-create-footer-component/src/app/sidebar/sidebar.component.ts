import { Component } from '@angular/core';
import { MOCK_PLAYGROUNDS } from '../shared/mock-playgrounds';
import { Playground } from '../shared/playground';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
})
export class SidebarComponent {
  playgrounds: Playground[] = MOCK_PLAYGROUNDS;
}
