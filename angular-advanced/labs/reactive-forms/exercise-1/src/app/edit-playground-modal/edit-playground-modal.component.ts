import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Playground } from '../model';

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
export class EditPlaygroundModalComponent {

  static open(modal: NgbModal, playground: Playground): Promise<Playground> {
    const ref = modal.open(EditPlaygroundModalComponent);
    (ref.componentInstance as EditPlaygroundModalComponent).initialize(playground);
    return ref.result;
  }

  fg = this.fb.group({
    name: ['', Validators.required],
    addressDescription: [''],
    description: [''],
  });

  playground!: Playground;

  constructor(private fb: FormBuilder, public modal: NgbActiveModal) { }

  initialize(playground: Playground) {
    this.playground = playground;
    this.fg.reset(playground);
  }

  save() {
    this.modal.close({ ...this.playground, ...this.fg.value });
  }

}
