import { Directive, computed, input, signal } from '@angular/core';

@Directive({
  selector: '[rotate180]',
  host: {
    'style.transform': '"rotate(180deg)"'
  }
})
export class Rotate180 {}

@Directive({
  selector: '[rotateFlyover]',
  host: {
    '[style.transform]': 'transform()',
    '(mouseover)': 'isHovered.set(true)',
    '(mouseout)': 'isHovered.set(false)'
  }
})
export class RotateFlyover {
  protected isHovered = signal(false);
  protected transform = computed(() => `rotate(${this.isHovered() ? 180 : 0}deg)`);
}

@Directive({
  selector: '[rotateFlyover2]',
  host: {
    '[style.transform]': 'transform()',
    '(mouseover)': 'isHovered.set(true)',
    '(mouseout)': 'isHovered.set(false)'
  }
})
export class RotateFlyover2 {
  angle = input(0, { alias: 'rotateFlyover2' });
  protected isHovered = signal(false);
  protected transform = computed(() => `rotate(${this.isHovered() ? this.angle() : 0}deg)`);
}

@Directive({
  selector: '[rotateFlyover3]',
  host: {
    '[style.transform]': 'transform()',
    '(mouseover)': 'isHovered.set(true)',
    '(mouseout)': 'isHovered.set(false)'
  }
})
export class RotateFlyover3 {
  angle = input(0, { alias: 'rotateFlyover3' });
  defaultAngle = input(0);
  protected isHovered = signal(false);
  protected transform = computed(() => `rotate(${this.isHovered() ? (this.angle() || this.defaultAngle()) : 0}deg)`);
}