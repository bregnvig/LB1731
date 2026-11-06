import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[selectAll]',
  standalone: false,
  host: {
    '(focus)': 'onFocus()'
  }
})
export class SelectAllDirective {

  #elementRef = inject(ElementRef);

  onFocus() {
    this.#elementRef.nativeElement.select();
  }

}
