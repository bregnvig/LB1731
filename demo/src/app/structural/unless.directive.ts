import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';

@Directive({
  selector: '[unless]',
})
export class Unless {

  #templateRef = inject(TemplateRef);
  #viewContainer = inject(ViewContainerRef);

  @Input() set unless(condition: boolean) {
    if (!condition) {
      this.#viewContainer.createEmbeddedView(this.#templateRef);
    } else {
      this.#viewContainer.clear();
    }
  }
}
