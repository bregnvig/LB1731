import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Playground } from '../shared';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  @Input() public playgrounds: Playground[];
  @Output() public selected = new EventEmitter<Playground>();

  public selectedPlayground: Playground;

  public selectPlayground(playground: Playground): void {
    this.selectedPlayground = playground;
    this.selected.emit(playground);
  }
}
