import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  fg = this.fb.group({
    email: [, [Validators.required, Validators.email]],
    password: [, Validators.required],
  });

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  login(): void {
    const { email, password } = this.fg.value;
  }

}
