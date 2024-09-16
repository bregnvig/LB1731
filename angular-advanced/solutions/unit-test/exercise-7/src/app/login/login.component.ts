import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-login',
  template: `
    <div class="d-flex align-items-center h-100">
        <div class="card form-signin">
            <form [formGroup]="fg" (submit)="login()">
                <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
                <input formControlName="email" type="email" class="form-control" placeholder="Email address" autofocus="">
                <input formControlName="password" type="password" class="mt-2 mb-3 form-control" placeholder="Password">
                <app-button type="submit"></app-button>
            </form>
        </div>
    </div>
  `,
  styles: `
    .form-signin {
      width: 100%;
      max-width: 330px;
      padding: 15px;
      margin: 0 auto;
    }
  `,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
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
