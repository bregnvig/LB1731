import { Component, Injector, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Playground } from '../model';
import { PlaygroundStore } from '../playground-store.service';
import { EditPlaygroundControlComponent } from './edit-playground-control.component';

@Component({
  selector: 'loop-edit-playground-modal',
  standalone: true,
  imports: [ReactiveFormsModule, EditPlaygroundControlComponent],
  template: `
    <div>
      <div class="modal-header">
        <h5 class="modal-title">{{playground.name}}</h5>
        <button type="button" class="btn-close" aria-label="Close" (click)="modal.dismiss()"></button>
      </div>
      <div class="modal-body">
        <loop-edit-playground-control [formControl]="editControl"/>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="modal.dismiss()">Luk</button>
        <button type="button" [disabled]="editControl.invalid" class="btn btn-primary" (click)="save()">OK</button>
      </div>
    </div>
  `,
})
export class EditPlaygroundModalComponent implements OnInit {

  static open(modal: NgbModal, playground: Playground, injector: Injector): Promise<Playground> {
    const ref = modal.open(EditPlaygroundModalComponent, { injector });
    (ref.componentInstance as EditPlaygroundModalComponent).initialize(playground);
    return ref.result;
  }

  private validateUniqueName = (control: AbstractControl): null | ValidationErrors => {
    const nonUnique = this.store.playgrounds().some(p => p.name === control.value?.name && p.id !== this.playground.id);
    return nonUnique ? { nonUnique } : null;
  };

  editControl = new FormControl<Playground | null>(null, this.validateUniqueName);
  playground!: Playground;

  constructor(public modal: NgbActiveModal, private store: PlaygroundStore) { }

  ngOnInit(): void {
    this.editControl.reset(this.playground);
    this.editControl.valueChanges.subscribe(_ => console.log(_));
  }

  initialize(playground: Playground) {
    this.playground = playground;
  }

  save() {
    this.store.updatePlayground(this.playground.id, { ...this.playground, ...this.editControl.value });
    this.modal.close();
  }

}
