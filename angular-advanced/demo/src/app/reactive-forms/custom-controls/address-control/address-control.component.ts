import { Component, forwardRef, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { map } from 'rxjs/operators';
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
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => AddressControlComponent),
            multi: true
        }
    ],
    standalone: false
})
export class AddressControlComponent extends AbstractSubscribeUnsubscribeDirective implements OnInit, ControlValueAccessor, Validator {

  fg = this.fb.group({
    street: this.fb.control(''),
    streetNumber: this.fb.control(''),
    floor: this.fb.control(''),
    zip: this.fb.control('', (control: AbstractControl) => !control.value || /^[1-9][0-9]{3}$/.test(control.value) ? null : { invalidZip: true }),
    city: this.fb.control(''),
  });

  private propagateChange: ((_: any) => any) | undefined;
  private propagateTouched: (() => void) | undefined;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.fg.valueChanges.pipe(
      map(value => Object.fromEntries(Object.entries(value).filter(([, value]) => value))),
      this.takeUntilDestroyed(),
    ).subscribe(value => this.propagateChange?.(Object.keys(value).length ? value : null));
  }

  onBlur() {
    this.propagateTouched?.();
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

  validate(): ValidationErrors | null {
    return Object.values(this.fg.controls).reduce((acc, control) => ({ ...acc, ...control.errors }), {} as ValidationErrors);
  }
}
