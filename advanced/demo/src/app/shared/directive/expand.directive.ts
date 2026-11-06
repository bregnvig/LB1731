import { booleanAttribute, Directive, ElementRef, inject, input, signal } from '@angular/core';

@Directive({
  selector: '[loopExpand]',
  standalone: false,
  host: {
    '[style.transition]': '"all .2s"',
    '[style.width.px]': 'width()',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
  }
})
export class ExpandDirective {

  #ref = inject(ElementRef);

  loopExpand = input<boolean, boolean | string>(false, { transform: booleanAttribute });

  width = signal<number | undefined>(undefined);

  onFocus() {
    this.loopExpand() && (this.width.set(this.#ref.nativeElement.offsetWidth + 160));
  }

  onBlur() {
    this.loopExpand() && (this.width.set(this.#ref.nativeElement.offsetWidth - 160));
  }

}
