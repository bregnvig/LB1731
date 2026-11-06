import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'loop-locale',
  template: `
    <div class="demo-surface">
      <loop-default-locale/>
      <loop-da-locale/>
    </div>
  `,
  styles: `
    .demo-surface { display: grid; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); gap: 1rem; }
    loop-default-locale, loop-da-locale {
      padding: 1.5rem; border-radius: 1rem; background: rgba(255, 255, 255, .14);
      font-size: 1.75rem; font-weight: 650; font-stretch: 80%; font-variant-numeric: tabular-nums;
    }
    loop-da-locale { background: #fff; color: #0b1220; }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class LocaleComponent {

}
