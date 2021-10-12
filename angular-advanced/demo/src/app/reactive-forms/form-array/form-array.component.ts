import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { AbstractSubscribeUnsubscribeDirective } from 'src/app/rxjs/rxjs-utils';

@Component({
  selector: 'loop-form-array',
  templateUrl: './form-array.component.html',
  styleUrls: ['./form-array.component.scss']
})
export class FormArrayComponent extends AbstractSubscribeUnsubscribeDirective implements OnInit {

  fg = this.fb.group({
    emailAddresses: this.fb.array(['flemming.bregnvig@lundogbendsen.dk'])
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
    this.emailAddressesControl.push(this.fb.control(value));
  }

  get emailAddressesControl(): FormArray {
    return this.fg.get('emailAddresses') as FormArray;
  }
}
