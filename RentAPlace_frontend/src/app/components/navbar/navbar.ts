import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    console.log("Navbar login status:", this.authService.isLoggedIn());
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}