import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[loopSelectAllText]',
  host: {
    '(focus)': 'onFocus()'
  }
})
export class SelectAllTextDirective {

  #elementRef = inject(ElementRef<HTMLInputElement>);

  onFocus() {
    this.#elementRef.nativeElement.select();
  }

}
