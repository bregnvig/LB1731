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
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class OnChangeDisplayListComponent {

  inputItems = input<string[]>();
  items = computed(() => {
    const items = this.inputItems();
    console.log('Input changed:', items);
    return items?.map(i => i.toUpperCase())?.sort();
  });

}
