import { Directive, EmbeddedViewRef, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, Role } from '../service';

@Directive({
  selector: '[loopIsInRole]'
})
export class IsInRoleDirective implements OnDestroy {

  private view: EmbeddedViewRef<void> | undefined;
  private subscription: Subscription | undefined;

  constructor(
    private template: TemplateRef<any>,
    private container: ViewContainerRef,
    private auth: AuthService
  ) { }

  @Input() set loopIsInRole(value: Role | undefined) {
    this.subscription?.unsubscribe();
    this.subscription = this.auth.isInRole$(value ?? 'anonymous').subscribe(isInRole => {
      if (isInRole && !this.view) {
        this.view = this.container.createEmbeddedView(this.template);
      } else if (!isInRole && this.view) {
        this.container.clear();
        this.view = undefined;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
