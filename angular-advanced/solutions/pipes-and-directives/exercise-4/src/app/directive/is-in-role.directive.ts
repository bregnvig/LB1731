import { Directive, EmbeddedViewRef, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, Role } from '../service';

@Directive({
  selector: '[loopIsInRole]'
})
export class IsInRoleDirective implements OnInit, OnDestroy {

  @Input() loopIsInRole: Role | undefined;

  private view: EmbeddedViewRef<void> | undefined;
  private subscription: Subscription | undefined;

  constructor(
    private template: TemplateRef<any>,
    private container: ViewContainerRef,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.subscription = this.auth.isInRole$(this.loopIsInRole ?? 'admin').subscribe(isInRole => {
      if (isInRole && !this.view) {
        this.view = this.container.createEmbeddedView(this.template);
        this.view.markForCheck();
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
