import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'loop-guard',
  template: `
  <section class="outlet-panel">
    <div class="panel-bar">
      <label class="goto">
        <fa-icon [icon]="['fas', 'location-arrow']"/>
        <input #playgroundId type="text" class="form-control" placeholder="Enter playground id" aria-label="Playground id" (keydown.enter)="gotoPlayground(playgroundId.value)">
        <kbd>Enter</kbd>
      </label>
      <span class="panel-label">guard/:id</span>
    </div>
    <router-outlet></router-outlet>
  </section>
  `,
  styleUrl: './guard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class GuardComponent {

  constructor(private router: Router, private route: ActivatedRoute) { }

  gotoPlayground(id: string) {
    id && this.router.navigate([id], { relativeTo: this.route });
  }

}
