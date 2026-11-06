import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class LoginComponent {

  fg = this.fb.group({
    email: [sessionStorage.getItem('email'), [Validators.required, Validators.email]],
    password: ['somestring', Validators.required],
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }

  login(): void {
    const { email, password } = this.fg.value;
    if (this.fg.valid) {
      this.authService.login(email!, password!).subscribe(value => {
        if (value) {
          this.router.navigate([this.route.snapshot.params['returnUrl'] || '/']);
        }
      });
    }
  }

}
