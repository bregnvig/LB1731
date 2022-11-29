import { Component, OnInit } from '@angular/core';

import { UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';




@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
})
export class SearchFormComponent implements OnInit {

  searchControl = new UntypedFormControl();
  searchControl2 = new UntypedFormControl();

  ngOnInit() {
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
