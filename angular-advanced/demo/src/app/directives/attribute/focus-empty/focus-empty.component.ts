import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'loop-focus-empty',
    templateUrl: './focus-empty.component.html',
    styleUrls: ['./focus-empty.component.scss'],
    standalone: false
})
export class FocusEmptyComponent {

  fg = this.fb.group({
    first: ['', Validators.required],
    last: ['', Validators.required],
    age: [],
  });
  submitted = false;

  constructor(private fb: FormBuilder) {
  }

  submit() {
    this.submitted = this.fg.valid;
    setTimeout(() => this.submitted = false, 1000);
    this.fg.markAllAsTouched();
  }

}
