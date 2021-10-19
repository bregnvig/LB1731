import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, mapTo } from 'rxjs/operators';
import { AbstractSubscribeUnsubscribeDirective } from 'src/app/rxjs/rxjs-utils';
import { DawaService } from './dawa.service';

const zipValidator = (control: AbstractControl): null | ValidationErrors => !control.value || /^[1-9][0-9]{3}$/.test(control.value) ? null : { invalidZipCode: control.value };

@Component({
  selector: 'loop-validators',
  templateUrl: './validators.component.html',
  styleUrls: ['./validators.component.scss']
})
export class ValidatorsComponent extends AbstractSubscribeUnsubscribeDirective implements OnInit {

  fg = this.fb.group({
    name: [undefined, Validators.required],
    zipAndCity: this.fb.group({
      zip: [
        undefined,
        Validators.pattern(/^[1-9][0-9]{3}$/),
        (control: AbstractControl): Observable<null | ValidationErrors> =>
          !control.errors && control.value && this.service.getCityName(control.value).pipe(
            mapTo(null),
            catchError(() => of({ nonExistingZip: true }))
          ) || of(null)
      ],
      city: [undefined]
    }, {
      validators: (zipAndCity: FormGroup): null | ValidationErrors => zipAndCity.get('zip')?.valid && zipAndCity.get('zip')?.value && !zipAndCity.get('city')?.value ? { required: true } : null,
    } as AbstractControlOptions)
  });

  constructor(private fb: FormBuilder, private service: DawaService) {
    super();
  }

  ngOnInit(): void {
    // combineLatest([
    //   this.zipAndCityControl.get('zip')!.valueChanges,
    //   this.zipAndCityControl.get('zip')!.statusChanges
    // ]).pipe(
    //   debounceTime(500),
    //   filter(([zip, status]) => status === 'VALID' && zip),
    //   switchMap(([zip]) => this.service.getCityName(zip)),
    //   catchError(() => of(null)),
    //   filter(city => !!city),
    // ).subscribe(city => this.zipAndCityControl.get('city')?.patchValue(city));
  }

  get zipAndCityControl(): FormGroup {
    return this.fg.get('zipAndCity') as FormGroup;
  }
}
