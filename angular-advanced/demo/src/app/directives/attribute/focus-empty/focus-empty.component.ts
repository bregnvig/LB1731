import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'loop-focus-empty',
  templateUrl: './focus-empty.component.html',
  styleUrls: ['./focus-empty.component.scss']
})
export class FocusEmptyComponent {

  fg: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.fg = this.fb.group({
      first: ['', Validators.required],
      last: ['', Validators.required],
      age: [],
    });
  }

  submit() {
    this.submitted = this.fg.valid;
    this.fg.markAllAsTouched();
  }

}
