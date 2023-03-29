import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from '../button/button.component';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
})
export class LoginComponent {

  fg = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  login(): void {
    const { email, password } = this.fg.value;
    if(this.fg.valid) {
      this.authService.login(email!, password!).subscribe(value => {
        if(value) {
          this.router.navigate(['/'])
        }
      });
    }
  }

}
