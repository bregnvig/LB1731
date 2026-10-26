import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';

@Component({
  selector: 'loop-computed-vs-effect',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <p>Computed: <strong>{{ fullNameComputed() }}</strong></p>
      <p>Effect copy: <strong>{{ fullNameCopy() }}</strong></p>
      <button class="btn btn-primary" (click)="rename()">Rename</button>
      <p class="mt-3 text-muted">Open the console, then click Rename.</p>
    </div>
  `
})
export class ComputedVsEffectComponent {
  firstName = signal('Ada');
  lastName = signal('Lovelace');

  // Derived: always in sync, computed when read.
  fullNameComputed = computed(() => `${this.firstName()} ${this.lastName()}`);

  // Anti-pattern: a copy kept in sync by an effect.
  fullNameCopy = signal('');

  constructor() {
    effect(() => {
      this.fullNameCopy.set(`${this.firstName()} ${this.lastName()}`);
      console.log('Effect ran');
    });
  }

  rename() {
    this.firstName.set(this.firstName() === 'Ada' ? 'Grace' : 'Ada');
    this.lastName.set(this.lastName() === 'Lovelace' ? 'Hopper' : 'Lovelace');
    // The effect hasn't run yet: it's scheduled for the next change detection.
    console.log('computed:', this.fullNameComputed(), '| copy:', this.fullNameCopy());
  }
}
