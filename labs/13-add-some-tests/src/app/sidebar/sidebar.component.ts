import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import { MOCK_PLAYGROUNDS } from '../shared/mock-playgrounds';
import { Playground } from '../shared';
import { FormControl } from '@angular/forms';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Output() public selected = new EventEmitter<Playground>();
  @Input() public selectedPlayground: Playground;
  @Input() public playgrounds$: Observable<Playground[]>;

  public filteredPlaygrounds$: Observable<Playground[]>;
  public filterControl: FormControl = new FormControl();

  public ngOnInit() {
    this.filteredPlaygrounds$ = this.filterControl.valueChanges
      .startWith('')
      .debounceTime(200)
      .distinctUntilChanged()
      .map(searchTerm => searchTerm.toLowerCase())
      .combineLatest(this.playgrounds$, (searchTerm, playgrounds) =>
        playgrounds.filter(playground => playground.name.toLowerCase().includes(searchTerm)));
  }

  public selectPlayground(playground: Playground): void {
    this.selectedPlayground = playground;
    this.selected.emit(playground);
  }

}
