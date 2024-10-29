import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, input, model, TemplateRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { debounceTime, filter } from 'rxjs';

@Component({
  selector: 'loop-pagination',
  templateUrl: 'pagination.compont.html',
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
      filter(page => page > 0 && page <= this.items().length),
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
}