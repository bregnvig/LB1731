import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  fg = this.fb.group({
    email: [],
    password: [],
  })

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  login(): void {
    const { email, password } = this.fg.value;
    this.authService.login(email, password);
  }

}
