import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Playground } from '../model';
import { PlaygroundService } from '../service';

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

  private validateUniqueName = (control: AbstractControl): Observable<null | ValidationErrors> => this.service.playgrounds$.pipe(
    first(),
    map(playgrounds => playgrounds.some(p => p.name === control.value && p.id !== this.playground.id)),
    map(nonUnique => nonUnique ? { nonUnique } : null),
  );

  fg = this.fb.group({
    name: [undefined, Validators.required, this.validateUniqueName],
    description: [],
    addressDescription: [],
  }, {
    validators: (fg: FormGroup): null | ValidationErrors => fg.get('description')?.value || fg.get('addressDescription')?.value ? null : { requiredOr: ['description', 'addressDescription'] }
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
