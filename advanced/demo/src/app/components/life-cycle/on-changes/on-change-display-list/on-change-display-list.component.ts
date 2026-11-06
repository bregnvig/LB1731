import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
    selector: 'loop-on-change-display-list',
    template: `
    <table class="table">
      @for (item of items(); track item) {
        <tr>
          <td>{{item}}</td>
        </tr>
      }
    </table>
    `,
    styles: `
      @import "src/scss/variables";

      // Each item reads as one entry in an event log
      table {
        width: 100%;
        margin: 0;
        border-collapse: separate;
        border-spacing: 0;
        border-radius: $border-radius-lg;
        background: $canvas;
        overflow: hidden;
      }

      td {
        position: relative;
        padding: .625rem 1rem .625rem 2.5rem;
        border: 0;
        border-bottom: 1px solid $white;
        background: transparent;
        font-family: $font-family-monospace;
        color: $ink;

        &::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 1.125rem;
          width: .5rem;
          height: .5rem;
          margin-top: -.25rem;
          border-radius: 50%;
          background: $azure;
        }
      }

      tr:last-child td {
        border-bottom: 0;
      }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnChangeDisplayListComponent {

  inputItems = input<string[]>();
  items = computed(() => {
    const items = this.inputItems();
    console.log('Input changed:', items);
    return items?.map(i => i.toUpperCase())?.sort();
  });

}
