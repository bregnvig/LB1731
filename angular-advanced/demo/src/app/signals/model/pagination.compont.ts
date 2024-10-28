import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, input, model, TemplateRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { debounceTime, filter } from 'rxjs';

@Component({
  selector: 'loop-pagination',
  template: `
    <div class="card">
      <div class="card-body">
        <div class="card-text">
          <div class="card-text">
            <ng-container [ngTemplateOutlet]="template()" [ngTemplateOutletContext]="{$implicit: items()[page()]}"]></ng-container>
          </div>
          <div class="row justify-content-between">
            <div class="col-auto">
              <div class="btn-group">
                <button class="btn btn-sm" [disabled]="firstElement()" (click)="firstPage()">
                  <fa-icon [icon]="['fas', 'backward-fast']"/>
                </button>
                <button class="btn btn-sm" [disabled]="firstElement()" (click)="prevPage()">
                  <fa-icon [icon]="['fas', 'backward']"/>
                </button>
              </div>

            </div>
            <div class="col d-flex flex-column">
              <input class="form-control" type="number" placeholder="page" [formControl]="control"/>
              <small class="text-muted">{{page() + 1}} of {{items().length}}</small>
            </div>
            <div class="col-auto">
              <div class="btn-group">
                <button class="btn btn-sm"  [disabled]="lastElement()" (click)="nextPage()">
                  <fa-icon [icon]="['fas', 'forward']"/>
                </button>
                <button class="btn btn-sm"  [disabled]="lastElement()" (click)="lastPage()">
                  <fa-icon [icon]="['fas', 'forward-fast']"/>
                </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, NgTemplateOutlet, FaIconComponent]
})

export class PaginationComponent {


  template = input.required<TemplateRef<any>>();
  items = input.required<unknown[]>();

  page = model<number>(0);
  control = new FormControl<number>(this.page() + 1, { nonNullable: true });

  constructor() {
    this.control.valueChanges.pipe(
      debounceTime(300),
      filter(page => page > 0 && page < this.items().length),
      takeUntilDestroyed()
    ).subscribe(page => this.page.set(page - 1));
    effect(() => this.control.patchValue(this.page() + 1, { emitEvent: false }));
  }

  firstElement = computed(() => this.page() === 0);
  lastElement = computed(() => this.items().length === this.page() + 1);

  firstPage() {
    this.page.set(0);
  }

  lastPage() {
    this.page.set(this.items().length - 1);
  }

  nextPage() {
    this.page.update(current => current + 1);
  }

  prevPage() {
    this.page.update(current => Math.max(0, current - 1));
  }

  change(event: Event) {
    const data = (event as InputEvent).data;
    data && this.page.set(parseInt(data));
  }

}