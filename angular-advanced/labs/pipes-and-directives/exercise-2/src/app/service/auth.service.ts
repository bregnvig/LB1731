import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly role$ = new BehaviorSubject<'anonymous' | 'admin'>('anonymous');

}
