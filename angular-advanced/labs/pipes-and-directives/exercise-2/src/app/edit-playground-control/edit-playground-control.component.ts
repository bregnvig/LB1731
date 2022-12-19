import { Component, forwardRef, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';

interface PlaygroundForm {
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  addressDescription: FormControl<string | null>;
}

@Component({
  selector: 'loop-edit-playground-control',
  template: `
    <form [formGroup]="fg">
      <div>
        <label class="form-label" for="name">Name</label>
        <input formControlName="name" id="name" type="text" class="form-control" (blur)="onBlur()">
      </div>    
      <div>
        <label class="form-label" for="description">Description</label>
        <input formControlName="description" id="description" type="text" class="form-control" (blur)="onBlur()">
      </div>    
      <div>
        <label class="form-label" for="addressDescription">Address description</label>
        <input formControlName="addressDescription" id="addressDescription" type="text" class="form-control" (blur)="onBlur()">
      </div>    
    </form>
  `,
  styleUrls: ['./edit-playground-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditPlaygroundControlComponent),
      multi: true
    }
  ],
})
export class EditPlaygroundControlComponent implements OnInit {

  private propagateChange: ((_: any) => any) | undefined;
  private propagateTouched: (() => void) | undefined;

  fg = this.fb.group<PlaygroundForm>({
    name: this.fb.control('', Validators.required),
    description: this.fb.control(''),
    addressDescription: this.fb.control(''),
  }, {
    validators: (fg: FormGroup<PlaygroundForm>): null | ValidationErrors =>
      fg.controls['description']?.value || fg.controls['addressDescription']?.value ? null : { requiredOr: ['description', 'addressDescription'] }
  } as AbstractControlOptions);

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.fg.valueChanges.subscribe(value => this.propagateChange && this.propagateChange(value));
  }

  onBlur() {
    this.propagateTouched!();
  }

  writeValue(address: Partial<any>): void {
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
