import { Component, ChangeDetectionStrategy } from '@angular/core';
import { OnDestroyRandomComponent } from './on-destroy-random/on-destroy-random.component';

@Component({
    selector: 'loop-on-destroy',
    templateUrl: './on-destroy.component.html',
    styles: `
      @import "src/scss/variables";

      article {
        min-height: 7.5rem;
        margin-top: 1rem;

        // Only the @if anchors are left once both children are destroyed
        &:empty {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-inline: 0;
          border: 2px dashed $gray-300;
          border-radius: $border-radius-lg;
          color: $muted;

          &::after {
            content: "Destroyed";
            font-family: $font-family-monospace;
          }
        }
      }
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [OnDestroyRandomComponent]
})
export class OnDestroyComponent {

  show = true;

}
