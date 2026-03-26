import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('RentAPlace_frontend');

  constructor(private authService: AuthService) {}


  // CONCEPT: ngOnInit Lifecycle Hook
  // ngOnInit() runs once when this component (App = root component) first loads.
  // Since App is the root, this runs every time the Angular app boots up.
  // We call logout() here to clear localStorage (token, userId, userRole, userName).
  // This ensures the user must log in fresh every time the app restarts.
  // localStorage persists permanently across sessions — so without this,
  // the user would stay "logged in" even after closing the browser or restarting the server.
 ngOnInit() {
    this.authService.logout();
  }
}