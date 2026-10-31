import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';

@Component({
  selector: 'loop-computed-vs-effect',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <div class="demo-surface pair">
        <p class="tile">Computed: <strong>{{ fullNameComputed() }}</strong> <code>computed()</code></p>
        <p class="tile">Effect copy: <strong>{{ fullNameCopy() }}</strong> <code>signal() + effect()</code></p>
      </div>
      <div class="d-flex align-items-center gap-3 mt-3">
        <button class="btn btn-primary" (click)="rename()">Rename</button>
        <p class="mb-0 text-muted">Open the console, then click Rename.</p>
      </div>
    </div>
  `,
  styles: `
    @import "src/scss/variables";

    .pair {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
      gap: 1.5rem;
    }

    // Two read-outs of the same name: on screen they always agree
    .tile {
      display: flex;
      flex-direction: column;
      gap: .5rem;
      margin: 0;
      padding: 1.5rem;
      border-radius: $border-radius-lg;
      background: rgba($white, .12);
      box-shadow: inset 0 0 0 1px rgba($white, .25);
      font-weight: 600;

      strong {
        color: $white;
        font-size: 3rem;
        font-stretch: 75%;
        line-height: 1;
      }

      code {
        align-self: flex-start;
        background: $white;
        color: $navy;
      }
    }
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
