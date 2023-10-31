import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { AbstractSubscribeUnsubscribeDirective } from 'src/app/rxjs/rxjs-utils';

@Component({
  selector: 'loop-custom-controls',
  templateUrl: './custom-controls.component.html',
})
export class CustomControlsComponent extends AbstractSubscribeUnsubscribeDirective implements OnInit {

  fg = this.fb.group({
    isCompany: this.fb.control(false),
    name: this.fb.control(null, Validators.required),
    homeAddress: this.fb.control(null, Validators.required),
    workAddress: this.fb.control(null),
  });

  constructor(private fb: UntypedFormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.fg.reset({
      workAddress: {
        street: 'Kristaniagade',
        streetNumber: '1',
        floor: '1',
        zip: '2100',
        city: 'København Ø'
      }
    });
    this.subscriptions.push(
      this.fg.valueChanges.subscribe(value => console.log(value)),
      this.fg.controls.isCompany!.valueChanges.subscribe(isCompany => isCompany ? this.fg.controls.homeAddress?.disable() : this.fg.controls.homeAddress?.enable()),
    );
  }

}
