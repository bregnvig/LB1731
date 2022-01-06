import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[selectAll]',
})
export class SelectAllDirective {

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value: string) {
    this.elementRef.nativeElement.setSelectionRange(0, value.length);
  }

}
