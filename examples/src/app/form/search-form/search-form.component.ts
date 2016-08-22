import { Component, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  moduleId: module.id,
  selector: 'app-search-form',
  templateUrl: 'search-form.component.html',
  styleUrls: ['search-form.component.css']
})
export class SearchFormComponent implements OnInit {

  public searchControl;
  public searchControl2;

  constructor() { }

  ngOnInit() {
    this.searchControl = new FormControl();
    this.searchControl2 = new FormControl();
    this.searchControl
      .valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(param => console.log('Do something with this', param));
    this.searchControl2.valueChanges.subscribe(param => console.log('Do something with this 2', param));
  }

}
