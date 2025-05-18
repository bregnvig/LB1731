import { Component, forwardRef, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ValidationErrors, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'loop-edit-playground-control',
    template: `
    <form [formGroup]="fg">
      <div>
        <label class="form-label" for="name">Name</label>
        <input formControlName="name" ngbAutoFocus id="name" type="text" class="form-control" (blur)="onBlur()">
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
    imports: [ReactiveFormsModule]
})
export class EditPlaygroundControlComponent implements OnInit {

  private propagateChange: ((_: any) => any) | undefined;
  private propagateTouched: (() => void) | undefined;

  fg = this.fb.group({
    name: [undefined, Validators.required],
    description: [],
    addressDescription: [],
  }, {
    validators: (fg: FormGroup): null | ValidationErrors => fg.get('description')?.value || fg.get('addressDescription')?.value ? null : { requiredOr: ['description', 'addressDescription'] }
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
