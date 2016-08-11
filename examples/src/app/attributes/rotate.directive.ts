import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[rotate180]'
})
export class Rotate180 {

  constructor(el: ElementRef) {
    el.nativeElement.style="transform: rotate(180deg)";
  }
}

@Directive({
  selector: '[rotateFlyover]'
})
export class RotateFlyover {

  constructor(private el: ElementRef) { }

  private rotateText(deg: number) {
    this.el.nativeElement.style=`transform: rotate(${deg || 0}deg)`;
  }
  @HostListener('mouseover') public rotate() {
    this.rotateText(180);
  }
  @HostListener('mouseout') public reset() {
    this.rotateText(0);
  }
}

@Directive({
  selector: '[rotateFlyover2]'
})
export class RotateFlyover2 {

  constructor(private el: ElementRef) { }

  @Input('rotateFlyover2') public angle:number

  private rotateText(deg: number) {
    this.el.nativeElement.style=`transform: rotate(${deg || 0}deg)`;
  }
  @HostListener('mouseover') public rotate() {
    this.rotateText(this.angle);
  }
  @HostListener('mouseout') public reset() {
    this.rotateText(0);
  }
}


@Directive({
  selector: '[rotateFlyover3]'
})
export class RotateFlyover3 {

  constructor(private el: ElementRef) { }

  @Input('rotateFlyover3') public angle:number
  @Input() public defaultAngle:number = 0

  private rotateText(deg: number) {
    this.el.nativeElement.style=`transform: rotate(${deg}deg)`;
  }
  @HostListener('mouseover') public rotate() {
    this.rotateText(this.angle || this.defaultAngle);
  }
  @HostListener('mouseout') public reset() {
    this.rotateText(0);
  }
}
