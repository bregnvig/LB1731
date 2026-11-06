import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[loopFocus]',
    standalone: true
})
export class FocusDirective implements OnInit {

  private _shouldFocus = true;

  @Input() set loopFocus(value: boolean | undefined) {
    this._shouldFocus = value ?? true;
  }

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this._shouldFocus && this.elementRef.nativeElement.focus();
  }

}
