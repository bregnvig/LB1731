import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'loop-on-change-display-list',
  template: `
    <table class="table">
      @for (item of items; track item) {
        <tr>
          <td>{{item}}</td>
        </tr>
      }
    </table>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnChangeDisplayListComponent implements OnChanges {

  @Input() items: string[] | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('On changes has been executed', changes);

    changes['items'] && (this.items = this.items?.map(i => i.toUpperCase())?.sort());
  }

}
