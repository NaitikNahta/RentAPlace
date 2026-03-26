import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  name = '';
  email = '';
  password = '';
  showPassword = false;
  roleId = 3;
  errorMsg = '';
  successMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (!this.name || !this.email || !this.password) {
      this.errorMsg = 'Please fill in all fields';
      return;
    }
    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      roleId: this.roleId
    }).subscribe({
      next: () => {
        this.successMsg = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err: any) => {
        this.errorMsg = err.error || 'Registration failed';
      }
    });
  }
}