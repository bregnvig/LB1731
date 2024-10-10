import { Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';

@Directive({ selector: '[loopExpand]' })
export class ExpandDirective {

  #expand = true;

  constructor(private ref: ElementRef) { }

  @Input() set loopExpand(expand: boolean | '') {
    this.#expand = typeof expand === 'boolean' ? expand : true;
  }

  @HostBinding('style.transition') transition = 'all .2s';

  @HostBinding('style.width.px') width?: number;

  @HostListener('focus') onFocus() {
    this.#expand && (this.width = this.ref.nativeElement.offsetWidth + 160);
  }

  @HostListener('blur') onBlur() {
    this.#expand && (this.width = this.ref.nativeElement.offsetWidth - 160);
  }

}
