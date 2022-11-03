import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

const code = `
<form focusEmpty [formGroup]="fg" (ngSubmit)="submit()" class="flex-item">
    <div class="form-group row">
        <div class="col">
            <label class="form-label">First name</label>
            <input class="form-control" type="text" formControlName="first">
        </div>
    </div>
    <div class="form-group row">
        <div class="col">
            <label class="form-label">Last name</label>
            <input class="form-control" type="text" formControlName="last">
        </div>
    </div>
    <div class="form-group row">
        <div class="col">
            <label class="form-label">Age</label>
            <input class="form-control" type="number" formControlName="age">
        </div>
    </div>
    <button class="btn btn-primary">Submit</button>
</form>
`

@Component({
  selector: 'loop-focus-empty',
  templateUrl: './focus-empty.component.html',
  styleUrls: ['./focus-empty.component.scss']
})
export class FocusEmptyComponent {

  code = code;
  fg: UntypedFormGroup;
  submitted = false;

  constructor(private fb: UntypedFormBuilder) {
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
