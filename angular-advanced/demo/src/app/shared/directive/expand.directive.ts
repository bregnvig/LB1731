import { booleanAttribute, Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[loopExpand]',
    standalone: false
})
export class ExpandDirective {

  constructor(private ref: ElementRef) { }

  @Input({ transform: booleanAttribute }) loopExpand = false;

  @HostBinding('style.transition') transition = 'all .2s';

  @HostBinding('style.width.px') width?: number;

  @HostListener('focus') onFocus() {
    this.loopExpand && (this.width = this.ref.nativeElement.offsetWidth + 160);
  }

  @HostListener('blur') onBlur() {
    this.loopExpand && (this.width = this.ref.nativeElement.offsetWidth - 160);
  }

}
