import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[loopSelectAllText]',
  standalone: true
})
export class SelectAllTextDirective {

  constructor(private elementRef: ElementRef<HTMLInputElement>) {
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value: string) {
    this.elementRef.nativeElement.select();
  }

}
