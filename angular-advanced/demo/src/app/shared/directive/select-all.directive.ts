import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[selectAll]',
})
export class SelectAllDirective {

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus() {
    this.elementRef.nativeElement.select();
  }

}
