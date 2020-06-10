import { Component, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';
import { debounceTime, filter, distinctUntilChanged } from 'rxjs/operators';




@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {

   searchControl;
   searchControl2;

  constructor() { }

  ngOnInit() {
    this.searchControl = new FormControl();
    this.searchControl2 = new FormControl();
    this.searchControl
      .valueChanges.pipe(
        debounceTime(400),
        filter((value: string) => value.length > 2),
        distinctUntilChanged()

      )
      .subscribe(param => console.log('Do something with this', param));
    this.searchControl2.valueChanges.subscribe(param => console.log('Do something with this 2', param));
  }

}
