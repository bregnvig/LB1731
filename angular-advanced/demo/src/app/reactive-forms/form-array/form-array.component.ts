import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { AbstractSubscribeUnsubscribeDirective } from 'src/app/rxjs/rxjs-utils';

@Component({
  selector: 'loop-form-array',
  templateUrl: './form-array.component.html',
  styleUrls: ['./form-array.component.scss']
})
export class FormArrayComponent extends AbstractSubscribeUnsubscribeDirective implements OnInit {

  fg = this.fb.group({
    emailAddresses: this.fb.array([this.fb.control('flemming.bregnvig@lundogbendsen.dk', Validators.email)])
  });

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.emailAddressesControl.valueChanges.pipe(
      this.takeUntilDestroyed()
    ).subscribe(_ => console.log(_));
  }

  addEmail(value: string) {
    this.emailAddressesControl.push(this.fb.control(value, Validators.email));
  }

  get emailAddressesControl(): FormArray {
    return this.fg.get('emailAddresses') as FormArray;
  }
}
