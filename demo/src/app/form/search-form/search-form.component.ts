import { Component, OnInit } from '@angular/core';

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';




@Component({
    selector: 'app-search-form',
    template: `
      <h2>Search form standalone</h2>
      <div class="form-group">
        <input type="text" class="form-control" [formControl]="searchControl" placeholder="Fancy search"><br>
        <input type="text" class="form-control" ngModel (ngModelChange)="ngModelSearch($event)" placeholder="Backend overload">
      </div>
    `,
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

  protected ngModelSearch(value: string) {
    console.log('Do something with this 2', value);
  }

}
