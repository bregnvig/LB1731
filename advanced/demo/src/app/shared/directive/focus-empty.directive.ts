import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: 'form[focusEmpty]',
    standalone: false
})
export class FocusEmptyDirective {

  constructor(private elementRef: ElementRef) {}

  @HostListener('submit')
  onFormSubmit() {
    const emptyControl = this.elementRef.nativeElement.querySelector('input.ng-invalid:not([value]):not([value=""])');

    if (emptyControl) {
      emptyControl.focus();
    }
  }

}
