import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const Roles = ['anonymous', 'user', 'admin'] as const;
export type Role = typeof Roles[number];


@Injectable({
  providedIn: 'root'
})
export class UserService {

  role$ = new BehaviorSubject<Role>('anonymous');

  constructor() { }

  set role(value: Role) {
    this.role$.next(value);
  }

  get role() {
    return this.role$.value;
  }

  isInRole(role: Role): boolean {
    const currentRoleIndex = Roles.indexOf(this.role);
    const requiredRoleIndex = Roles.indexOf(role);
    return currentRoleIndex >= requiredRoleIndex;
  }
}
