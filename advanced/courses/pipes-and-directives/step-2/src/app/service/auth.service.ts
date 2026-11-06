import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type Role = 'anonymous' | 'admin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly role$ = new BehaviorSubject<Role>('anonymous');

  isInRole$(role: Role): Observable<boolean> {
    return this.role$.pipe(
      map(currentRole => role === 'anonymous' || currentRole === 'admin')
    );
  }
}
