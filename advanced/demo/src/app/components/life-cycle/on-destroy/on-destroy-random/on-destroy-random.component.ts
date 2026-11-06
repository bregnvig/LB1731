import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'loop-on-destroy-random',
  template: `
    <p>
      {{no}}
    </p>
  `,
  styles: `
    @import "src/scss/variables";

    p {
      display: flex;
      align-items: center;
      gap: .75rem;
      min-height: 7.5rem;
      margin: 0;
      padding: 0 1.5rem;
      border-radius: $border-radius-lg;
      background: $navy;
      color: $white;
      font-size: 3.5rem;
      font-weight: 700;
      font-stretch: 75%;
      font-variant-numeric: tabular-nums;

      // Lit while the interval subscription is alive
      &::before {
        content: "";
        width: .75rem;
        height: .75rem;
        border-radius: 50%;
        background: #3ee08f;
        box-shadow: 0 0 0 4px rgba(#3ee08f, .25);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class OnDestroyRandomComponent implements OnDestroy {

  no: number | undefined;
  private subscription: Subscription;

  constructor() {
    this.subscription = interval(1000).pipe(
      map(() => Math.floor(Math.random() * 100)),
    ).subscribe(no => this.no = no);
  }

  ngOnDestroy() {
    console.log('OnDestroyRandomComponent destroyed');
    this.subscription.unsubscribe();
  }

}
