import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AbstractSubscribeUnsubscribeDirective } from 'src/app/rxjs/rxjs-utils';

@Component({
  selector: 'loop-top-five',
  templateUrl: './top-five.component.html',
  styleUrls: ['./top-five.component.scss']
})
export class TopFiveComponent extends AbstractSubscribeUnsubscribeDirective implements OnInit {

  @ViewChild('emailControl', { static: true }) emailControl!: ElementRef<HTMLInputElement>;
  @ViewChild('nameControl', { static: true }) nameControl!: ElementRef<HTMLInputElement>;
  fg = this.fb.group({
    email: [undefined, Validators.required],
    name: [undefined, Validators.required],
  });

  emitEventControl = new FormControl(true, Validators.required);
  classes: string | undefined;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.fg.valueChanges.pipe(
      this.takeUntilDestroyed(),
    ).subscribe(_ => console.log(_));
  }

  patch() {
    this.fg.patchValue({
      name: this.nameControl.nativeElement.value,
      email: this.emailControl.nativeElement.value
    }, { emitEvent: this.emitEventControl.value });
  }

  reset() {
    const value: any = {};
    this.nameControl.nativeElement.value && (value.name = this.nameControl.nativeElement.value);
    this.emailControl.nativeElement.value && (value.email = this.emailControl.nativeElement.value);
    this.fg.reset(value, { emitEvent: this.emitEventControl.value });
  }

}
