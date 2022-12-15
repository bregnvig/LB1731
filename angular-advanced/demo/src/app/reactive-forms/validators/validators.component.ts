import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { AbstractSubscribeUnsubscribeDirective } from 'src/app/rxjs/rxjs-utils';
import { TypedForm } from '../form-utils';
import { DawaService } from './dawa.service';

const zipValidator = (control: AbstractControl): null | ValidationErrors => !control.value || /^[1-9][0-9]{3}$/.test(control.value) ? null : { invalidZipCode: control.value };


@Component({
  selector: 'loop-validators',
  templateUrl: './validators.component.html',
  styleUrls: ['./validators.component.scss']
})
export class ValidatorsComponent extends AbstractSubscribeUnsubscribeDirective implements OnInit {

  fg = this.fb.group({
    name: ['', Validators.required],
    zipAndCity: this.fb.group({
      zip: [
        '',
        Validators.pattern(/^[1-9][0-9]{3}$/),
        (control: AbstractControl<string>): Observable<null | ValidationErrors> =>
          !control.errors && control.value && this.service.getCityName(control.value).pipe(
            map(() => null),
            catchError(() => of({ nonExistingZip: true }))
          ) || of(null)
      ],
      city: ['']
    }, {
      validators: (zipAndCity: FormGroup<TypedForm<{ zip: string, city: string; }>>): null | ValidationErrors => {
        console.log(zipAndCity.value, zipAndCity.controls['zip']?.valid, zipAndCity.controls['zip']?.value, !zipAndCity.controls['city']?.value);

        return zipAndCity.controls['zip']?.valid && zipAndCity.controls['zip']?.value && !zipAndCity.controls['city']?.value ? { required: 'city' } : null;
      },
    } as AbstractControlOptions)
  });

  constructor(private fb: FormBuilder, private service: DawaService) {
    super();
  }

  ngOnInit(): void {
    combineLatest({
      zip: this.zipAndCityControl.controls['zip']!.valueChanges,
      status: this.zipAndCityControl.controls['zip']!.statusChanges,
    }).pipe(
      debounceTime(500),
      switchMap(({ status, zip }) => status === 'VALID' && zip ? this.service.getCityName(zip) : of(null)),
      catchError(() => of(null)),
    ).subscribe(city => this.zipAndCityControl.controls['city']?.patchValue(city));
  }

  get zipAndCityControl() {
    return this.fg.controls['zipAndCity'];
  }
}
