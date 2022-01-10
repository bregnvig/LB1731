import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AbstractSubscribeUnsubscribeDirective } from 'src/app/rxjs/rxjs-utils';
import { Role, UserService } from './user.service';

@Directive({
  selector: '[loopIsInRole]'
})
export class IsInRoleDirective extends AbstractSubscribeUnsubscribeDirective {

  user: any;

  private hasView: 'condition' | 'elseCondition' | undefined;
  private role: Role = 'anonymous';
  private elseTemplate: TemplateRef<any> | undefined;

  constructor(
    private template: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService
  ) {
    super();
    this.userService.role$.pipe(this.takeUntilDestroyed()).subscribe(() => this.updateView());
  }

  @Input()
  set loopIsInRoleElse(value: TemplateRef<any>) {
    this.elseTemplate = value;
    this.updateView();
  }

  @Input()
  set loopIsInRole(value: Role) {
    this.role = value;
    this.updateView();
  }

  private updateView() {

    const condition = this.userService.isInRole(this.role);
    const userService = this.userService;
    if (condition && this.hasView !== 'condition') {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.template, { get role() { return userService.role; } });
      this.hasView = 'condition';
    } else if (!condition) {
      if (this.elseTemplate && this.hasView !== 'elseCondition') {
        this.viewContainer.clear();
        this.viewContainer.createEmbeddedView(this.elseTemplate, { get role() { return userService.role; } });
        this.hasView = 'elseCondition';
      } else if (!this.elseTemplate && this.hasView !== undefined) {
        this.viewContainer.clear();
        this.hasView = undefined;
      }
    }
  }
}
