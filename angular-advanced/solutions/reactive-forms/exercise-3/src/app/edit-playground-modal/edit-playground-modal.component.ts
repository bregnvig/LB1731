import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
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
    map(playgrounds => playgrounds.some(p => p.name === control.value?.name && p.id !== this.playground.id)),
    map(nonUnique => nonUnique ? { nonUnique } : null),
  );

  editControl = new FormControl(undefined, null, this.validateUniqueName);
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
    this.modal.close({ ...this.playground, ...this.editControl.value });
  }

}
