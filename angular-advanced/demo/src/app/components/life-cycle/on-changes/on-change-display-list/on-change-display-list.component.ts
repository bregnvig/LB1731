import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'loop-on-change-display-list',
  template: `
    <table class="table">
      <tr *ngFor="let item of items">
        <td>{{item}}</td>
      </tr>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnChangeDisplayListComponent implements OnChanges {

  @Input() items: string[] | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    this.items = changes['items']?.currentValue.sort();
  }

}
