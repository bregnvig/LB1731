import { Injectable } from '@angular/core';

export interface User {
  isLoggedIn: boolean;
  name: string;
}

@Injectable()
export class UserService {

  constructor() { }

   get user(): User {
    return <User> {
      isLoggedIn: true,
      name: 'Flemming'
    }
  }
}
