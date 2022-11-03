import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { AbstractSubscribeUnsubscribeDirective } from 'src/app/rxjs/rxjs-utils';
import { UserService } from '../user.service';

@Component({
  selector: 'loop-is-in-role',
  templateUrl: './is-in-role.component.html',
  styleUrls: ['./is-in-role.component.scss']
})
export class IsInRoleComponent extends AbstractSubscribeUnsubscribeDirective implements OnInit {

  roleControl = new UntypedFormControl('anonymous');

  constructor(public service: UserService) {
    super();
  }

  ngOnInit(): void {
    this.roleControl.valueChanges.pipe(
      this.takeUntilDestroyed()
    ).subscribe(value => this.service.role = value);
  }

}
