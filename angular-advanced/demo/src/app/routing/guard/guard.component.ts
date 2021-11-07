import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'loop-guard',
  template: `
  <div class="row form-group">
    <div class="col">
      <input #playgroundId type="text" class="form-control" placeholder="Enter playground id" (keydown.enter)="gotoPlayground(playgroundId.value)">
    </div>
  </div>
  <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuardComponent {

  constructor(private router: Router, private route: ActivatedRoute) { }

  gotoPlayground(id: string) {
    this.router.navigate([id], { relativeTo: this.route });
  }

}
