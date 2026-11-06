import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';

@Directive({
  selector: '[unless]',
})
export class Unless {

  #templateRef = inject(TemplateRef);
  #viewContainer = inject(ViewContainerRef);

  unless = input.required<boolean>();

  constructor() {
    effect(() => {
      if (!this.unless()) {
        this.#viewContainer.createEmbeddedView(this.#templateRef);
      } else {
        this.#viewContainer.clear();
      }
    });
  }
}
