import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractSubscribeUnsubscribeDirective } from 'src/app/rxjs/rxjs-utils';
import { Address } from '../address.model';

@Component({
  selector: 'loop-address-control',
  templateUrl: './address-control.component.html',
  styleUrls: ['./address-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressControlComponent),
      multi: true
    }
  ],
})
export class AddressControlComponent extends AbstractSubscribeUnsubscribeDirective implements OnInit, ControlValueAccessor {

  fg = this.fb.group({
    street: [],
    streetNumber: [],
    floor: [],
    attention: [],
    zip: [],
    city: [],
  });

  private propagateChange: ((_: any) => any) | undefined;
  private propagateTouched: (() => void) | undefined;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.fg.valueChanges.pipe(
      this.takeUntilDestroyed(),
    ).subscribe(value => this.propagateChange!(value));
  }

  onBlur() {
    this.propagateTouched!();
  }

  writeValue(address: Partial<Address>): void {
    this.fg.reset(address || {}, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.fg.disable() : this.fg.enable();
  }
}
