import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, Role } from '../service';

@Directive({
  selector: '[loopIsInRole]',
  standalone: true
})
export class IsInRoleDirective implements OnDestroy {

  private subscription: Subscription | undefined;

  constructor(
    private template: TemplateRef<any>,
    private container: ViewContainerRef,
    private auth: AuthService
  ) { }

  @Input() set loopIsInRole(value: Role | undefined) {
    this.subscription?.unsubscribe();
    this.subscription = this.auth.isInRole$(value ?? 'anonymous').subscribe(isInRole => {
      if (isInRole && !this.container.length) {
        this.container.createEmbeddedView(this.template);
      } else if (!isInRole && this.container.length) {
        this.container.clear();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
