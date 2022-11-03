import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { AbstractSubscribeUnsubscribeDirective } from 'src/app/rxjs/rxjs-utils';

@Component({
  selector: 'loop-custom-controls',
  templateUrl: './custom-controls.component.html',
  styleUrls: ['./custom-controls.component.scss']
})
export class CustomControlsComponent extends AbstractSubscribeUnsubscribeDirective implements OnInit {

  fg = this.fb.group({
    isCompany: [false],
    name: [undefined, Validators.required],
    homeAddress: [undefined, Validators.required],
    workAddress: []
  });

  controls = {
    isCompany: this.fg.get('isCompany'),
    name: this.fg.get('name'),
    homeAddress: this.fg.get('homeAddress'),
    workAddress: this.fg.get('workAddress'),
  };

  constructor(private fb: UntypedFormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.fg.reset({
      workAddress: {
        street: 'Amaliegade',
        streetNumber: '5C',
        floor: '2',
        zip: '1256',
        city: 'København K'
      }
    });
    this.subscriptions.push(
      this.fg.valueChanges.subscribe(value => console.log(value)),
      this.controls.isCompany!.valueChanges.subscribe(isCompany => isCompany ? this.controls.homeAddress?.disable() : this.controls.homeAddress?.enable()),
    );
  }

}
