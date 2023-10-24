import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'loop-error-message',
  template: `
    <ngb-alert *ngIf="control?.errors && control?.touched" type="warning" class="mt-2" [dismissible]="false">
      {{control!.errors | json}}
    </ngb-alert>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorMessageComponent {

  @Input() control: AbstractControl | null = null;

}
