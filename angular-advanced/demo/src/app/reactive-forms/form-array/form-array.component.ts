import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
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
    this.fg.controls.emailAddresses.valueChanges.pipe(
      debounceTime(400),
      this.takeUntilDestroyed()
    ).subscribe(_ => console.log(_));
  }

  addEmail(value: string) {
    this.fg.controls.emailAddresses.push(this.fb.control(value, Validators.email));
  }

  save() {
    console.log(this.fg.value);
  }

}
