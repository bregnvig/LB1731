import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Playground } from '../model';
import { PlaygroundService } from '../service';
import { EditPlaygroundControlComponent } from './edit-playground-control.component';

@Component({
    selector: 'loop-edit-playground-modal',
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
  `
})
export class EditPlaygroundModalComponent implements OnInit {

  static open(modal: NgbModal, playground: Playground): Promise<Playground> {
    const ref = modal.open(EditPlaygroundModalComponent);
    (ref.componentInstance as EditPlaygroundModalComponent).initialize(playground);
    return ref.result;
  }

  private validateUniqueName = (control: AbstractControl): Observable<null | ValidationErrors> => this.service.list().pipe(
    first(),
    map(playgrounds => playgrounds.some(p => p.name === control.value?.name && p.id !== this.playground.id)),
    map(nonUnique => nonUnique ? { nonUnique } : null),
  );

  editControl = new FormControl<Playground | null>(null, null, this.validateUniqueName);
  playground!: Playground;

  constructor(public modal: NgbActiveModal, private service: PlaygroundService) { }

  ngOnInit(): void {
    this.editControl.reset(this.playground);
    this.editControl.valueChanges.subscribe(_ => console.log(_));
  }

  initialize(playground: Playground) {
    this.playground = playground;
  }

  save() {
    this.service.update(this.playground.id, { ...this.playground, ...this.editControl.value }).subscribe(() => this.modal.close());
  }

}
