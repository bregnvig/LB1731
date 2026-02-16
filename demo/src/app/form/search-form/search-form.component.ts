import { Component, OnInit } from '@angular/core';

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';




@Component({
    selector: 'app-search-form',
    templateUrl: './search-form.component.html',
    imports: [FormsModule, ReactiveFormsModule]
})
export class SearchFormComponent implements OnInit {

  protected searchControl = new FormControl<string>('');
  #searchControl2 = new FormControl<string>('');

  ngOnInit() {
    this.searchControl
      .valueChanges.pipe(
        debounceTime(400),
        filter(value => (value?.length ?? 0) > 2),
        distinctUntilChanged()
      )
      .subscribe(param => console.log('Do something with this', param));

  }

  protected ngModelSaerch(value: string) {
    console.log('Do something with this 2', value);
  }

}
