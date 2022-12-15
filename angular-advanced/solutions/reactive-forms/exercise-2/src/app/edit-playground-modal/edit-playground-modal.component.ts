import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Playground } from '../model';
import { PlaygroundService } from '../service';

type PlaygroupControls = {
  name: FormControl<string | null>,
  description: FormControl<string | null>,
  addressDescription: FormControl<string | null>,
};

@Component({
  selector: 'loop-edit-playground-modal',
  templateUrl: './edit-playground-modal.component.html',
  styleUrls: ['./edit-playground-modal.component.scss']
})
export class EditPlaygroundModalComponent implements OnInit {

  static open(modal: NgbModal, playground: Playground): Promise<Playground> {
    const ref = modal.open(EditPlaygroundModalComponent);
    (ref.componentInstance as EditPlaygroundModalComponent).initialize(playground);
    return ref.result;
  }

  private validateUniqueName = (control: AbstractControl<string>): Observable<null | ValidationErrors> => this.service.playgrounds$.pipe(
    first(),
    map(playgrounds => playgrounds.some(p => p.name === control.value && p.id !== this.playground.id)),
    map(nonUnique => nonUnique ? { nonUnique } : null),
  );

  fg: FormGroup<PlaygroupControls> = this.fb.group({
    name: this.fb.control('', Validators.required, this.validateUniqueName),
    description: this.fb.control(''),
    addressDescription: this.fb.control(''),
  }, {
    validators: (fg: FormGroup<PlaygroupControls>): null | ValidationErrors => fg.get('description')?.value || fg.get('addressDescription')?.value ? null : { requiredOr: ['description', 'addressDescription'] }
  } as AbstractControlOptions);

  playground!: Playground;

  constructor(private service: PlaygroundService, private fb: FormBuilder, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.fg.reset(this.playground || {});
  }

  initialize(playground: Playground) {
    this.playground = playground;
  }

  save() {
    this.modal.close({ ...this.playground, ...this.fg.value });
  }

}
