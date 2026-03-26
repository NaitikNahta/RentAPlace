import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email = '';
  password = '';
  errorMsg = '';
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Please fill in all fields';
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {

        console.log("LOGIN RESPONSE:", res); // 🔥 IMPORTANT

        // 🔥 FIX: Ensure correct mapping
        this.authService.saveSession({
          token: res.token,
          id: res.id || res.userId,
          name: res.name || res.userName,
          role: res.role
        });

        // navigation
        if (res.role === 'Admin') this.router.navigate(['/admin-dashboard']);
        else if (res.role === 'Owner') this.router.navigate(['/owner-dashboard']);
        else this.router.navigate(['/renter-dashboard']);
      },
      error: () => {
        this.errorMsg = 'Invalid email or password';
      }
    });
  }
}