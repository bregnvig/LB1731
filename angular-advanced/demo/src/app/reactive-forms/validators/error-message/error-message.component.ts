import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'loop-error-message',
    template: `
    @if (control?.errors && control?.touched) {
      <ngb-alert type="warning" class="mt-2" [dismissible]="false">
        {{control!.errors | json}}
      </ngb-alert>
    }
    `,
    styles: `
      @import "src/scss/variables";

      // An inline field error, not a banner: red text with a marker, under the field
      ngb-alert {
        display: flex;
        gap: .5rem;
        margin-bottom: 0;
        padding: .375rem .75rem;
        border: 0;
        border-radius: $border-radius-sm;
        background: rgba($red, .08);
        color: #b81a2e;
        font-family: $font-family-monospace;
        font-size: .8125rem;

        &::before {
          content: "!";
          display: grid;
          place-items: center;
          flex: none;
          width: 1.125rem;
          height: 1.125rem;
          border-radius: 50%;
          background: $red;
          color: $white;
          font-weight: 700;
          font-size: .75rem;
        }
      }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ErrorMessageComponent {

  @Input() control: AbstractControl | null = null;

}
