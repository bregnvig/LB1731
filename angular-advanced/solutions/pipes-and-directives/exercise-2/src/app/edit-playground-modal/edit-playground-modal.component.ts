import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Playground } from '../model';
import { PlaygroundService } from '../service';
import { EditPlaygroundControlComponent } from '../edit-playground-control/edit-playground-control.component';

@Component({
    selector: 'loop-edit-playground-modal',
    templateUrl: './edit-playground-modal.component.html',
    styleUrls: ['./edit-playground-modal.component.scss'],
    imports: [EditPlaygroundControlComponent, ReactiveFormsModule]
})
export class EditPlaygroundModalComponent implements OnInit {

  modal = inject(NgbActiveModal);
  #service = inject(PlaygroundService);

  static open(modal: NgbModal, playground: Playground): Promise<Playground> {
    const ref = modal.open(EditPlaygroundModalComponent);
    (ref.componentInstance as EditPlaygroundModalComponent).initialize(playground);
    return ref.result;
  }

  #validateUniqueName = (control: AbstractControl): Observable<null | ValidationErrors> => this.#service.playgrounds$.pipe(
    first(),
    map(playgrounds => playgrounds.some(p => p.name === control.value?.name && p.id !== this.playground.id)),
    map(nonUnique => nonUnique ? { nonUnique } : null),
  );

  editControl = new FormControl<Playground | null>(null, { asyncValidators: this.#validateUniqueName });
  playground!: Playground;

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
