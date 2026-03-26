import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  // CONCEPT: RoleGuard — checks BOTH login status AND user role before allowing access.
  // Each route passes its allowed roles via route.data['roles'].
  // If user role doesn't match → redirect to /login.
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: string[] = route.data['roles'];
    const userRole = this.authService.getUserRole();

    if (this.authService.isLoggedIn() && expectedRoles.includes(userRole!)) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}