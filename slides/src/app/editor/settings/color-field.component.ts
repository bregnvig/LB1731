import { Component, input, output } from '@angular/core';

/** A color as text (any CSS color) with a picker for the #rrggbb ones. */
@Component({
  selector: 'app-color-field',
  template: `<span class="color">
    <input type="color" [attr.aria-label]="label() + ' picker'" [value]="hex()" (input)="valueChange.emit($any($event.target).value)">
    <input type="text" class="field" [attr.aria-label]="label()" [value]="value()" (change)="valueChange.emit($any($event.target).value.trim())">
  </span>`,
})
export class ColorFieldComponent {
  readonly value = input.required<string>();
  readonly label = input.required<string>();
  readonly valueChange = output<string>();
  hex() {
    const v = this.value();
    return /^#[0-9a-f]{6}$/i.test(v) ? v : /^#[0-9a-f]{3}$/i.test(v) ? `#${[...v.slice(1)].map(c => c + c).join('')}` : '#000000';
  }
}
