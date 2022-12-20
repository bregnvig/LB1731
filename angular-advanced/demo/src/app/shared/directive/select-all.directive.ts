import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[selectAll]',
})
export class SelectAllDirective {

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('focus')
  onFocus() {
    this.elementRef.nativeElement.select();
  }

}
