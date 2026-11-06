import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `<button class="btn btn-lg btn-primary btn-block" type="submit">Fancy sign in</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ButtonComponent {
}
