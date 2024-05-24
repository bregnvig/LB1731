import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, combineLatest, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { AbstractSubscribeUnsubscribeDirective } from 'src/app/rxjs/rxjs-utils';
import { DawaService } from './dawa.service';

const isValidZip = (service: DawaService): AsyncValidatorFn => (control: AbstractControl<string>): Observable<null | ValidationErrors> =>
  !control.errors && control.value && service.getCityName(control.value).pipe(
    map(() => null),
    catchError(() => of({ nonExistingZip: true }))
  ) || of(null);


@Component({
  selector: 'loop-validators',
  templateUrl: './validators.component.html',
  providers: [AsyncPipe],
})
export class ValidatorsComponent extends AbstractSubscribeUnsubscribeDirective implements OnInit {

  fg = this.fb.group({
    name: this.fb.control('', Validators.required),
    zipAndCity: this.fb.group({
      zip: this.fb.control(
        '',
        {
          validators: [Validators.required, Validators.pattern(/^[1-9][0-9]{3}$/)],
          asyncValidators: isValidZip(this.service)
        },
      ),
      city: this.fb.control({ value: '', disabled: false }),
    }, {
      validators: (zipAndCity: FormGroup<{ zip: AbstractControl<string>, city: AbstractControl<string>; }>): null | ValidationErrors => {
        const { zip, city } = zipAndCity.controls;
        // console.table({
        //   value: JSON.stringify(zipAndCity.value),
        //   zipValid: zip.valid,
        //   zipInvalid: zip.invalid,
        //   zipValue: zip.value,
        //   cityValid: city.valid
        // });
        return zip.valid && zip.value && !city.value ? { required: 'city' } : null;
      },
    } as AbstractControlOptions)
  });

  constructor(private fb: FormBuilder, private service: DawaService) {
    super();
  }

  ngOnInit(): void {
    combineLatest({
      zip: this.zipAndCityControl.controls.zip.valueChanges,
      status: this.zipAndCityControl.controls.zip.statusChanges,
    }).pipe(
      debounceTime(500),
      switchMap(({ status, zip }) => status === 'VALID' && zip ? this.service.getCityName(zip) : of(null)),
      catchError(() => of(null)),
    ).subscribe(city => {
      // console.log('Found the city', city);
      // this.zipAndCityControl.controls.city.patchValue(city);
    });
  }

  get zipAndCityControl() {
    return this.fg.controls.zipAndCity;
  }

  log() {
    console.log(this.fg.getRawValue());
    // console.log(this.fg.value);
  }
}
