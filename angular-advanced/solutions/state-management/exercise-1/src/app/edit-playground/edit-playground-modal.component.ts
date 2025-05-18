import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Playground } from '../model';
import { EditPlaygroundControlComponent } from './edit-playground-control.component';

@Component({
  selector: 'loop-edit-playground-modal',
  imports: [ReactiveFormsModule, EditPlaygroundControlComponent],
  template: `
    <div>
      <div class="modal-header">
        <h5 class="modal-title">{{ playground.name }}</h5>
        <button type="button" class="btn-close" aria-label="Close" (click)="modal.dismiss()"></button>
      </div>
      <div class="modal-body">
        <loop-edit-playground-control [formControl]="editControl"/>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="modal.dismiss()">Luk</button>
        <button type="button" [disabled]="editControl.invalid" class="btn btn-primary" (click)="close()">OK</button>
      </div>
    </div>
  `,
})
export class EditPlaygroundModalComponent implements OnInit {

  static open(modal: NgbModal, playground: Playground, playgrounds: Playground[]): Promise<Playground> {
    const ref = modal.open(EditPlaygroundModalComponent);
    (ref.componentInstance as EditPlaygroundModalComponent).initialize(playground, playgrounds);
    return ref.result;
  }

  private validateUniqueName = (control: AbstractControl): ValidationErrors | null => this.playgrounds?.some(p => p.name === control.value?.name && p.id !== this.playground.id)
    ? {nonUnique: true} : null;

  editControl = new FormControl<Playground | null>(null, this.validateUniqueName);
  playground!: Playground;
  playgrounds: Playground[] = [];

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.editControl.reset(this.playground);
  }

  initialize(playground: Playground, playgrounds: Playground[]): void {
    this.playground = playground;
    this.playgrounds = playgrounds;
  }

  close() {
    this.modal.close({...this.playground, ...this.editControl.value});
  }

}
