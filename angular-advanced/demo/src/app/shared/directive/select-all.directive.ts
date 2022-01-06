import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[selectAll]',
})
export class SelectAllDirective {

  private el: HTMLInputElement = this.elementRef.nativeElement;

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value: string) {
    this.el.setSelectionRange(0, value.length);
  }

}
