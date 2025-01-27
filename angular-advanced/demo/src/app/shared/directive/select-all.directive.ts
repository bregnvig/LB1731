import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[selectAll]',
    standalone: false
})
export class SelectAllDirective {

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('focus')
  onFocus() {
    this.elementRef.nativeElement.select();
  }

}
