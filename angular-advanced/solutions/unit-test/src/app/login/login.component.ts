import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from '../button/button.component';
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
    this.fg.valid && this.authService.login(email, password);
  }

}

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
  declarations: [LoginComponent],
  exports: [LoginComponent],
})
export class LoginModule {}
